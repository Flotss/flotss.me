import { Resend } from 'resend';

export type EmailInputs = {
  email: string;
  subject: string;
  message: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ email, subject, message }: EmailInputs): Promise<string> => {
  const subjectEmail = `[${email}] ${subject}`;
  const name = email.split('@')[0];

  return await resend.emails
    .send({
      from: `${name} <onboarding@resend.dev>`,
      to: 'manginf54@gmail.com',
      subject: subjectEmail,
      text: message,
    })
    .then((response) => {
      if (response.error) {
        return response.error.message;
      }
      return response?.data ? undefined : 'An error occurred while sending the email';
    })
    .catch((e) => {
      return e;
    });
};
