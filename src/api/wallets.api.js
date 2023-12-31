import { doc, getDoc, getDocs, query, where, addDoc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore'

import { walletsCollectionRef, transactionsCollectionRef, categoriesCollectionRef } from '../../firebase'

import { Router } from '@/routes'

import { TRANSACTION_TYPE } from '@/types/index.js'

export const getWallets = async () => {
  const walletsCollectionByUserQuery = query(walletsCollectionRef, where('owner', '==', Router.getCurrentUser().uid))
  const responseSnapShot = await getDocs(walletsCollectionByUserQuery)
  const res = []
  responseSnapShot.forEach((p) => res.push(p.data()))
  return res
}

export const getWalletRefByName = async (walletName) => {
  const walletsQuery = query(
    walletsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', walletName)
  )

  const responseSnapShot = await getDocs(walletsQuery)

  return responseSnapShot.docs[0] ? doc(walletsCollectionRef, responseSnapShot.docs[0].id) : null
}

export const getWallet = async (name) => {
  const result = query(
    walletsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', name)
  )
  const querySnapshot = await getDocs(result)

  if (querySnapshot.docs.length === 0) {
    return null
  }
  return querySnapshot.docs[0].data()
}

export const saveWallet = async (obj) => {
  const checkWallet = await getWallet(obj.name)

  if (checkWallet !== null) throw new ReferenceError('The Wallet already exists')

  return await addDoc(walletsCollectionRef, obj)
}

export const updateBalance = async (transactionData) => {
  switch (transactionData.type) {
    case TRANSACTION_TYPE.CORRECTION:
      if (transactionData.comment === '') {
        transactionData.comment = 'Корекція балансу гаманцю'
      }
    case TRANSACTION_TYPE.INCOME:
      const walletToData = (await getDoc(transactionData.to)).data()
      await updateDoc(transactionData.to, {
        balance: walletToData.balance + transactionData.amount,
      })

      break
    case TRANSACTION_TYPE.OUTCOME:
      const walletFromData = (await getDoc(transactionData.from)).data()

      await updateDoc(transactionData.from, {
        balance: walletFromData.balance - transactionData.amount,
      })

      break
    case TRANSACTION_TYPE.TRANSFER:
      const walletFromDataTransfer = (await getDoc(transactionData.from)).data()

      const walletToDataTransfer = (await getDoc(transactionData.to)).data()

      await updateDoc(transactionData.from, {
        balance: walletFromDataTransfer.balance - transactionData.amount,
      })

      await updateDoc(transactionData.to, {
        balance: walletToDataTransfer.balance + transactionData.amount,
      })

      break
  }
}
