import { defineStore } from 'pinia'
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore'
import { db } from "../../firebase"

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [],
    loaded: false
  }),
  actions: {
    async loadProducts () {
      const productCol = query( collection(db, "products"), where('status', '==', 'open') )
      // const productSnapshot = await getDocs(productCol)
      // const productList = productSnapshot.docs.map(doc => {
      //   const covertedData = doc.data()
      //   covertedData.productId = doc.id
      //   return covertedData
      // })
      // if (productList.length > 0) {
      //   this.list = productList
      //   this.loaded = true
      // }
      onSnapshot(productCol, (snapshot) => {
        const products = snapshot.docs.map(doc => {
          const convertData = doc.data()
          convertData.productId = doc.id
          return convertData
        })
        this.list = products
      })
    },
    filterProducts(searchText) {
      return this.list.filter(product => product.name.includes(searchText))
    }
  }
})
