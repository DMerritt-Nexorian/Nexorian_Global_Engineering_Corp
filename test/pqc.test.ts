import assert from 'assert';
import {
  generateExperimentalDsaKeypair,
  signExperimentalDsaMessage,
  verifyExperimentalDsaSignature,
  generateExperimentalKemKeypair,
  encapsulateExperimentalKem,
  decapsulateExperimentalKem,
  zeroizeSecretKeyHandle,
  hasSecretKeyHandle
} from '../src/lib/pqc-kernel';

async function runPqcKernelTests() {
  console.log('Testing Experimental Post-Quantum Lattice Cryptography Kernel Execution...');

  // 1. Experimental Lattice Signature Test
  const dsaKp = await generateExperimentalDsaKeypair();
  assert.strictEqual(dsaKp.algorithm, 'EXPERIMENTAL-LATTICE-DSA');
  assert.ok(dsaKp.publicKeyHex.startsWith('PUB-EXP-DSA-'));
  assert.ok(dsaKp.secretKeyHandle.startsWith('HANDLE-SEC-'));
  assert.strictEqual(hasSecretKeyHandle(dsaKp.secretKeyHandle), true);

  const msg = 'NEXORIAN CRITICAL STATE MUTATION #9921';
  const sigResult = await signExperimentalDsaMessage(dsaKp.secretKeyHandle, msg);
  assert.strictEqual(sigResult.status, 'SIGNATURE_GENERATED');
  assert.ok(sigResult.signatureHex.startsWith('SIG-EXP-DSA-'));

  const verifyResult = await verifyExperimentalDsaSignature(dsaKp.publicKeyHex, msg, sigResult.signatureHex, dsaKp.secretKeyHandle);
  assert.strictEqual(verifyResult.verified, true);
  assert.strictEqual(verifyResult.status, 'SIGNATURE_VERIFIED');

  // Zeroization Test
  zeroizeSecretKeyHandle(dsaKp.secretKeyHandle);
  assert.strictEqual(hasSecretKeyHandle(dsaKp.secretKeyHandle), false);

  // Tamper Test with new key
  const dsaKp2 = await generateExperimentalDsaKeypair();
  const sig2 = await signExperimentalDsaMessage(dsaKp2.secretKeyHandle, msg);
  const tamperResult = await verifyExperimentalDsaSignature(dsaKp2.publicKeyHex, msg + ' [TAMPERED]', sig2.signatureHex, dsaKp2.secretKeyHandle);
  assert.strictEqual(tamperResult.verified, false);
  assert.strictEqual(tamperResult.tamperDetected, true);
  assert.strictEqual(tamperResult.status, 'TAMPER_TEST_FAILED_AS_EXPECTED');
  zeroizeSecretKeyHandle(dsaKp2.secretKeyHandle);

  console.log('✓ Experimental Lattice Keygen, Sign, Verify, Zeroization, and Tamper Rejection Test Passed.');

  // 2. Experimental Lattice KEM Test
  const kemKp = await generateExperimentalKemKeypair();
  assert.strictEqual(kemKp.algorithm, 'EXPERIMENTAL-LATTICE-KEM');
  assert.ok(kemKp.publicKeyHex.startsWith('PUB-EXP-KEM-'));

  const encap = await encapsulateExperimentalKem(kemKp.publicKeyHex);
  assert.strictEqual(encap.result.status, 'ENCAPSULATED');
  assert.ok(encap.result.ciphertextHex.startsWith('CT-EXP-KEM-'));

  const decap = await decapsulateExperimentalKem(kemKp.secretKeyHandle, encap.result.ciphertextHex, encap.rawSharedSecret, false);
  assert.strictEqual(decap.sharedSecretMatch, true);
  assert.strictEqual(decap.status, 'SHARED_SECRET_VERIFIED');

  const decapTamper = await decapsulateExperimentalKem(kemKp.secretKeyHandle, encap.result.ciphertextHex, encap.rawSharedSecret, true);
  assert.strictEqual(decapTamper.sharedSecretMatch, false);
  assert.strictEqual(decapTamper.tamperDetected, true);
  assert.strictEqual(decapTamper.status, 'TAMPER_TEST_FAILED_AS_EXPECTED');
  zeroizeSecretKeyHandle(kemKp.secretKeyHandle);

  console.log('✓ Experimental Lattice KEM Keygen, Encapsulate, Decapsulate, and Tamper Rejection Test Passed.');
}

runPqcKernelTests().catch(err => {
  console.error('PQC Test Error:', err);
  process.exit(1);
});
