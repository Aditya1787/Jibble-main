/**
 * @file utils/emailService.ts
 * @description Outbound Email Service using Nodemailer SMTP transport.
 *              Sends real 6-digit OTP verification emails to recipient inbox.
 */

import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

export function getTransporter(): nodemailer.Transporter | null {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  const cleanPass = env.SMTP_PASS.replace(/\s+/g, '');
  const cleanUser = env.SMTP_USER.trim();

  return nodemailer.createTransport({
    host: env.SMTP_HOST.trim(),
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: cleanUser,
      pass: cleanPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export async function sendOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    logger.warn('⚠️ Outbound SMTP is not fully configured in admin_backend/.env.');
    logger.info(`🔑 [EMAIL OTP SERVER LOG] Destination: ${toEmail} | Code: ${otpCode}`);
    return false;
  }

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background-color: #f8fafc; border-radius: 16px; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; background-color: #336659; border-radius: 12px; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 48px; text-align: center;">J</div>
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 12px; margin-bottom: 4px;">Jibble Admin Verification</h1>
        <p style="font-size: 14px; color: #64748b; margin: 0;">Account Email Verification</p>
      </div>

      <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <p style="font-size: 15px; color: #334155; margin-bottom: 20px;">Use the following 6-digit verification code to complete your registration:</p>
        
        <div style="letter-spacing: 10px; font-size: 36px; font-weight: 800; color: #336659; background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 0 auto 20px auto; display: inline-block;">
          ${otpCode}
        </div>
        
        <p style="font-size: 13px; color: #94a3b8; margin-top: 16px;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
      </div>
    </div>
  `;

  try {
    const fromAddress = env.SMTP_FROM_EMAIL || env.SMTP_USER;
    const fromName = env.SMTP_FROM_NAME || 'Jibble Admin Verification';

    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toEmail,
      subject: `🔑 ${otpCode} is your Jibble Verification Code`,
      html: htmlContent,
      text: `Your Jibble Email Verification Code is: ${otpCode}. It will expire in 5 minutes.`,
    });
    logger.info(`✅ [EMAIL DISPATCHED] Verification code successfully delivered to: ${toEmail}`);
    return true;
  } catch (err: any) {
    logger.error(`❌ [EMAIL DISPATCH FAILED] Could not send email to ${toEmail}: ${err.message}`);
    logger.info(`🔑 [EMAIL OTP FALLBACK LOG] Destination: ${toEmail} | Code: ${otpCode}`);
    return false;
  }
}
