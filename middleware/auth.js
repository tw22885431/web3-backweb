import { useRequestEvent } from 'nuxt/app';

export default function () {
  const event = useRequestEvent(); // 获取请求事件

  // 确保只有在服务器端检查 cookie
  if (process.server) {
    const userCookie = event.req.headers?.cookie
      ?.split('; ')
      .find(row => row.startsWith('user='));

    // 检查 userCookie 是否存在
    if (!userCookie) {
      console.log('No user cookie found. Redirecting to login.');
      // 如果找不到 cookie，则重定向到登录页面
      event.res.writeHead(302, { Location: '/login' });
      event.res.end(); // 结束响应
      return; // 确保后面的代码不再执行
    }

    // 尝试解析 cookie
    try {
      const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));

    } catch (error) {
      console.error('Error parsing user cookie:', error);
      // 处理解析错误
    }
  }
}
