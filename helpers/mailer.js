import nodemailer from 'nodemailer';
import config from '../config.js';

export default {
  sendMail: async function (recEmail, subject, msg) {
    let transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: parseInt(config.mail.port), 
      secure: config.mail.port === '465', 
      auth: {
        user: config.mail.username,
        pass: config.mail.password
      },
      tls: {
        rejectUnauthorized: false, 
        minVersion: 'TLSv1.2' 
      }
    });

    let sender = `"${config.mail.sendername}" <${config.mail.senderemail}>`;
    let mailOptions = {
      from: sender,
      to: recEmail,
      subject: subject,
      html: msg
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
};