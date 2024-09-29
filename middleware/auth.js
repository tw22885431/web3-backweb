import { useRequestEvent } from 'nuxt/app';
import { useRouter } from 'vue-router';

export default function () {
  const event = useRequestEvent(); // 獲取請求事件
  const router = useRouter(); // 使用 Vue Router 的 useRouter

  // 確保只有在服務器端檢查 cookie
  if (process.server) {
    const userCookie = event.req.headers?.cookie
      ?.split('; ')
      .find(row => row.startsWith('user='));

      console.log(userCookie);

    if (!userCookie) {
      // 如果找不到 cookie，則重定向到登錄頁面
      return router.push('/login'); // 根據您的登錄路由調整路徑
    }

    // 可選地，解析 cookie 並將用戶信息附加到上下文
    const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
    if (user) {
      // 如果需要，可以將用戶信息附加到上下文
      // e.g. context.user = user;
    }
  } 
}
