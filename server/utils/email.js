const nodemailer = require('nodemailer');

// Falls back to console.log when SMTP isn't configured so local dev works
// out of the box without forcing every contributor to create a Gmail app password.
let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return transporter;
}

async function sendEmail({ to, subject, html, text, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[EMAIL MOCK] to=${to} subject=${subject}`);
    return { mocked: true };
  }
  try {
    const info = await t.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to, subject, html, text,
      ...(replyTo && { replyTo }),
    });
    return { messageId: info.messageId };
  } catch (err) {
    // Never crash a request because email failed — log it and move on.
    console.error('Email send failed:', err.message);
    return { error: err.message };
  }
}

const templates = {
  welcome: (name) => ({
    subject: 'Welcome to GameLoop!',
    html: `<h2>Hey ${name},</h2><p>Thanks for joining GameLoop. Browse our catalog and pick your first game!</p>`,
  }),
  verification: (name, code) => ({
    subject: `Your GameLoop verification code: ${code}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;padding:24px">
        <h2>Verify your email, ${name}</h2>
        <p>Enter this code in the app to activate your account:</p>
        <div style="background:#0a0e1a;color:#3b9fff;font-size:36px;font-weight:bold;letter-spacing:8px;padding:20px;text-align:center;border-radius:12px;margin:24px 0">${code}</div>
        <p style="color:#666;font-size:13px">This code expires in 15 minutes. If you didn't sign up, ignore this email.</p>
      </div>`,
  }),
  deliveryUpdate: (name, title, status) => ({
    subject: `Delivery update: ${title}`,
    html: `<h2>Hi ${name},</h2><p>Your rental of <strong>${title}</strong> is now <strong>${status}</strong>.</p>`,
  }),
  subscriptionActive: (name, plan, endDate) => ({
    subject: `Your ${plan} plan is active`,
    html: `<h2>Hi ${name},</h2><p>Your <strong>${plan}</strong> subscription is now active until <strong>${endDate.toDateString()}</strong>.</p>`,
  }),
  paymentApproved: (name, amount) => ({
    subject: 'Payment approved',
    html: `<h2>Hi ${name},</h2><p>Your payment of Rs. ${amount} has been approved. Enjoy gaming!</p>`,
  }),
  paymentRejected: (name) => ({
    subject: 'Payment rejected',
    html: `<h2>Hi ${name},</h2><p>Unfortunately we could not verify your payment. Please contact support or re-upload a clearer screenshot.</p>`,
  }),
  rentalConfirmed: (name, title, returnDate) => ({
    subject: `Rental confirmed: ${title}`,
    html: `<h2>Hi ${name},</h2><p>You've rented <strong>${title}</strong>. Return by <strong>${returnDate.toDateString()}</strong>.</p>`,
  }),
  lateReturn: (name, title) => ({
    subject: `Return overdue: ${title}`,
    html: `<h2>Hi ${name},</h2><p>Your rental of <strong>${title}</strong> is past its return date. Please return it soon.</p>`,
  }),
  contactMessage: (name, email, message) => ({
    subject: `New contact form message from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px">
        <h2>New message via GameLoop contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <div style="background:#f5f7fb;border-left:4px solid #3b9fff;padding:12px 16px;white-space:pre-wrap">${message}</div>
      </div>`,
  }),
};

module.exports = { sendEmail, templates };
