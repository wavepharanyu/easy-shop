import { defineStore } from "pinia";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

export const useAccountStore = defineStore("account", {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    user: {},
  }),
  actions: {
    async checkAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            this.user = user;
            this.isLoggedIn = true;
            if (this.user.email === 'admin@test.com') { 
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
