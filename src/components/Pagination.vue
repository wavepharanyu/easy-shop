<script setup>
import { defineProps } from 'vue'

defineProps({
  maxPage: Number,
  activePage: Number,
  changePage: Function
})
</script>

<template>
  <div class="join mt-2">
    <button
      v-if="activePage - 1 > 0"
      class="join-item btn"
      @click="changePage(activePage-1)">
      «
    </button>
    <button class="join-item btn">
      Page: {{ activePage }} / {{ maxPage }}
    </button>
    <button
      v-if="activePage + 1 <= maxPage"
      class="join-item btn"
      @click="changePage(activePage+1)">
      »
    </button>
  </div>
</template>