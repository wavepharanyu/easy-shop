import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator  } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getDatabase, connectDatabaseEmulator } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyD7zSgZwxk0R5c1eQqQySylXAfcVj4_bZ0",
  authDomain: "easy-commerce-shop.firebaseapp.com",
  databaseURL: "https://easy-commerce-shop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "easy-commerce-shop",
  storageBucket: "easy-commerce-shop.appspot.com",
  messagingSenderId: "266775565474",
  appId: "1:266775565474:web:68c9a9fa730a2f6a0333fb",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
connectFirestoreEmulator(db, '127.0.0.1', 8080)

const auth = getAuth(app)
connectAuthEmulator(auth, 'http://127.0.0.1:9099')

const storage = getStorage()
connectStorageEmulator(storage, '127.0.0.1', 9199)

const realtimeDB = getDatabase()
connectDatabaseEmulator(realtimeDB, '127.0.0.1', 9000)

export {
  db,
  auth,
  storage,
  realtimeDB
}