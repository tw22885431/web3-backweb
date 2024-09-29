<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

async function signOut() {
  try {
    // 調用登出 API
    const response = await useFetch('/api/logout', {
      method: 'POST',
    });

    if (response.data.value.success) {
      // 登出成功後導向登入頁面
      router.push('/login'); // 根據您的路由設定，這裡假設登入頁面的路由是 '/login'
    }
  } catch (error) {
    console.error('登出時發生錯誤:', error);
  }
}
</script>

<template>
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Company name</a>
        <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="navbar-nav">
            <div class="nav-item text-nowrap">
                <a class="nav-link px-3" @click.prevent="signOut">Sign out</a>
            </div>
        </div>
    </header>
</template>

<style scoped>
</style>
