import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
  or,
  and,
} from 'firebase/firestore'

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

  return Promise.all(
    res.map(async (t) => {
      return {
        ...t,
        to: t.to ? (await getDoc(t.to)).data().name : null,
        from: t.from ? (await getDoc(t.from)).data().name : null,
        category: t.category ? (await getDoc(t.category)).data().name : null,
        date: t.date.toDate().toLocaleString(),
        comment: !t.comment ? 'Empty' : t.comment,
        delete: `<button id="${t.id}" class="remove-transaction"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>`,
      }
    })
  )
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

export const getTransactionsByWallet = async (walletID) => {
  const walletRef = doc(walletsCollectionRef, walletID)

  const transactionsCollectionByWalletName = query(
    transactionsCollectionRef,
    and(
      where('owner', '==', Router.getCurrentUser().uid),
      or(where('to', '==', walletRef), where('from', '==', walletRef))
    )
  )

  const responseSnapshot = await getDocs(transactionsCollectionByWalletName)
  const res = []
  responseSnapshot.forEach((p) => res.push({ id: p.id, ...p.data() }))

  return Promise.all(
    res.map(async (t) => {
      return {
        ...t,
        to: t.to ? (await getDoc(t.to)).data().name : null,
        from: t.from ? (await getDoc(t.from)).data().name : null,
        category: t.category ? (await getDoc(t.category)).data().name : null,
        date: t.date.toDate().toLocaleString(),
        comment: !t.comment ? 'Empty' : t.comment,
        delete: `<button id="${t.id}" class="remove-transaction"><svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button>`,
      }
    })
  )
}
