<template>
  <main class="form-signin">
    <form @submit.prevent="backLogin">
      <h3 class="h3 mb-3 fw-normal">鳥巢比特商店後台</h3>
      <div class="form-floating">
        <input type="text" v-model="username" class="form-control" id="floatingInput" required>
        <label for="floatingInput">帳號</label>
      </div>
      <div class="form-floating">
        <input type="password" v-model="password" class="form-control" id="floatingPassword" required>
        <label for="floatingPassword">密碼</label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">登入</button>
      <div v-if="errorMsg" class="text-danger mt-2">{{ errorMsg }}</div>
    </form>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const username = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();
const supabase = useSupabaseClient(); // 使用 Supabase 客戶端

async function backLogin() {
  try {
    // 查詢用戶資料
    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username.value)
      .single();

    if (error || !admin) {
      errorMsg.value = '登入失敗: 沒有此帳號';
      return;
    }

    // 將查詢結果發送到 API
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: {
        username: admin.username,
        encrypted_password: admin.encrypted_password,
        input_password: password.value, // 將輸入的密碼發送到 API
      },
    });

    if (response.success) {
      // 設置 Cookie
      document.cookie = `user=${JSON.stringify({ username: admin.username })}; path=/; max-age=${60 * 60 * 24 * 7};`;
      router.push('/'); // 登入成功後導向首頁
    } else {
      errorMsg.value = response.error; // 顯示錯誤信息
    }
  } catch (error) {
    console.error('Login API error:', error);
    errorMsg.value = '伺服器錯誤，請稍後再試';
  }
}
</script>

<style scoped>
.form-signin {
  max-width: 400px;
  margin: auto;
}
</style>
