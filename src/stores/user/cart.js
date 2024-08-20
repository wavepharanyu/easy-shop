import { ref, computed } from "vue";
import { defineStore } from "pinia";

import {
    doc,
    increment,
    updateDoc,
    writeBatch
} from 'firebase/firestore'
import { db } from "../../firebase";

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
    async placeOrder(userData){
        try {
            const orderData = {
                ...userData,
                totalPrice: this.summaryPrice,
                paymentMethod: 'Credit Card',
                createdAt: (new Date()).toLocaleString(),
                orderNumber: `AA${(Math.floor(Math.random() * 900000) + 100000).toString()}`,
                products: this.items
            }

            const batch = writeBatch(db)
            // workaround (update stock = checkout complete), not write order
            for (const product of orderData.products) {
                const productRef = doc(db, 'products', product.productId)
                // update จำนวน remainQuantity ลงทีละ 1
                batch.update(productRef, {
                    remainQuantity: increment(-1)
                })
            }
            await batch.commit()

            localStorage.setItem('order-data', JSON.stringify(orderData))
        }catch (error) {
            console.log('error', error.code)
            throw new Error('out of stock')
        }
    },
    loadCheckout(){
        const orderData = localStorage.getItem('order-data')
        if(orderData){
            this.checkout = JSON.parse(orderData)
        }
    }
  },
});
