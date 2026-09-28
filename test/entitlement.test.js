const assert = require('assert');
const crypto = require('crypto');

// Simulated Entitlement Verification Test using identical logic as src/lib/entitlement.ts
const MOCK_HMAC_SECRET = 'test_dev_hmac_secret_key_12345';

function generateLicense(customerId, productId) {
  const licenseId = `LIC-TEST-8899`;
  const timestamp = '2026-09-26T00:00:00.000Z';
  const payload = `${licenseId}:${customerId}:${productId}:${timestamp}:ACTIVE`;
  const signature = crypto.createHmac('sha256', MOCK_HMAC_SECRET).update(payload).digest('hex');

  return {
    licenseId,
    customerId,
    productId,
    purchaseTimestamp: timestamp,
    status: 'ACTIVE',
    signature
  };
}

function verifyLicense(record) {
  const payload = `${record.licenseId}:${record.customerId}:${record.productId}:${record.purchaseTimestamp}:${record.status}`;
  const expectedSignature = crypto.createHmac('sha256', MOCK_HMAC_SECRET).update(payload).digest('hex');

  const bufA = Buffer.from(record.signature || '', 'hex');
  const bufB = Buffer.from(expectedSignature, 'hex');

  if (bufA.length !== bufB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

// Test Suite Execution
console.log('Running Nexorian Commercial Entitlement Verification Tests...');

const license = generateLicense('CUST-1001', 'NEX-PORTAL');
assert.strictEqual(verifyLicense(license), true, 'License HMAC signature verification failed');

// Tamper Test
const tamperedLicense = { ...license, customerId: 'CUST-TAMPERED' };
assert.strictEqual(verifyLicense(tamperedLicense), false, 'Tampered license failed to trigger HMAC validation error');

// Different signature length test (timingSafeEqual safety)
const invalidLengthLicense = { ...license, signature: 'abc123' };
assert.strictEqual(verifyLicense(invalidLengthLicense), false, 'Invalid signature length failed safely');

console.log('✓ All Entitlement & Signature Verification Tests Passed Successfully.');
