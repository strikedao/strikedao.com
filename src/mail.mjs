//@format
import dotenv from "dotenv";
dotenv.config();
import process from "process";
import nodemailer from "nodemailer";

const {
  MAILGUN_SMTP_HOSTNAME,
  MAILGUN_SMTP_PORT,
  MAILGUN_USERNAME,
  MAILGUN_PASSWORD,
  PUBLIC_NAME
} = process.env;

function getTransporter() {
  return nodemailer.createTransport({
    host: MAILGUN_SMTP_HOSTNAME,
    port: MAILGUN_SMTP_PORT,
    auth: {
      user: MAILGUN_USERNAME,
      pass: MAILGUN_PASSWORD
    }
  });
}

export async function send(to, subject, text, html) {
  const transport = getTransporter();
  const data = {
    from: PUBLIC_NAME,
    to,
    subject,
    text,
    html
  };
  return await transport.sendMail(data);
}
