<script setup>
  import { onMounted, ref, computed, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";

  import UserLayout from '../../layouts/UserLayout.vue'
  import Product from "../../components/Product.vue";

  import { useProductStore } from "../../stores/user/product";
  import { useCartStore } from "../../stores/user/cart";

  const route = useRoute()
  const searchText = ref('')

  const productStore = useProductStore()
  const cartStore = useCartStore()

  const filterProducts = computed(() => {
    return productStore.filterProducts(searchText.value)
  })

  const router = useRouter()

  const addToCart = (product) => {
    cartStore.addToCart(product)
    router.push({ name: 'cart' })
  }

  watch(() => route.query.q, (newSearchText) => {
    searchText.value = newSearchText
  },{immediate: true})
</script>

<template>
  <UserLayout>
    <div class="text-3xl m-4">
      Search: <b>{{ searchText }}</b>
    </div>
    <Product :products="filterProducts" :addToCart="addToCart"> </Product>
  </UserLayout>
</template>
