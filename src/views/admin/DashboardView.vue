<script setup>
import { onMounted } from 'vue'

import AdminLayout from '@/layouts/AdminLayout.vue'

import { useAdminDashboardStore } from "../../stores/admin/dashboard";

const adminDashboardStore = useAdminDashboardStore()

onMounted(async () => {
  await adminDashboardStore.loadDashboard()
})

const barOption = {
  options: {
    chart: {
      id: 'vuechart-example'
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
    }
  },
  series: [{
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  }]
}

const donutOption = {
      options: {},
      series: [44, 55, 41, 17, 15]
}
</script>

<template>
  <AdminLayout>
    <h1 class="text-4xl my-4">Dashboard</h1>
    <div class="flex mb-4">
      <div class="stats w-full shadow">
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 320 512"
            >
              <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
              <path
                d="M144 0c-17.7 0-32 14.3-32 32V64H37.6C16.8 64 0 80.8 0 101.6V224v41.7V288 406.3c0 23 18.7 41.7 41.7 41.7H112v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c61.9 0 112-50.1 112-112c0-40.1-21.1-75.3-52.7-95.1C280.3 222.6 288 200.2 288 176c0-61.9-50.1-112-112-112V32c0-17.7-14.3-32-32-32zM112 128v96H64V128h48zm64 96V128c26.5 0 48 21.5 48 48s-21.5 48-48 48zm-64 64v96H64V288h48zm64 96V288h32c26.5 0 48 21.5 48 48s-21.5 48-48 48H176z"
              />
            </svg>
          </div>
          <div class="stat-title">Orders</div>
          <div class="stat-value">{{ adminDashboardStore.stats.order }}</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
              <path
                d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"
              />
            </svg>
          </div>
          <div class="stat-title">Products</div>
          <div class="stat-value">{{ adminDashboardStore.stats.product }}</div>
        </div>
        <div class="stat">
          <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 640 512"
            >
              <path
                d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
              />
            </svg>
          </div>
          <div class="stat-title">Users</div>
          <div class="stat-value">{{ adminDashboardStore.stats.users }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row gap-2">
      <div class="flex-1">
        <div class="card w-full p-6 bg-base-100 shadow-xl">
          <h1>ยอดขาย</h1>
          <apexchart
            type="bar"
            :options="barOption.options"
            :series="barOption.series"
          ></apexchart>
        </div>
      </div>
      <div class="flex-1">
        <div class="card w-full p-6 bg-base-100 shadow-xl">
          <h1>ประเภทการขาย</h1>
          <apexchart
            type="donut"
            :options="donutOption.options"
            :series="donutOption.series"
          ></apexchart>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
