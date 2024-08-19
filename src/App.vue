<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useCartStore } from "./stores/user/cart";
  import { useProductStore } from "./stores/user/product";
  import { useEventStore } from "./stores/event";
  import { onMounted } from "vue";

  const cartStore = useCartStore()
  const productStore = useProductStore()
  const eventStore = useEventStore()

  onMounted(() => {
    cartStore.loadCart()
    productStore.loadProducts()
  })

</script>

<template>
  <div v-if="eventStore.alert" class="toast">
    <div :class="`alert alert-${eventStore.data.status}`">
      <span class="text-white">{{ eventStore.data.message }}</span>
    </div>
  </div>
  <RouterView />
</template>


