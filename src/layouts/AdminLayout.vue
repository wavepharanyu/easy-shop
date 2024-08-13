<script setup>
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menus = [
  {
    name: 'Dashboard',
    route: '/admin/dashboard',
  },
  {
    name: 'Product',
    route: '/admin/products',
  },
  {
    name: 'Order',
    route: '/admin/orders',
  },
  {
    name: 'User',
    route: '/admin/users',
  },
  {
    name: 'Logout',
    route: '/admin/login',
  },
]

const currentPath = ref('')
currentPath.value = route.path
</script>

<template>
  <div class="drawer drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content p-4 mx-4">
      <slot></slot>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <ul class="menu p-4 w-60 h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <li class="mb-2 font-semibold text-3xl">
          <div>Admin {{ pageName }}</div>
        </li>
        <li v-for="menu in menus" :key="menu">
          <RouterLink :to="menu.route" :class="`${currentPath === menu.route ? 'active' : ''} mb-2`">
            {{ menu.name }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
