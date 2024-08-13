import { defineStore } from 'pinia'

export const useAdminProductStore = defineStore('admin-product', {
  state: () => ({
    list: [],
    loaded: false
  }),
  actions: {
    loadProduct () {
      const productList = localStorage.getItem('product-data')
      if (productList) {
        this.list = JSON.parse(productList)
      }
    },
    getProduct (index) {
      return this.list[index]
    },
    addProduct (productData) {
      productData.remainQuantity = productData.quantity
      productData.updatedAt = (new Date).toLocaleString()
      this.list.push(productData)
      // save to localstorage
      localStorage.setItem('admin-products', JSON.stringify(this.list))
    },
    updateProduct (index, productData) {
      const fields = ["name", "imageUrl", "quantity", "remainQuantity", "status"];
      for (let field of fields) {
        this.list[index][field] = productData[field];
      }
      this.list[index].updatedAt = new Date().toLocaleString();

      // save to localstorage
      localStorage.setItem('admin-products', JSON.stringify(this.list))
    },
    removeProduct (index) {
      this.list.splice(index, 1)
      // save to localstorage
      localStorage.setItem('admin-products', JSON.stringify(this.list))
    }
  }
})