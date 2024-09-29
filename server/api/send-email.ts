// server/api/send-email-template.ts
import { useRuntimeConfig } from '#imports';
import SibApiV3Sdk from '@sendinblue/client';
import { useSupabaseClient } from '@nuxtjs/supabase';

export default defineEventHandler(async (event) => {
  const { questionId } = await readBody(event); // 期望接收问题 ID

  const supabase = useSupabaseClient();
  // 从数据库中获取客户的电子邮件和其他信息
  const { data: questionData, error: questionError } = await supabase
    .from('customer_questions')
    .select('customer_email, customer_name')
    .eq('id', questionId)
    .single(); // 获取单个记录

  if (questionError) {
    console.error('Error fetching question data:', questionError);
    return { success: false, error: questionError.message };
  }

  // Fetch the Brevo API key from config
  const config = useRuntimeConfig();

  // Initialize Brevo API client
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, config.public.brevoApiKey);

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: questionData.customer_email }], // 使用从数据库中获取的客户电子邮件
    templateId: 1, // 用你的 Brevo 邮件模板 ID 替换
    params: {
      customerName: questionData.customer_name, // 动态参数
      // 你可以在这里添加更多参数，比如问题内容等
    },
  });

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
});

});
