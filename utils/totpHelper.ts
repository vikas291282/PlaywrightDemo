import { authenticator } from 'otplib';

export function generateTOTP(secret: string): string {
  return authenticator.generate(secret);
}
