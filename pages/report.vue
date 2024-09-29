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
            <td>{{ report.customer_name }}</td>
            <td>{{ report.question }}</td>
            <td>{{ new Date(report.date).toLocaleString() }}</td>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const supabase = useSupabaseClient();
const reports = ref([]);
const selectedReportIndex = ref<number | null>(null);
const replyContent = ref('');
const router = useRouter();

onMounted(async () => {
  const { data, error } = await supabase
    .from('customer_questions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching questions:', error);
  } else {
    reports.value = data;
  }
});

function openModal(index: number) {
  selectedReportIndex.value = index;
  replyContent.value = ''; // 清空回覆內容
  const modal = new bootstrap.Modal(document.getElementById('replyModal'));
  modal.show();
}

async function submitReply() {
  // 確保已選擇報告索引
  if (selectedReportIndex.value !== null) {
    const questionId = reports.value[selectedReportIndex.value].id;

    // 保存回复到數據庫
    const { error } = await supabase
      .from('replies')
      .insert([{ question_id: questionId, reply_content: replyContent.value }]);

    if (error) {
      alert('回复失败，请稍后再试'); // 如果發生錯誤，顯示提示
    } else {
      // 发送电子邮件
      const { success, error: emailError } = await $fetch('/api/send-email-template', {
        method: 'POST',
        body: { questionId }, // 傳送問題 ID 到 API
      });

      if (success) {
        alert(`回复客户 ${reports.value[selectedReportIndex.value].customer_name}: ${replyContent.value}`); // 提示成功
      } else {
        console.error('發送電子郵件時出錯:', emailError); // 如果發送電子郵件錯誤，顯示錯誤信息
      }
    }

    // 清空回覆內容和選擇
    replyContent.value = '';
    selectedReportIndex.value = null; // 回覆後清除選擇
    const modal = bootstrap.Modal.getInstance(document.getElementById('replyModal'));
    modal.hide(); // 隱藏模態窗口
  }
}



async function sendReplyEmail(customerEmail: string, replyContent: string) {
  try {
    const response = await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        to: customerEmail,
        subject: '客戶問題回覆',
        text: replyContent,
      },
    });
    console.log('Email sent:', response);
  } catch (error) {
    console.error('Error sending email:', error);
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
  return selectedReportIndex.value !== null ? reports.value[selectedReportIndex.value].customer_name : '';
});

// 添加頁面元數據
definePageMeta({
  layout: 'back-layout',
  middleware: 'auth',
});
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
</style>
