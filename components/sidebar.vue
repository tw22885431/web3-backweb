<template>
  <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: isActive('/') }" 
            aria-current="page" 
            href="/"
          >
            <span data-feather="home"></span>
            儀表板
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: isActive('/order') }" 
            :aria-current="isActive('/order') ? 'page' : null" 
            href="/order"
          >
            <span data-feather="file"></span>
            訂單
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: isActive('/product') }" 
            :aria-current="isActive('/product') ? 'page' : null" 
            href="/product"
          >
            <span data-feather="shopping-cart"></span>
            商品
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: isActive('/costomer') }" 
            :aria-current="isActive('/costomer') ? 'page' : null" 
            href="/costomer"
          >
            <span data-feather="users"></span>
            客戶評價
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: isActive('/report') }" 
            :aria-current="isActive('/report') ? 'page' : null" 
            href="/report"
          >
            <span data-feather="bar-chart-2"></span>
            問題回覆
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

// Function to check if the route is active
const route = useRoute();
function isActive(path) {
  return route.path === path;
}
</script>

<style scoped src="~/assets/css/style.css"></style>
