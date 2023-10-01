// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, collection } from "firebase/firestore"
import { GoogleAuthProvider, getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const googleAuthProvider = new GoogleAuthProvider()

export const db = getFirestore(app)

export const walletsCollectionRef = collection(db, "wallets")
export const transactionsCollectionRef = collection(db, "transactions")
export const categresCollectionRef = collection(db, "categories")
