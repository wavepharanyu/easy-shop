import { defineStore } from 'pinia'

import {
  collection,
  getDocs,
  doc,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  query
} from 'firebase/firestore'

import { db } from '@/firebase'

export const useAdminProductStore = defineStore('admin-product', {
  state: () => ({
    list: [],
    loaded: false
  }),
  actions: {
    async loadProducts () {
      try {
        const productsCol = collection(db, 'products')
        const productSnapshot = await getDocs(productsCol)
        const products = productSnapshot.docs.map(doc => {
          const convertedData = doc.data()
          convertedData.updatedAt = convertedData.updatedAt.toDate()
          convertedData.productId = doc.id
          return convertedData
        })
        this.list = products
      } catch (error) {
        console.log('error', error)
      }
    },
    async getProduct (productId) {
      try {
        const docRef = doc(db, 'products', productId)
        const docSnap = await getDoc(docRef)
        return docSnap.data()
      } catch (error) {
        console.log('error', error)
      }
    },
    async addProduct (productData) {
      productData.remainQuantity = productData.quantity
      productData.updatedAt = new Date()
      const productsCol = collection(db, 'products')
      try {
        await addDoc(productsCol, productData)
      } catch (error) {
        console.log('error', error)
      }
    },
    async updateProduct (productId, productData) {
      try {
        const updatedProduct = {
          name: productData.name,
          imageUrl: productData.imageUrl,
          quantity: productData.quantity,
          price: productData.price,
          remainQuantity: productData.quantity,
          status: productData.status,
          about: productData.about,
          updatedAt: new Date()
        }
        const docRef = doc(db, 'products', productId)
        await setDoc(docRef, updatedProduct)
      } catch (error) {
        console.log('error', error)
      }
    },
    async removeProduct (productId) {
      try {
        const docRef = doc(db, 'products', productId)
        await deleteDoc(docRef, productId)
      } catch (error) {
        console.log('error', error)
      }
    }
  }
})