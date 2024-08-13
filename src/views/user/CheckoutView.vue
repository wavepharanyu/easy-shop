<script setup>
import UserLayout from '../../layouts/UserLayout.vue'
import { reactive } from "vue";
import { useRouter } from "vue-router";

import { useCartStore } from "../../stores/user/cart";

const cartStore = useCartStore()
const router = useRouter()

const FormData = [
  {
    name: 'Email Address',
    field: 'email'
  },
  {
    name: 'Name',
    field: 'name'
  },
  {
    name: 'Address',
    field: 'address'
  },
  {
    name: 'Note',
    field: 'note'
  }
]

const userFormData = reactive({

})

const payment = () => {
  cartStore.placeOrder(userFormData)
  router.push({ name: 'success' })
}
</script>

<template>
  <UserLayout>
    <h1 class="text-3xl font-bold m-4">Checkout</h1>
    <div>
      <div class="flex">
        <section class="flex-auto w-64 bg-base-200 p-8">
          <label
            v-for="form in FormData"
            :key="form.name"
            class="form-control w-full"
          >
            <div class="label">
              <span class="label-text">{{ form.name }}</span>
            </div>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              v-model="userFormData[form.field]"
            />
          </label>
          <button @click="payment()" class="btn btn-neutral w-full my-6">
            ชำระเงิน
          </button>
        </section>
        <section class="flex-auto w-32 bg-slate-200">
          <div class="px-8">
            <ul>
              <li
                v-for="(item, index) in cartStore.items"
                class="px-2 flex py-6"
                :key="index"
              >
                <img
                  class="w-40 object-cover object-center"
                  :src="item.imageUrl"
                />
                <div class="flex flex-col justify-between ml-4">
                  <div>
                    <div>{{ item.name }}</div>
                    <div>จำนวน: {{ item.quantity }}</div>
                  </div>
                  <div class="flex mt-2">
                    <RouterLink :to="{ name: 'cart' }">
                      <button>Edit</button>
                    </RouterLink>
                  </div>
                </div>
              </li>
            </ul>
            <div class="divider"></div>
            <div class="mb-4">
              <h2 class="text-2xl">Order summary</h2>
              <div class="mt-4 m-0">
                <div class="flex align-middle justify-between mb-2">
                  <div class="font-bold">ราคาสินค้าทั้งหมด</div>
                  <div>{{ cartStore.summaryPrice }}</div>
                </div>
                <div class="flex align-middle justify-between mb-2">
                  <div class="font-bold">ค่าส่ง</div>
                  <div>0</div>
                </div>
                <div class="divider"></div>
                <div class="flex align-middle justify-between mb-2">
                  <div class="font-bold">ราคาทั้งสิ้น</div>
                  <div>{{ cartStore.summaryPrice }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </UserLayout>
</template>
