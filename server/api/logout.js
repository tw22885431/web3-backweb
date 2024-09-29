import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  // 設置 Cookie 為過期，這樣就可以刪除它
  setResponseHeader(event, 'Set-Cookie', 'user=; Path=/; Max-Age=0; HttpOnly;');
  
  return { success: true, message: '登出成功' };
});
