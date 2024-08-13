<script setup>
import { useAdminUserStore } from "../../../stores/admin/user";
import { RouterLink } from 'vue-router'

import AdminLayout from '@/layouts/AdminLayout.vue'
import Table from "../../../components/Table.vue";

const adminUserStore = useAdminUserStore()

const toggleStatus = (index) => {
  const updateUser = adminUserStore.list[index]
  updateUser.status = updateUser.status === 'inactive' ? 'active' : 'inactive'
  adminUserStore.updateUser(index, updateUser)
}
</script>

<template>
  <AdminLayout>
    <div class="flex-1 pt-8 px-6 bg-base-100">
      <div class="card w-full p-6 mt-2">
        <div class="text-3xl font-semibold inline-block">
          User
        </div>
        <div class="divider mt-2"></div>
        <div class="h-full w-full pb-6 bg-base-100">
          <div class="overflow-x-auto w-full">
            <Table :headers="['Name', 'Role', 'Status', 'Updated at']">
                <tr v-for="(user, index) in adminUserStore.list" :key="index">
                  <td>
                    <div class="font-bold">{{ user.name }}</div>
                  </td>
                  <td>{{ user.role }}</td>
                  <td>
                    <div class="badge" :class="user.status === 'active' ? 'badge-success text-white' : 'badge-ghost'">
                      {{ user.status }}
                    </div>
                  </td>
                  <td>{{ user.updatedAt }}</td>
                  <td>
                    <RouterLink :to="{ name: 'admin-users-update', params: { id: index } }">
                      <button class="btn">
                        Edit
                      </button>
                    </RouterLink>
                    <button @click="toggleStatus(index)" class="btn mx-2">
                      {{ user.status === 'active' ? 'Enable' : 'Disable' }}
                    </button>
                  </td>
                </tr>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>