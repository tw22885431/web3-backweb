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
            <th>商品名稱</th>
            <th>客戶名稱</th>
            <th>問題</th>
            <th>日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(question, index) in questions" :key="index">
            <td>{{ question.productName }}</td>
            <td>{{ question.customerName }}</td>
            <td>{{ question.content }}</td>
            <td>{{ question.date }}</td>
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
definePageMeta({
  layout: 'back-layout'
})
import { ref } from 'vue';

const questions = ref([
  { productName: '產品A', customerName: '張三', content: '這個產品有保固嗎？', date: '2024-09-18' },
  { productName: '產品B', customerName: '李四', content: '可以提供更多產品資訊嗎？', date: '2024-09-19' },
]); // 模擬客戶問題列表

const selectedQuestion = ref<number | null>(null);
const replyContent = ref('');
const chatMessages = ref<{ content: string, isCustomer: boolean }[]>([]); // 用於保存對話訊息

function selectQuestion(index: number) {
  selectedQuestion.value = index;
  replyContent.value = ''; // 清空回覆內容
  chatMessages.value = [
    { content: questions.value[index].content, isCustomer: true } // 顯示客戶問題
  ];
}

function submitReply() {
  if (selectedQuestion.value !== null) {
    // 添加支援回覆到聊天訊息
    chatMessages.value.push({ content: replyContent.value, isCustomer: false });

    // 在這裡處理回覆邏輯，例如發送到後端
    alert(`回覆客戶 ${questions.value[selectedQuestion.value].customerName}: ${replyContent.value}`);
    
    // 清空回覆內容
    replyContent.value = '';
  }
}

function cancelReply() {
  selectedQuestion.value = null;
  replyContent.value = '';
  chatMessages.value = []; // 清空聊天訊息
}
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}
.chat-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* 確保浮動窗口在最上層 */
  overflow: hidden;
  transition: transform 0.3s ease;
}
.chat-header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.chat-box {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
}
.chat-message {
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
}
.chat-message.customer {
  background-color: #e1f5fe; /* 客戶訊息顏色 */
  text-align: left;
}
.chat-message.support {
  background-color: #c8e6c9; /* 支援訊息顏色 */
  text-align: right;
}
.close-chat {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}
.reply-form {
  padding: 10px;
  border-top: 1px solid #ddd;
}
.form-control {
  border-radius: 5px;
  border: 1px solid #ddd;
}
.btn-primary {
  background-color: #007bff;
  border: none;
}
.btn-outline-secondary {
  border-color: #007bff;
}
</style>
