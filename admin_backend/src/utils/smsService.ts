/**
 * @file utils/smsService.ts
 * @description Outbound Mobile SMS Service using Twilio Client SDK.
 *              Dispatches 6-digit OTP verification text messages to recipient phone numbers.
 */

import twilio from 'twilio';
import { env } from '../config/env';
import { logger } from '../config/logger';

export function getTwilioClient(): twilio.Twilio | null {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER) {
    return null;
  }
  return twilio(env.TWILIO_ACCOUNT_SID.trim(), env.TWILIO_AUTH_TOKEN.trim());
}

export async function sendOtpSms(toPhone: string, otpCode: string): Promise<boolean> {
  const client = getTwilioClient();

  if (!client || !env.TWILIO_PHONE_NUMBER) {
    logger.warn('⚠️ Twilio SMS is not fully configured in admin_backend/.env.');
    logger.info(`🔑 [MOBILE OTP SERVER LOG] Destination: ${toPhone} | Code: ${otpCode}`);
    return false;
  }

  // Ensure phone number has international + format (defaulting to +91 if 10 digits without prefix)
  let formattedPhone = toPhone.trim();
  if (/^\d{10}$/.test(formattedPhone)) {
    formattedPhone = `+91${formattedPhone}`;
  } else if (!formattedPhone.startsWith('+')) {
    formattedPhone = `+${formattedPhone}`;
  }

  try {
    const fromPhone = env.TWILIO_PHONE_NUMBER.trim();
    const message = await client.messages.create({
      body: `🔑 Your Jibble verification code is: ${otpCode}. Valid for 5 minutes. Do not share this code.`,
      from: fromPhone,
      to: formattedPhone,
    });

    logger.info(`✅ [SMS DISPATCHED] Twilio SID: ${message.sid} | Sent OTP ${otpCode} to: ${formattedPhone}`);
    return true;
  } catch (err: any) {
    logger.error(`❌ [SMS DISPATCH FAILED] Could not send SMS to ${formattedPhone}: ${err.message}`);
    logger.info(`🔑 [MOBILE OTP FALLBACK LOG] Destination: ${formattedPhone} | Code: ${otpCode}`);
    return false;
  }
}
