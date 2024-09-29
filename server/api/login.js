import { defineEventHandler, readBody, setResponseStatus, setResponseHeader } from 'h3';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, encrypted_password, input_password } = body;

  try {
    // 比對使用者輸入的密碼和資料庫中的加密密碼
    const isMatch = bcrypt.compareSync(input_password, encrypted_password);

    if (isMatch) {
      // 設置 Cookie
      const cookieValue = JSON.stringify({ username });
      setResponseHeader(event, 'Set-Cookie', `user=${cookieValue}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);
      
      // 返回成功響應和 Cookie 信息
      return { success: true, message: '登入成功', cookie: { user: cookieValue } };
    } else {
      setResponseStatus(401);
      return { error: '登入失敗: 帳號或密碼錯誤' };
    }
  } catch (err) {
    console.error('Login API error:', err);
    setResponseStatus(500);
    return { error: '伺服器錯誤，請稍後再試' };
  }
});
