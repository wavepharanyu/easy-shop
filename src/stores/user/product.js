import { defineStore } from 'pinia'
import { collection, getDocs } from 'firebase/firestore'
import { db } from "../../firebase"

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [],
    loaded: false
  }),
  actions: {
    async loadProducts () {
      const productSnapshot = await getDocs(collection(db, "products"))
      const productList = productSnapshot.docs.map(doc => doc.data())
      if (productList.length > 0) {
        this.list = productList
        this.loaded = true
      }
    },
    filterProducts(searchText) {
      return this.list.filter(product => product.name.includes(searchText))
    }
  }
})
