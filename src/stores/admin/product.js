import { defineStore } from 'pinia'

import {
  collection,
  getDocs,
  doc,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  limitToLast,
  getCountFromServer,
  startAfter,
  endBefore
} from 'firebase/firestore'

import { db } from '@/firebase'

export const useAdminProductStore = defineStore('admin-product', {
  state: () => ({
    docList: [],
    search: {
      text: '',
      status: '',
      sort: 'asc'
    },
    total: 1,
    page: {
      activePage: 1
    },
  }),
  getters: {
    list(state) {
      return state.docList.map(doc => {
        let convertedData = doc.data()
        convertedData.updatedAt = convertedData.updatedAt.toDate()
        convertedData.productId = doc.id
        return convertedData
      })
    },
    totalPage (state) {
      return Math.ceil(state.total / 2)
    }
  },
  actions: {
    async loadProducts () {
      try {
        let productsCol = collection(db, 'products')

        if (this.search.text) {
          productsCol = query(
            productsCol,
            where('name', '==', this.search.text),
          )
        }

        if (this.search.status) {
          productsCol = query(
            productsCol,
            where('status', '==', this.search.status),
          )
        }

        const countProductQuery = query(
          productsCol,
          orderBy('updatedAt', this.search.sort),
        )

        productsCol = query(
          countProductQuery,
          limit(2) 
        )

        const productSnapshot = await getDocs(productsCol)
        this.docList = productSnapshot.docs || []
        this.page.activePage = 1

        // calculate total
        const allSnapshot = await getCountFromServer(countProductQuery)
        this.total = allSnapshot.data().count
        
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
    },
    async changeSortOrder (newSort) {
      try {
        this.search.sort = newSort
        await this.loadProducts()
      } catch (error) {
        console.log('error', error)
      }
    },
    async changeFilterStatus (newStatus) {
      try {
        this.search.status = newStatus
        await this.loadProducts()
      } catch (error) {
        console.log('error', error)
      }
    },
    async loadNextProduct (mode) {
      let productQuery = query(
        collection(db, 'products'),
        orderBy('updatedAt', this.search.sort),
      )
      if (this.search.status) {
        productQuery = query(
          productQuery,
          where('status', '==', this.search.status),
        )
      }
      if (mode === 'next') {
        const lastDocument = this.docList[this.docList.length - 1]
        productQuery = query(
          productQuery,
          startAfter(lastDocument),
          limit(2)
        )
      } else {
        const firstDocument = this.docList[0]
        productQuery = query(
          productQuery,
          endBefore(firstDocument),
          limitToLast(2)
        )
      }
      const productSnapshot = await getDocs(productQuery)
      this.docList = productSnapshot.docs
    }
  },
})