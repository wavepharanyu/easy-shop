<script setup>
    import AdminLayout from "../../../layouts/AdminLayout.vue";
    import { useAdminOrderStore } from "../../../stores/admin/order";
    import { RouterLink } from "vue-router";
    import { onMounted } from "vue";

    import Table from "../../../components/Table.vue";

    const adminOrderStore = useAdminOrderStore()

    onMounted(async () => {
      await adminOrderStore.loadOrder()
    })

</script>

<template>
    <AdminLayout>
    <div class="flex-1 pt-8 px-6 bg-base-100">
      <div class="card w-full p-6 mt-2">
        <div class="text-3xl font-semibold inline-block">
          Order
        </div>
        <div class="divider mt-2"></div>
        <div class="h-full w-full pb-6 bg-base-100">
          <div class="overflow-x-auto w-full">
            <Table :headers="['Customer Name', 'Price', 'Status', 'Updated at', '']">
                <tr v-for="(order) in adminOrderStore.list" :key="order.orderId">
                  <td>{{ order.name }}</td>
                  <td>{{ order.totalPrice }}</td>
                  <td>{{ order.status }}</td>
                  <td>{{ order.createdAt }}</td>
                  <td>
                    <RouterLink :to="{ name: 'admin-orders-detail', params: { id: order.orderId } }">
                      <button class="btn">
                        See Detail
                      </button>
                    </RouterLink>
                  </td>
                </tr>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>