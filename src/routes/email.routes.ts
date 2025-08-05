import { Router, Request, Response } from "express";
import { sendHtmlEmail } from "../services/email.service";

const router = Router();

router.post('/send-email', async (req, res) => {
  const { to, subject } = req.body;
  try {
    const html = `emailTemplate.html`;
    sendHtmlEmail(to, subject, html);
    res.json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;