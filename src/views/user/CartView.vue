<script setup>
import UserLayout from '../../layouts/UserLayout.vue'
import Close from "../../components/icons/Close.vue";
import { RouterLink } from "vue-router";

import { useCartStore } from "../../stores/user/cart";

const cartStore = useCartStore()

const changeQuantity = (event, index) => {
  const newQuantity = parseInt(event.target.value)
  cartStore.updateQuantity(index, newQuantity)
}

</script>

<template>
  <UserLayout>
    <h1 class="text-3xl font-bold m-4">Shopping cart</h1>
    <div class="flex">
      <div class="flex-auto w-64 bg-base-200 px-4 divide-y divide-gray-300">
        <div v-if="cartStore.items.length === 0">
          Cart is empty
        </div>
        <div v-else class="flex" v-for="(item, index) in cartStore.items" :key="item">
          <div class="my-4">
            <img
              class="w-40 object-center object-cover"
              src="https://fastly.picsum.photos/id/849/200/200.jpg?hmac=LwsdGn2endKvoLY10FPqtfqKYCVMbPEp5J6S_tUN1Yg"
            />
          </div>
          <div class="flex-1 ml-5 my-5">
            <div class="flex flex-col justify-between h-full">
              <div>
                <div class="grid grid-cols-2 relative">
                  <div>
                    <div class="text-xl"><b>{{ item.name }}</b></div>
                    <div>{{ item.about }}</div>
                    <div>{{ item.price }}</div>
                  </div>
                  <div>
                    <select class="w1/2 p-4" :value="item.quantity" @change="changeQuantity($event, index)">
                      <option v-for="quantity in [1,2,3,4,5]" :key="quantity">
                        {{ quantity }}
                      </option>
                    </select>
                  </div>
                  <div @click="cartStore.removeItemInCart(index)" class="absolute right-0 w-4">
                    <Close></Close>
                  </div>
                </div>
              </div>
              <div><b>In stock</b></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-auto w-32 bg-slate-200 p-4">
        <div class="text-xl font-bold">Order Summary</div>
        <div class="my-4 divide-y divide-black">
          <div class="flex justify-between py-2">
            <div>ราคาสินค้าทั้งหมด</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
          <div class="flex justify-between py-2">
            <div>ค่าส่ง</div>
            <div>0</div>
          </div>
          <div class="flex justify-between py-2">
            <div>ราคารวมทั้งหมด</div>
            <div>{{ cartStore.summaryPrice }}</div>
          </div>
          <RouterLink :to="{ name: 'checkout' }" class="btn btn-neutral w-full mt-6">ชำระเงิน</RouterLink>
        </div>
      </div>
    </div>
  </UserLayout>
</template>
