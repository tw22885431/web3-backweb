export default defineNuxtRouteMiddleware((to, from) => {
  // 使用 useCookie 讀取 Cookies
  const user = useCookie('user');

  // 如果 Cookie 不存在，則重定向到登入頁
  if (!user.value) {
    return navigateTo('/login'); // 假設登入頁是 /login
  }
});

