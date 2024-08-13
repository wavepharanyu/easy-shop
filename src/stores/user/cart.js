import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    checkout: {}
  }),
  getters: {
    summaryPrice(state) {
        return state.items.reduce((acc, item) => {
            return acc + (item.price*item.quantity)
        },0)
    },
    summaryQuantity(state) {
        return state.items.reduce((acc, item) => acc + item.quantity, 0)
    }
  },
  actions: {
    loadCart(){
        const previousCart = localStorage.getItem('cart-data')
        if(previousCart){
            this.items = JSON.parse(previousCart)
        }
    },
    addToCart(productData) {

        const findProductIndex = this.items.findIndex(item => {
            return item.name === productData.name
        })

        if(findProductIndex < 0){
            productData.quantity = 1
            this.items.push(productData)
        }else{
            const currentItem = this.items[findProductIndex]
            this.updateQuantity(findProductIndex, currentItem.quantity + 1)
        }
      
        localStorage.setItem('cart-data', JSON.stringify(this.items))
    },
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity
      localStorage.setItem('cart-data', JSON.stringify(this.items))
    },
    removeItemInCart(index) {
        this.items.splice(index, 1)
        localStorage.setItem('cart-data', JSON.stringify(this.items))
    },
    placeOrder(userData){
        const orderData = {
            ...userData,
            totalPrice: this.summaryPrice,
            paymentMethod: 'Credit Card',
            createdAt: (new Date()).toLocaleString(),
            orderNumber: `AA${(Math.floor(Math.random() * 900000) + 100000).toString()}`,
            products: this.items
        }
        localStorage.setItem('order-data', JSON.stringify(orderData))
    },
    loadCheckout(){
        const orderData = localStorage.getItem('order-data')
        if(orderData){
            this.checkout = JSON.parse(orderData)
        }
    }
  },
});
