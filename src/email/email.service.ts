import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // e.g., smtp.gmail.com
      port:  process.env.MAIL_PORT, // or 465 for secure SMTP
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME, // Your email address
        pass: process.env.MAIL_PASSWORD, // Your email password
      },
    });
  }
  

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.APP_NAME, // sender address
      to,
      subject,
      text,
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}