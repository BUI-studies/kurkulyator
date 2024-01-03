import { doc, getDoc, getDocs, query, where, addDoc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore'

import { walletsCollectionRef, transactionsCollectionRef, categoriesCollectionRef } from '../../firebase'

import { Router } from '@/routes'
import { TRANSACTION_TYPE } from '@/types'
import { getWalletRefByName, getCategoryByNameAndType, updateBalance } from '@/api'

export const getTransactions = async () => {
  const transactionsCollectionByUserQuery = query(
    transactionsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid)
  )
  const responseSnapShot = await getDocs(transactionsCollectionByUserQuery)
  const res = []
  responseSnapShot.forEach((p) => res.push({ id: p.id, ...p.data() }))
  return res
}

/**
 * @param {number} dateRange - number or days
 */
export const getTransactionsByDateRange = async (dateRange = 3) => {
  const transactionsCollectionByUserQuery = query(
    transactionsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid)
  )

  const responseSnapShot = await getDocs(transactionsCollectionByUserQuery)
  const res = []

  responseSnapShot.forEach((p) => res.push(p.data()))
  return res
}

export const saveTransaction = async ({ type, from, to, category, comment, amount, owner, date }) => {
  const newTransactionData = {
    type,
    from: from ? await getWalletRefByName(from) : null,
    to: to ? await getWalletRefByName(to) : null,
    category: await getCategoryByNameAndType(category, type),
    amount: Number(amount),
    comment,
    owner,
    date: Timestamp.fromDate(date),
  }

  await updateBalance(newTransactionData)
  await addDoc(transactionsCollectionRef, newTransactionData)

  return newTransactionData
}

export const deleteTransaction = async (id) => {
  const transactionRef = doc(transactionsCollectionRef, id)
  const transaction = (await getDoc(transactionRef)).data()
  const walletFrom = transaction.from ? (await getDoc(transaction.from)).data() : null
  const walletTo = transaction.to ? (await getDoc(transaction.to)).data() : null

  switch (transaction.type) {
    case TRANSACTION_TYPE.INCOME:
      await updateDoc(transaction.to, {
        balance: walletTo.balance - transaction.amount,
      })
      break
    case TRANSACTION_TYPE.TRANSFER:
      await updateDoc(transaction.from, {
        balance: walletTo.balance + transaction.amount,
      })
      await updateDoc(transaction.to, {
        balance: walletTo.balance - transaction.amount,
      })
      break
    case TRANSACTION_TYPE.CORRECTION:
      await updateDoc(transaction.to, {
        balance: walletTo.balance - transaction.amount,
      })
      break
    case TRANSACTION_TYPE.OUTCOME:
      await updateDoc(transaction.from, {
        balance: walletFrom.balance + transaction.amount,
      })
      break
    default:
      throw new TypeError('Unknown transaction type')
  }

  await deleteDoc(transactionRef)
}
