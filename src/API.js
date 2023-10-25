import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import {
  walletsCollectionRef,
  transactionsCollectionRef,
  categoriesCollectionRef,
} from '../firebase';
import { Router } from '@/routes';

export const getTransactions = async () => {
  const transactionsCollectionByUserQuery = await query(
    transactionsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid)
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
    where('owner', '==', Router.getCurrentUser().uid)
  );

  const responseSnapShot = await getDocs(transactionsCollectionByUserQuery);
  const res = [];

  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getWallets = async () => {
  const walletsCollectionByUserQuery = await query(
    walletsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid)
  );
  const responseSnapShot = await getDocs(walletsCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getWalletRefByName = async (walletName) => {
  const walletsQuery = await query(
    walletsCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('name', '==', walletName)
  );

  const responseSnapShot = await getDocs(walletsQuery);
  return responseSnapShot.docs[0];
};

export const getCategories = async () => {
  const categoriesCollectionByUserQuery = await query(
    categoriesCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid)
  );
  const responseSnapShot = await getDocs(categoriesCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getCategoriesByType = async (type = 'income') => {
  const categoriesQuery = query(
    categoriesCollectionRef,
    where('owner', '==', Router.getCurrentUser().uid),
    where('type', '==', type)
  );

  const querySnapshot = await getDocs(categoriesQuery);
  const result = [];
  querySnapshot.forEach((docRef) => {
    result.push({ id: docRef.id, ...docRef.data() });
  });
  // return res.data();
  return result;
};

export const getByUser = async (collectionRefName) => {
  const collectionByUserQuery = await query(
    collectionRefName,
    where('owner', '==', Router.getCurrentUser().uid)
  );
  const responseSnapShot = await getDocs(collectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};
