import { defineStore } from 'pinia'

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'

import { db } from "../../firebase"

export const useAdminOrderStore = defineStore('admin-order', {
  state: () => ({
    list: []
  }),
  actions: {
    async loadOrder () {
      const orderRef = collection(db, 'orders')
      const orderSnapshot = await getDocs(orderRef)
      const orderList = orderSnapshot.docs.map(doc => {
        let convertedData = doc.data()
        convertedData.createdAt = convertedData.createdAt.toDate()
        convertedData.orderId = doc.id
        return convertedData
      })
      this.list = orderList
    },
    async getOrder (orderId) {
      try {
        const orderRef = doc(db, 'orders', orderId)
        const orderSnapshot = await getDoc(orderRef)
        let orderData = orderSnapshot.data()
        orderData.createdAt = orderData.createdAt.toDate()
        orderData.orderId = orderSnapshot.id
        return orderData
      } catch (error) {
        console.log('error', error)
      }
    }
  }
})