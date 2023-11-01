import { doc, getDoc, getDocs, query, where, addDoc } from 'firebase/firestore';
import {
  walletsCollectionRef,
  transactionsCollectionRef,
  categresCollectionRef,
} from '../firebase';
import { Router } from '@/routes';

export const getTransactions = async () => {
  const transactionsCollectionByUserQuery = await query(
    transactionsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
  );
  const responseSnapShot = await getDocs(transactionsCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

/**
 * @param {number} dateRange - number or days
 */
export const getTransactionsByDateRange = async (dateRange = 3) => {
  const transactionsCollectionByUserQuery = await query(
    transactionsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
  );

  const responseSnapShot = await getDocs(transactionsCollectionByUserQuery);
  const res = [];

  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getWallets = async () => {
  const walletsCollectionByUserQuery = await query(
    walletsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
  );
  const responseSnapShot = await getDocs(walletsCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getCategories = async () => {
  const categresCollectionByUserQuery = await query(
    categresCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
  );
  const responseSnapShot = await getDocs(categresCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getByUser = async (collectionRefName) => {
  const collectionByUserQuery = await query(
    collectionRefName,
    where('owner', '==', Router.getCurrentUser().uid),
  );
  const responseSnapShot = await getDocs(collectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getWallet = async (title) => {
  const result = await query(
    walletsCollectionRef, 
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', title)
  );
  const querySnapshot = await getDocs(result);

  if (querySnapshot.docs.length === 0) {
    return null;
  }
  return querySnapshot.docs[0].data();
};

export const saveWallet = async (obj) => {
  const checkWallet = await getWallet(obj.title);

  if (checkWallet !== null) throw new ReferenceError('The Wallet has already exist');

  return await addDoc(walletsCollectionRef, obj);
};

export const getWalletRefByName = async (walletName) => {
  const walletsQuery = await query(
    walletsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', walletName),
  );

  const responseSnapShot = await getDocs(walletsQuery);

  return responseSnapShot.docs[0] ? doc(walletsCollectionRef, responseSnapShot.docs[0].id) : null;
};

export const getCategoryRefByName = async (categoryName) => {
  const categoryQuery = await query(
    categoriesCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', categoryName),
  );

  const responseSnapShot = await getDocs(categoryQuery);

  return responseSnapShot.docs[0]
    ? doc(categoriesCollectionRef, responseSnapShot.docs[0].id)
    : null;
};
