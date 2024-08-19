import { defineStore } from "pinia";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, auth } from "../firebase";

const provider = new GoogleAuthProvider();

export const useAccountStore = defineStore("account", {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: {},
    profile: {}
  }),
  actions: {
    async checkAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async(user) => {
          if (user) {
            this.user = user;
            this.isLoggedIn = true;

            const docRef = doc(db, 'users', user.uid)
            const docSnap = await getDoc(docRef)

            // ถ้าข้อมูลไม่มีอยู่ = เขียนข้อมูลเข้าไปใหม่
            if (!docSnap.exists()) {
                const newUser = {
                    name: user.displayName,
                    role: 'member',
                    status: 'active',
                    updatedAt: new Date()
                }
                await setDoc(docRef, newUser)
                this.profile = newUser
            }
            else {
                this.profile = docSnap.data()
            }
            if (this.profile.role !== 'member') {
                this.isAdmin = true
              }
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    async signInWithGoogle() {
      try {
        const result = await signInWithPopup(auth, provider);
        this.isLoggedIn = true;
        this.user = result.user;
      } catch (error) {
        console.log("error", error);
      }
    },
    async signInAdmin(email, password) {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        this.isLoggedIn = true;
        this.isAdmin = true;
        this.user = result.user;
      } catch (error) {
        switch (error.code) {
          case "auth/invalid-email":
            throw new Error("Invalid email");
          case "auth/wrong-password":
            throw new Error("Wrong password");
          default:
            throw new Error("Login invalid");
        }
      }
    },
    async signOut() {
      this.isLoggedIn = false;
      this.isAdmin = false;
      await signOut(auth);
    },
  },
});
