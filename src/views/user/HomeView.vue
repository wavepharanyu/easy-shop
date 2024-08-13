<script setup>
import UserLayout from '../../layouts/UserLayout.vue'
import { useProductStore } from "../../stores/user/product";
import { useCartStore } from "../../stores/user/cart";
import { useRouter } from "vue-router";

import Product from "../../components/Product.vue";

const productStore = useProductStore()
const cartStore = useCartStore()
const router = useRouter()

const addToCart = (product) => {
  cartStore.addToCart(product)
  router.push({ name: 'cart' })
}

</script>

<template>
  <UserLayout>
    <div class="hero bg-base-200 h-96">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Hello to Easy Shop</h1>
          <p class="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
      </div>
    </div>

    <!-- Product List -->
  <Product :products="productStore.list" :addToCart="addToCart">

  </Product>
  </UserLayout>
</template>
