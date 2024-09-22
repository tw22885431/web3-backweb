<template>
  <main class="form-signin">
    <form @submit.prevent="backLogin">
      <h1 class="h3 mb-3 fw-normal">鳥巢比特商店後台</h1>
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
import { SHA512 } from 'crypto-js'; // 引入 SHA-512

useHead({
  bodyAttrs: {
    class: "text-center"
  },
});

const supabase = useSupabaseClient();
const router = useRouter();

const username = ref('');
const password = ref('');
const errorMsg = ref('');

async function backLogin() {
  const hashedPassword = SHA512(password.value).toString(); // 將密碼進行 SHA-512 雜湊

  const { data: admin, error } = await supabase
    .from('admin')
    .select('*')
    .eq('username', username.value)
    .eq('password', hashedPassword); // 使用雜湊後的密碼

  if (error) {
    errorMsg.value = '登入失敗: ' + error.message;
  } else if (admin.length > 0) {
    // 登入成功的處理
    router.push('/dashboard'); // 導向儀表板或其他頁面
  } else {
    errorMsg.value = '登入失敗: 帳號或密碼錯誤';
  }
}
</script>

<style scoped>
.form-signin {
  max-width: 400px;
  margin: auto;
}
</style>
