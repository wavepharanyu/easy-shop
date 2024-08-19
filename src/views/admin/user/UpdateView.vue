<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminUserStore } from "../../../stores/admin/user";
import { useEventStore } from '@/stores/event'
import AdminLayout from '@/layouts/AdminLayout.vue'

const adminUserStore = useAdminUserStore()
const eventStore = useEventStore()

const route = useRoute()

const userId = ref(-1)
let userData = ref({})

const formData = [
    {
        name: 'Name',
        field: 'name',
        type: 'text'
    },
    {
        name: 'Role',
        field: 'role',
        type: 'select',
        dropdownList: ['admin', 'moderator', 'member']
    },
    {
        name: 'Status',
        field: 'status',
        type: 'select',
        dropdownList: ['active', 'inactive']
    },
]

onMounted(async() => {
  if (route.params.id) {
    userId.value = route.params.id
    userData.value = await adminUserStore.getUser(userId.value)
  }
})

const updateUser = async() => {
    await adminUserStore.updateUser(userId.value, userData.value)
    eventStore.popupMessage('success', 'Update Product successful!')
}

</script>

<template>
  <AdminLayout>
    <div class="flex pt-8 px-6">
      <div class="card w-full p-6 bg-base-100 shadow-xl mt-2">
        <div class="text-2xl font-semibold">Update user id: {{ userId }}</div>
        <div class="divider"></div>

        <div v-for="form in formData" :key="form.name" class="form-control w-full">
          <label class="label">
            <span class="label-text text-base-content">{{ form.name }}</span>
          </label>
          <input
            v-if="form.type === 'text'"
            type="text"
            placeholder=""
            class="input input-bordered w-full"
            v-model="userData[form.field]"
          />
          <select v-if="form.type === 'select'" class="select select-bordered w-full" v-model="userData[form.field]">
            <option v-for="item in form.dropdownList" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>

        <div class="mt-4 flex justify-end">
          <RouterLink to="/admin/users" class="btn btn-ghost">
            Back
          </RouterLink>
          <button @click="updateUser()" class="btn btn-primary ml-4">
            Update
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>