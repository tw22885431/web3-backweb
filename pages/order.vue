<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">訂單管理</h1>
      <div class="btn-toolbar mb-2 mb-md-0">
        <div class="btn-group me-2">
          <button type="button" class="btn btn-sm btn-outline-secondary">分享</button>
          <button type="button" class="btn btn-sm btn-outline-secondary">導出</button>
        </div>
        <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
          <span data-feather="calendar"></span>
          本週
        </button>
      </div>
    </div>

    <canvas class="my-4 w-100" id="orderChart" width="900" height="380"></canvas>

    <h2>訂單列表</h2>
    <div class="table-responsive">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">訂單編號</th>
            <th scope="col">客戶名稱</th>
            <th scope="col">訂單狀態</th>
            <th scope="col">金額</th>
            <th scope="col">日期</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customerName }}</td>
            <td>
              <select v-model="order.status" class="form-select">
                <option value="已發貨">已發貨</option>
                <option value="待發貨">待發貨</option>
                <option value="已完成">已完成</option>
                <option value="已取消">已取消</option>
              </select>
            </td>
            <td>{{ order.amount }}</td>
            <td>{{ order.date }}</td>
            <td>
              <button @click="updateOrder(order)" class="btn btn-sm btn-primary">更新</button>
            </td>
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
});
import { ref, onMounted } from 'vue';
import { Chart } from 'chart.js';

// 使用 useSupabaseClient() 獲取 Supabase 客戶端
const supabase = useSupabaseClient();

const orders = ref([]);

const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*');

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    orders.value = data.map(order => ({
      id: order.id,
      customerName: order.customer_name, // 假設有 customer_name 字段
      status: order.status,
      amount: order.total_amount,
      date: order.created_at.split('T')[0] // 格式化日期
    }));
  }
};

const updateOrder = async (order) => {
  const { error } = await supabase
    .from('orders')
    .update({ status: order.status })
    .eq('id', order.id);

  if (error) {
    console.error(`Error updating order ${order.id}:`, error);
  } else {
    console.log(`訂單 ${order.id} 的狀態已更新為 ${order.status}`);
  }
};

onMounted(() => {
  fetchOrders();

  const ctx = document.getElementById('orderChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: orders.value.map(order => order.date),
      datasets: [{
        label: '訂單金額',
        data: orders.value.map(order => order.amount),
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
</script>

<style scoped>
/* 可以根據需要添加自定義樣式 */
</style>
