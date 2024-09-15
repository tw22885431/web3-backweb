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
  const { data: admin, error } = await supabase
    .from('admin')
    .select('*')
    .eq('username', username.value) // 直接使用 username.value
    .eq('password', password.value); // 直接使用 password.value

  if (error) {
    errorMsg.value = '登入失敗: ' + error.message;
  } else {
    router.push('/');
  }
}
</script>

<style scoped>
@import url("~/assets/css/signin.css");
</style>
