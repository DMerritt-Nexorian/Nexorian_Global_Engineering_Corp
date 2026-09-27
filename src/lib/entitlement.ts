import crypto from 'crypto';
import { EntitlementRecord } from './types';

const MOCK_HMAC_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'test_dev_hmac_secret_key_12345';

export class EntitlementService {
  /**
   * Generates a signed cryptographic license entitlement for a verified purchase.
   */
  static generateLicense(customerId: string, productId: string): EntitlementRecord {
    const licenseId = `LIC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();

    const payload = `${licenseId}:${customerId}:${productId}:${timestamp}:ACTIVE`;
    const signature = crypto.createHmac('sha256', MOCK_HMAC_SECRET).update(payload).digest('hex');

    return {
      licenseId,
      customerId,
      productId,
      purchaseTimestamp: timestamp,
      licenseType: 'COMMERCIAL_PROPRIETARY',
      status: 'ACTIVE',
      signature
    };
  }

  /**
   * Verifies the authenticity of a license entitlement token.
   */
  static verifyLicense(record: EntitlementRecord): boolean {
    const payload = `${record.licenseId}:${record.customerId}:${record.productId}:${record.purchaseTimestamp}:${record.status}`;
    const expectedSignature = crypto.createHmac('sha256', MOCK_HMAC_SECRET).update(payload).digest('hex');

    const bufA = Buffer.from(record.signature || '', 'hex');
    const bufB = Buffer.from(expectedSignature, 'hex');

    if (bufA.length !== bufB.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
  }
}
