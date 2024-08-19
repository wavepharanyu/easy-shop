<script setup>
import { useAdminProductStore } from "../../../stores/admin/product";
import { useEventStore } from '@/stores/event'

import { RouterLink } from 'vue-router'

import AdminLayout from "../../../layouts/AdminLayout.vue";
import TrashIcon from "../../../components/icons/Trash.vue"
import EditIcon from '../../../components/icons/Edit.vue'
import Table from "../../../components/Table.vue";
import Pagination from "../../../components/Pagination.vue";
import { onMounted, ref } from "vue";

const adminProductStore = useAdminProductStore()
const eventStore = useEventStore()

onMounted(async()=>{
  await adminProductStore.loadProducts()
})

const deleteProduct = async(productId) => {
  try {
    await adminProductStore.removeProduct(productId)
    await adminProductStore.loadProducts()
  } catch (error) {
    console.log('error', error)
  }
  
  eventStore.popupMessage('success', 'DELETE Successful!')
}

const search = async () => {
  await adminProductStore.loadProducts()
}

const changePage = async (page) => {
  const mode = page > adminProductStore.page.activePage ? 'next' : 'previous'
  adminProductStore.page.activePage = page
  await adminProductStore.loadNextProduct(mode)
}

</script>
<template>
  <AdminLayout>
    <div class="flex-1 pt-8 px-6 bg-base-100">
      <div class="card w-full p-6 mt-2">
        <div class="text-3xl font-semibold inline-block">
          Product
          <div class="inline-block float-right">
            <div class="inline-block float-right">
              <RouterLink
                :to="{name: 'admin-products-create'}"
                class="btn px-6 btn-sm normal-case btn-primary"
              >
                Add New
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="divider mt-2"></div>
        <div class="flex justify-between">
          <div class="flex-1">
            <input v-model="adminProductStore.search.text" placeholder="Type here" class="input input-bordered w-full" />
          </div>
          <div class="flex-1 ml-2">
            Updated at
            <div class="join ml-2">
              <button
                class="btn join-item"
                :class="adminProductStore.search.sort === 'asc' ? 'btn-active' : ''"
                @click="adminProductStore.changeSortOrder('asc')">
                ASC
              </button>
              <button
                class="btn join-item"
                :class="adminProductStore.search.sort === 'desc' ? 'btn-active' : ''"
                @click="adminProductStore.changeSortOrder('desc')">
                DESC
              </button>
            </div>
          </div>
          <div class="flex-1 ml-2">
            Status
            <div class="join ml-2">
              <button
                class="btn join-item"
                :class="adminProductStore.search.status === 'open' ? 'btn-active' : ''"
                @click="adminProductStore.changeFilterStatus('open')">
                open
              </button>
              <button
                class="btn join-item"
                :class="adminProductStore.search.status === 'close' ? 'btn-active' : ''"
                @click="adminProductStore.changeFilterStatus('close')">
                close
              </button>
            </div>
          </div>
          <div class="flex-1">
            <button class="btn" @click="search">Search</button>
          </div>
        </div>
        <div class="h-full w-full pb-6 bg-base-100">
          <div class="overflow-x-auto w-full">
            <Table :headers="['Name', 'Image', 'Price', 'Quantity', 'Status', 'Updated at','']">
                <tr v-for="(product, index) in adminProductStore.list" :key="index">
                  <td>
                    <div class="font-bold">{{ product.name }}</div>
                  </td>
                  <td>
                    <div class="mask mask-squircle w-12 h-12">
                      <img :src="product.imageUrl" />
                    </div>
                  </td>
                  <td>{{ product.price }}</td>
                  <td>{{ product.remainQuantity }} / {{ product.quantity }}</td>
                  <td>
                    <div class="badge text-white" :class="product.status === 'open' ? 'badge-success' : 'badge-error'">
                      {{ product.status }}
                    </div>
                  </td>
                  <td>{{ product.updatedAt }}</td>
                  <td>
                    <RouterLink :to="{ name: 'admin-products-update', params: { id: product.productId } }">
                      <button class="w-8 btn btn-square btn-ghost mr-3">
                        <EditIcon></EditIcon>
                      </button>
                    </RouterLink>
                    <button @click="deleteProduct(product.productId)" class="w-8 btn btn-square btn-ghost">
                      <TrashIcon></TrashIcon>
                    </button>
                  </td>
                </tr>
            </Table>
            <Pagination 
              :maxPage="adminProductStore.totalPage"
              :activePage="adminProductStore.page.activePage"
              :changePage="changePage"
            >
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>