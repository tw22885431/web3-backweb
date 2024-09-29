<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2 text-primary">賣家儀表板</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-success" @click="exportReport">導出報告</button>
        </div>
      </div>
    </div>

    <h2 class="text-secondary">待辦事項清單</h2>
    <div class="row mb-4">
      <div class="col-md-12">
        <div class="card shadow-sm border-0 rounded">
          <div class="card-body">
            <ul class="list-group">
              <li class="list-group-item list-group-item-warning">待付款訂單：<strong>{{ pendingPaymentOrders }}</strong></li>
              <li class="list-group-item list-group-item-info">待處理訂單：<strong>{{ pendingOrders }}</strong></li>
              <li class="list-group-item list-group-item-success">已處理訂單：<strong>{{ completedOrders }}</strong></li>
              <li class="list-group-item list-group-item-danger">待發貨商品：<strong>{{ pendingShippingItems }}</strong></li>
              <li class="list-group-item list-group-item-secondary">已售商品：<strong>{{ soldItems }}</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-secondary">銷售數據圖表</h2>
    <canvas id="salesChart" width="400" height="200"></canvas>

    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">月份</th>
            <th scope="col">銷售量</th>
            <th scope="col">不重複訪客</th>
            <th scope="col">訪問率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="month in salesData" :key="month.label">
            <td>{{ month.label }}</td>
            <td>{{ month.sales }}</td>
            <td>{{ month.uniqueVisitors }}</td>
            <td>{{ month.visitorRate }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'back-layout',
  middleware: 'auth',
})

import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const supabase = useSupabaseClient();

const pendingPaymentOrders = ref(0);
const pendingOrders = ref(0);
const completedOrders = ref(0);
const pendingShippingItems = ref(0);
const soldItems = ref(0);
const ordersData = ref([]);
const salesData = ref([]);

onMounted(async () => {
  await loadOrderStats();
  await loadSalesData();
  createSalesChart();
});

async function loadOrderStats() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*');

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }

  ordersData.value = orders;

  pendingPaymentOrders.value = orders.filter(order => order.status === 'pending').length;
  pendingOrders.value = orders.filter(order => order.status === 'processing').length;
  completedOrders.value = orders.filter(order => order.status === 'completed').length;

  pendingShippingItems.value = orders.reduce((total, order) => total + order.total_amount, 0);
  soldItems.value = orders.length;
}

async function loadSalesData() {
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gt('created_at', '2023-01-01')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching sales data:', error);
    return;
  }

  const monthlySales = {};

  data.forEach(order => {
    const month = new Date(order.created_at).toLocaleString('default', { month: 'long' });
    if (!monthlySales[month]) {
      monthlySales[month] = { sales: 0, uniqueVisitors: 1 };
    }
    monthlySales[month].sales += order.total_amount;
  });

  salesData.value = Object.entries(monthlySales).map(([label, { sales, uniqueVisitors }]) => ({
    label,
    sales,
    uniqueVisitors,
    visitorRate: (uniqueVisitors / data.length * 100).toFixed(2)
  }));
}

function createSalesChart() {
  const ctx = document.getElementById('salesChart').getContext('2d');
  const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: salesData.value.map(data => data.label),
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
}

function exportReport() {
  if (ordersData.value.length === 0) {
    alert("沒有可導出的數據！");
    return;
  }

  const headers = ["訂單ID", "狀態", "總金額", "日期"];
  const rows = ordersData.value.map(order => [order.id, order.status, order.total_amount, new Date(order.created_at).toLocaleDateString()]);

  const documentDefinition = {
    content: [
      { text: "訂單報告", fontSize: 16, bold: true, margin: [0, 0, 0, 20] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*'],
          body: [
            headers,
            ...rows
          ]
        }
      }
    ],
    styles: {
      tableExample: {
        margin: [0, 5, 0, 15]
      }
    }
  };

  createPdf(documentDefinition, 'orders_report.pdf'); // 使用 nuxt-pdfmaker 生成 PDF
}
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}

h1 {
  color: #007bff;
}

h2 {
  margin-top: 20px;
  color: #495057;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.list-group-item {
  font-size: 1.1rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s, transform 0.2s;
}

.list-group-item:hover {
  background-color: #e9ecef;
  transform: scale(1.02);
}

.list-group-item-warning {
  background-color: #fff3cd;
}

.list-group-item-info {
  background-color: #d1ecf1;
}

.list-group-item-success {
  background-color: #d4edda;
}

.list-group-item-danger {
  background-color: #f8d7da;
}

.list-group-item-secondary {
  background-color: #e2e3e5;
}
</style>
