<script setup>
import { onMounted , ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminOrderStore } from "../../../stores/admin/order";

import AdminLayout from "../../../layouts/AdminLayout.vue";

const route = useRoute()
const adminOrderStore = useAdminOrderStore()

const orderId = ref(-1)
let orderData = ref({
  products: []
})

onMounted(() => {
  if (route.params.id) {
    orderId.value = parseInt(route.params.id)
    orderData.value = adminOrderStore.getOrder(orderId.value)
  }
})
</script>

<template>
  <AdminLayout>
    <div class="flex pt-8 px-6">
      <div class="card w-full p-6 bg-base-100 shadow-xl">
        <div>
          <h1 class="text-3xl font-bold">Order detail id: {{ orderId }}</h1>
        </div>
        <div class="divider"></div>
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div>
            <div class="font-bold">Order date</div>
            <div>{{ orderData.updatedAt }}</div>
          </div>
          <div>
            <div class="font-bold">Order Number</div>
            <div>{{ orderData.no }}</div>
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
        <div class="divider"></div>
        <div
          v-for="(product, index) in orderData.products"
          class="flex items-center my-3"
          :key="index"
        >
          <div>
            <img class="w-24" :src="product.imageUrl" />
          </div>
          <div class="flex-1 ml-4">
            <div class="font-bold">{{ product.name }}</div>
            <div>{{ product.description }}</div>
          </div>
          <div class="flex-1">จำนวน {{ product.quantity }} ชิ้น</div>
          <div>{{ product.price }} ฿</div>
        </div>
        <div class="divider"></div>
        <div class="flex align-middle justify-between mb-2">
          <div class="font-bold">ราคาสินค้าทั้งหมด</div>
          <div>{{ orderData.totalPrice }} ฿</div>
        </div>
        <div class="flex justify-end mt-8">
          <RouterLink :to="{ name: 'admin-orders-list' }" class="btn btn-neutral w-1/6">
            Back
          </RouterLink>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
