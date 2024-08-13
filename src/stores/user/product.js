import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    list: [],
    loaded: false
  }),
  actions: {
    loadProducts () {
      const productList = localStorage.getItem('admin-products')
      if (productList) {
        this.list = JSON.parse(productList)
        this.loaded = true
      }
    },
    filterProducts(searchText) {
      return this.list.filter(product => product.name.includes(searchText))
    }
  }
})
