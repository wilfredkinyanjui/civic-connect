
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendNotification(to: string, subject: string, message: string) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text: message,
    html: message.replace(/\n/g, '<br>')
  });
}
