<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { useCartStore } from "./stores/user/cart";
  import { useProductStore } from "./stores/user/product";
  import { useEventStore } from "./stores/event";
  import { onMounted } from "vue";

  import Toast from "./components/Toast.vue";

  const cartStore = useCartStore()
  const productStore = useProductStore()
  const eventStore = useEventStore()

  onMounted(() => {
    cartStore.loadCart()
    productStore.loadProducts()
  })

</script>

<template>
  <div>
    <Toast
      v-if="eventStore.alert"
      :status="eventStore.data.status"
      :message="eventStore.data.message"
    >
    </Toast>
    <RouterView />
  </div>
</template>


