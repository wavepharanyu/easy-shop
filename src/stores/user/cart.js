import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

import {
    doc,
    getDoc
} from 'firebase/firestore'

import {
    ref as databaseRef,
    set,
    onValue,
    remove
} from 'firebase/database'

import {
    db,
    realtimeDB
} from '@/firebase'

import { useAccountStore } from "../account";

Omise.setPublicKey(import.meta.env.VITE_OMISE_PUBLIC_KEY)

const createSource = (amount) => {
    return new Promise((resolve, reject) => {
        // ทำการส่ง source ที่ต้องการจ่ายไป omise เพื่อนำ source token กลับมา
        Omise.createSource('rabbit_linepay', {
        amount: (amount * 100),
        currency: 'THB'
        }, (statusCode, response) => {
        if (statusCode !== 200) {
            return reject(response)
        }
        resolve(response)
        })
    })
}

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
    },
    user(state) {
        const accountStore = useAccountStore()
        return accountStore.user
    },
    cartRef (state) {
      return databaseRef(realtimeDB, `carts/${this.user.uid}`)
    }
  },
  actions: {
    async loadCart(){
        if(this.user.uid){
            onValue(this.cartRef, (snapshot) => {
                const data = snapshot.val()
                this.items = data || []
            }, (err) => {
                console.log('error', err)
            })
        }else{
            const previousCart = localStorage.getItem('cart-data')
            if(previousCart){
                this.items = JSON.parse(previousCart)
            }
        }    
    },
    async clearCart(){
        if(this.user.uid){
            remove(this.cartRef).then(()=> {
                console.log('clear cart')
            }).catch((err) =>{
                console.log('error', err)
            })
        }
    },

    async addToCart(productData) {

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
        
        // ทำการเพิ่มของเข้า cart ลง realtime database
        await set(this.cartRef, this.items)
        localStorage.setItem('cart-data', JSON.stringify(this.items))
    },
    async updateQuantity(index, quantity) {
      this.items[index].quantity = quantity
      // ทำการเพิ่มของเข้า cart ลง realtime database
      await set(this.cartRef, this.items)
      localStorage.setItem('cart-data', JSON.stringify(this.items))
    },
    async removeItemInCart(index) {
        this.items.splice(index, 1)
        // ทำการเพิ่มของเข้า cart ลง realtime database
        await set(this.cartRef, this.items)
        localStorage.setItem('cart-data', JSON.stringify(this.items))
    },
    async placeOrder(userData){
        try {
            const checkoutData = {
                ...userData,
                products: this.items.map(product => ({
                    productId: product.productId,
                    quantity: product.quantity
                }))
            }

            const omiseResponse = await createSource(this.summaryPrice)

            const response = await axios.post('/api/placeorder',{
                source: omiseResponse.id,
                checkout: checkoutData
            })

            return response.data
        }catch (error) {
            console.log('error', error.code)
            throw new Error('out of stock')
        }
    },

    async loadCheckout (orderId) {
        try {
          const orderRef = doc(db, 'orders', orderId)
          const docSnap = await getDoc(orderRef)
          let checkoutData = docSnap.data()
          checkoutData.orderNumber = orderId
          checkoutData.createdAt = checkoutData.createdAt.toDate()
          // ส่งต่อข้อมูลไป checkout
          this.checkout = checkoutData
        } catch (error) {
          throw new Error(error.message)
        }
    }
  },
});
