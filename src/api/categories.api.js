import { doc, getDoc, getDocs, query, where, addDoc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore'

import { walletsCollectionRef, transactionsCollectionRef, categoriesCollectionRef } from '../../firebase'

import { Router } from '@/routes'

import { TRANSACTION_TYPE } from '@/types/index.js'

export const getCategoryByNameAndType = async (categoryName, categoryType) => {
  const categoryQuery = query(
    categoriesCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', categoryName),
    where('type', '==', categoryType)
  )

  const responseSnapShot = await getDocs(categoryQuery)

  return responseSnapShot.docs[0] ? doc(categoriesCollectionRef, responseSnapShot.docs[0].id) : null
}

export const getCategories = async () => {
  const categoriesCollectionByUserQuery = query(
    categoriesCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid)
  )
  const responseSnapShot = await getDocs(categoriesCollectionByUserQuery)
  const res = []
  responseSnapShot.forEach((p) => res.push({ ...p.data(), id: p.id }))
  return res
}

export const getCategoriesByType = async (type = TRANSACTION_TYPE.INCOME) => {
  const categoriesQuery = query(
    categoriesCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('type', '==', type)
  )

  const querySnapshot = await getDocs(categoriesQuery)
  const result = []
  querySnapshot.forEach((docRef) => {
    result.push({ id: docRef.id, ...docRef.data() })
  })
  return result
}

export const addNewCategory = async (collectionRefName, obj) => {
  await addDoc(collectionRefName, obj)
}

export const deleteCategory = async (id) => {
  const categoryRef = doc(categoriesCollectionRef, id)
  await deleteDoc(categoryRef)
}
