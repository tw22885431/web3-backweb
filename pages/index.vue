<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">賣家儀表板</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="addOrder">新增訂單</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="exportReport">導出報告</button>
        </div>
      </div>
    </div>

    <h2>待辦事項清單</h2>
    <div class="row mb-4">
      <div class="col-md-12">
        <ul class="list-group">
          <li class="list-group-item">待付款訂單：{{ pendingPaymentOrders }}</li>
          <li class="list-group-item">待處理訂單：{{ pendingOrders }}</li>
          <li class="list-group-item">已處理訂單：{{ completedOrders }}</li>
          <li class="list-group-item">待發貨商品：{{ pendingShippingItems }}</li>
          <li class="list-group-item">已售商品：{{ soldItems }}</li>
        </ul>
      </div>
    </div>

    <h2>數據中心</h2>
    <canvas id="salesChart" width="400" height="200"></canvas>

    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">時間</th>
            <th scope="col">銷售量</th>
            <th scope="col">不重複訪客</th>
            <th scope="col">訪問率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in salesData" :key="hour.time">
            <td>{{ hour.time }}</td>
            <td>{{ hour.sales }}</td>
            <td>{{ hour.uniqueVisitors }}</td>
            <td>{{ hour.visitorRate }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'back-layout'
})
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const pendingPaymentOrders = ref(0);
const pendingOrders = ref(0);
const completedOrders = ref(0);
const pendingShippingItems = ref(0);
const soldItems = ref(0);

const salesData = ref([
  { time: '00:00', sales: 5, uniqueVisitors: 2, visitorRate: 40 },
  { time: '01:00', sales: 3, uniqueVisitors: 1, visitorRate: 33 },
  { time: '02:00', sales: 8, uniqueVisitors: 3, visitorRate: 50 },
  // 可根據需要添加更多時間段
]);

onMounted(() => {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesData.value.map(data => data.time),
      datasets: [{
        label: '銷售量',
        data: salesData.value.map(data => data.sales),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});

function addOrder() {
  // 新增訂單邏輯
}

function exportReport() {
  // 導出報告邏輯
}
</script>

<style scoped>
/* 可以根據需要添加自定義樣式 */
</style>
