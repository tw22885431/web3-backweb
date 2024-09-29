<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 class="h2">客戶問題回覆</h1>
    </div>

    <div v-if="loading">加載中...</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <div v-if="!loading && !error">
      <h2>客戶問題列表</h2>
      <table class="table">
        <thead>
          <tr>
            <th>商品名稱</th>
            <th>客戶名稱</th>
            <th>問題</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in questions" :key="question.id">
            <td>{{ question.product_name }}</td>
            <td>{{ question.customerName }}</td>
            <td>{{ question.content }}</td>
            <td>{{ new Date(question.date).toLocaleString() }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="selectQuestion(index)">回覆</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="selectedQuestion !== null" class="chat-container chat-float">
      <div class="chat-header">
        <span>聊聊</span>
        <button class="close-chat" @click="cancelReply">×</button>
      </div>
      <div class="chat-box">
        <div v-for="(message, msgIndex) in chatMessages" :key="msgIndex" class="chat-message" :class="{'customer': message.isCustomer, 'support': !message.isCustomer}">
          <span>{{ message.content }}</span>
        </div>
      </div>

      <form @submit.prevent="submitReply" class="reply-form">
        <textarea class="form-control" v-model="replyContent" rows="3" placeholder="輸入回覆內容" required></textarea>
        <div class="d-flex justify-content-end mt-2">
          <button type="submit" class="btn btn-primary">送出回覆</button>
          <button type="button" class="btn btn-outline-secondary ms-2" @click="cancelReply">取消</button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
// 添加頁面元數據
definePageMeta({
  layout: 'back-layout',
  middleware: 'auth',
});
import { ref, onMounted } from 'vue';
const supabase = useSupabaseClient();
const questions = ref([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedQuestion = ref<number | null>(null);
const replyContent = ref('');
const chatMessages = ref<{ content: string, isCustomer: boolean }[]>([]);

async function fetchQuestions() {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('questions')
      .select(`
        id,
        product_name,
        profile (name),
        content,
        date
      `);

    if (fetchError) {
      throw new Error(fetchError.message);
    }

    questions.value = data.map(q => ({
      ...q,
      customerName: q.profile.name // 將 profile.name 映射到 customerName
    }));
  } catch (err) {
    error.value = `獲取問題資料失敗: ${err.message}`;
  } finally {
    loading.value = false;
  }
}

function selectQuestion(index: number) {
  selectedQuestion.value = index;
  replyContent.value = '';
  chatMessages.value = [
    { content: questions.value[index].content, isCustomer: true }
  ];
}

function submitReply() {
  if (selectedQuestion.value !== null) {
    chatMessages.value.push({ content: replyContent.value, isCustomer: false });
    alert(`回覆客戶 ${questions.value[selectedQuestion.value].customerName}: ${replyContent.value}`);
    replyContent.value = '';
  }
}

function cancelReply() {
  selectedQuestion.value = null;
  replyContent.value = '';
  chatMessages.value = [];
}

// 在組件掛載時獲取問題資料
onMounted(fetchQuestions);
</script>

<style scoped>
.chat-container {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chat-box {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.chat-message {
  margin: 0.5rem 0;
}
.customer {
  text-align: right;
  color: blue;
}
.support {
  text-align: left;
  color: green;
}
</style>

