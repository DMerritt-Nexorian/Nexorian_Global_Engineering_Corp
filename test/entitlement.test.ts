import assert from 'assert';
import { EntitlementService } from '../src/lib/entitlement';

console.log('Running Nexorian Commercial Entitlement Verification Tests...');

const license = EntitlementService.generateLicense('CUST-8801', 'NEX-PQC');
assert.ok(license.licenseId.startsWith('LIC-'));
assert.strictEqual(license.customerId, 'CUST-8801');
assert.strictEqual(license.productId, 'NEX-PQC');
assert.strictEqual(license.status, 'ACTIVE');

const isValid = EntitlementService.verifyLicense(license);
assert.strictEqual(isValid, true);

// Tamper test
const tamperedLicense = { ...license, status: 'EXPIRED' as const };
const isTamperedValid = EntitlementService.verifyLicense(tamperedLicense);
assert.strictEqual(isTamperedValid, false);

console.log('✓ All Entitlement & Signature Verification Tests Passed Successfully.');
