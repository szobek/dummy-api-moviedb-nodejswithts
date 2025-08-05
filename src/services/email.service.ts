import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export const sendHtmlEmail = async (to: string, subject: string, templateName: string) => {
  const templatePath = path.join(__dirname, '../templates/email', templateName);
  const html = fs.readFileSync(templatePath, 'utf8');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_USER,
      pass: process.env.GOOGLE_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  return info;
};
