import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import {
  walletsCollectionRef,
  transactionsCollectionRef,
  categresCollectionRef,
} from '../firebase';
import { Router } from '@/routes';

//кожен з методів повертає масив об'єктів. (тут у методах у змінних "responseSnapShot" відповідна колекція посилань на документи, ця колекція потім на кожний елемент викликається метод "data()" який повертає об'єкт з даними документа)

export const getTransactions = async () => {
  const transactionsCollectionByUserQuery = await query(
    transactionsCollectionRef,
    where('owner', '==', 'asd123')
  );
  const responseSnapShot = await getDocs(transactionsCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getWallets = async () => {
  const walletsCollectionByUserQuery = await query(
    walletsCollectionRef,
    where('owner', '==', 'asd123')
  );
  const responseSnapShot = await getDocs(walletsCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};

export const getCategories = async () => {
  const categresCollectionByUserQuery = await query(
    categresCollectionRef,
    where('owner', '==', 'asd123')
  );
  const responseSnapShot = await getDocs(categresCollectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
};


export const getByUser = async (collectionRefName) => {
  const collectionByUserQuery = await query(collectionRefName, where('owner', '==', 'asd123'));
  const responseSnapShot = await getDocs(collectionByUserQuery);
  const res = [];
  responseSnapShot.forEach((p) => res.push(p.data()));
  return res;
}
