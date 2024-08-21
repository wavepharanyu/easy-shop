<script setup>
  import UserLayout from '../../layouts/UserLayout.vue'
  import { useCartStore } from "../../stores/user/cart";
  import { useRoute } from "vue-router";
  import { ref, onMounted } from "vue";

  const cartStore = useCartStore()
  const orderData = ref({})
  const orderId = ref('')

  const route = useRoute()

  onMounted(async() => {
    try {
      if (!route.query.order_id) {
        throw new Error('order not found')
      }
      orderId.value = route.query.order_id
      await cartStore.loadCheckout(orderId.value)
      orderData.value = cartStore.checkout

      cartStore.clearCart()
    } catch (error) {
      console.log('error', error)
      alert('Order unsuccessful !')
      location.href = '/'
    }
  })

</script>

<template>
  <UserLayout>
  <div class="max-w-2xl mx-auto boder border-base-200 shadow-xl p-8 my-4">
    <div>
      <div class="text-2xl font-bold">Your order is successful</div>
      <div>Hi {{ orderData.name }}</div>
    </div>
    <div class="divider"></div>
    <div class="grid grid-cols-4 gap-2">
      <div>
        <div class="font-bold">Order date</div>
        <div>{{ orderData.createdAt }}</div>
      </div>
      <div>
        <div class="font-bold">Order number</div>
        <div class="break-words">{{ orderData.orderNumber }}</div>
      </div>
      <div>
        <div class="font-bold">Payment method</div>
        <div>{{ orderData.paymentMethod }}</div>
      </div>
      <div>
        <div class="font-bold">Address</div>
        <div>{{ orderData.address }}</div>
      </div>
    </div>
    <div class="divider">
      
    </div>
    <div class="grid grid-cols-4 gap-2 mb-4 items-center" v-for="product in orderData.products" :key="product">
        <div>
          <img :src="product.imageUrl" />
        </div>
        <div class="font-bold">
          {{ product.name }}
        </div>
        <div>
          จำนวน: {{ product.quantity }}
        </div>
        <div>
          ราคารวม: {{ product.quantity * product.price}}
        </div>
    </div>
    <div class="divider"></div>
    <div class="flex justify-between">
        <div class="font-bold">ราคาสินค้าทั้งหมด</div>
        <div>{{ orderData.totalPrice }}</div>
    </div>
    <div class="flex justify-between">
        <div class="font-bold">ค่าส่ง</div>
        <div>0</div>
    </div>
    <div class="flex justify-between">
        <div class="font-bold">ราคาทั้งสิ้น</div>
        <div>{{ orderData.totalPrice }}</div>
    </div>
    <div class="divider"></div>
    <div class="text-center">ขอบคุณที่ใช้บริการ</div>
  </div>
</UserLayout>
  
</template>
