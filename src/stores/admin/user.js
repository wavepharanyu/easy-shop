import { defineStore } from "pinia";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'

import { db } from "../../firebase";

export const useAdminUserStore = defineStore("admin-user", {
  state: () => ({
    loaded: false,
    list: [],
  }),
  actions: {
    async loadUser() {
      const usersCol = collection(db, 'users')
      const userSnapshot = await getDocs(usersCol)

      const userList = userSnapshot.docs.map(doc => {
        let convertedData = doc.data()
        convertedData.updatedAt = convertedData.updatedAt.toDate()
        convertedData.uid = doc.id
        return convertedData
      })
      if (userList && userList.length > 0) {
        this.list = userList
      }
      this.loaded = true
    },
    async getUser(uid) {
      try {
        const docRef = doc(db, 'users', uid)
        const docSnap = await getDoc(docRef)
        return docSnap.data()
      } catch (error) {
        console.log('error', error)
      }
    },
    async updateUser(uid, userData) {
      try {
        let updatedUser = {
          name: userData.name,
          status: userData.status,
          role: userData.role,
          updatedAt: new Date()
        }
        const docRef = doc(db, 'users', uid)
        await setDoc(docRef, updatedUser)
      } catch (error) {
        console.log('error', error)
      }
    },
    removeUser(index) {
      this.list.splice(index, 1);
    },
  },
});
