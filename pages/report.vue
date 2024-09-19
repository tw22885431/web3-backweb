<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">客戶問題回覆</h1>
    </div>

    <div>
      <h2>客戶問題列表</h2>
      <table class="table">
        <thead>
          <tr>
            <th>客戶名稱</th>
            <th>問題</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(report, index) in reports" :key="index">
            <td>{{ report.customerName }}</td>
            <td>{{ report.question }}</td>
            <td>{{ report.date }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="openModal(index)">回覆</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="replyModal" tabindex="-1" aria-labelledby="replyModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="replyModalLabel">回覆客戶</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>客戶名稱：</strong> {{ selectedCustomerName }}</p>
            <p><strong>客戶問題：</strong> {{ selectedReportQuestion }}</p>
            <textarea 
              class="form-control" 
              v-model="replyContent" 
              rows="3" 
              placeholder="輸入回覆內容" 
              required
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelReply">取消</button>
            <button type="button" class="btn btn-primary" @click="submitReply">送出回覆</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const reports = ref([
  { customerName: '張三', question: '這個產品的運送時間是多久？', date: '2024-09-18' },
  { customerName: '李四', question: '是否可以退貨？', date: '2024-09-19' },
]); // 模擬客戶問題列表

const selectedReportIndex = ref<number | null>(null);
const replyContent = ref('');

function openModal(index: number) {
  selectedReportIndex.value = index;
  replyContent.value = ''; // 清空回覆內容
  const modal = new bootstrap.Modal(document.getElementById('replyModal'));
  modal.show();
}

function submitReply() {
  if (selectedReportIndex.value !== null) {
    alert(`回覆客戶 ${reports.value[selectedReportIndex.value].customerName}: ${replyContent.value}`);
    replyContent.value = '';
    selectedReportIndex.value = null; // 回覆後清除選擇
    const modal = bootstrap.Modal.getInstance(document.getElementById('replyModal'));
    modal.hide();
  }
}

function cancelReply() {
  replyContent.value = ''; // 清空回覆內容
  selectedReportIndex.value = null;
}

// 計算選擇的客戶問題
const selectedReportQuestion = computed(() => {
  return selectedReportIndex.value !== null ? reports.value[selectedReportIndex.value].question : '';
});

// 計算選擇的客戶名稱
const selectedCustomerName = computed(() => {
  return selectedReportIndex.value !== null ? reports.value[selectedReportIndex.value].customerName : '';
});

// 添加頁面元數據
definePageMeta({
  layout: 'back-layout'
});
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
</style>
