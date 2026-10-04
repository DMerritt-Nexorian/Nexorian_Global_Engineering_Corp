const assert = require('assert');
const { SentinelGuard } = require('../dist/sentinel-dagm');
const { JarvisEngine } = require('../dist/jarvis-engine');

async function runFailureInjectionTests() {
  console.log('----------------------------------------------------');
  console.log('RUNNING FAILURE INJECTION & SECURITY SUITE');
  console.log('----------------------------------------------------');

  await SentinelGuard.initializeIdentity();

  // 1. Failure Test: Path Traversal Attack in Source File Reading
  console.log('Injecting Path Traversal Attack...');
  const pathTraversalRes = JarvisEngine.readSourceFile('../../../../etc/passwd');
  assert.strictEqual(pathTraversalRes.success, false);
  assert.ok(pathTraversalRes.error.includes('Path traversal outside repository root'));
  console.log('✓ Path Traversal Attack safely blocked.');

  // 2. Security Test: Unauthorized Role Escalation
  console.log('Injecting Unauthorized Role Escalation...');
  const unauthGovRes = await SentinelGuard.validateAction({
    actionId: 'INJECT-01',
    actionType: 'FOUNDER_GOVERNANCE_INSPECT',
    params: {},
    targetResource: 'GOVERNANCE_REGISTER',
    requesterRole: 'PUBLIC',
    timestamp: new Date().toISOString()
  });
  assert.strictEqual(unauthGovRes.authorized, false);
  assert.ok(unauthGovRes.reason.includes('REJECTION'));
  console.log('✓ Privilege escalation attempt safely blocked by Sentinel-1.');

  // 3. Security Test: Destructive System Wipe Invariant Violation
  console.log('Injecting Destructive System Wipe Attempt...');
  const wipeRes = await SentinelGuard.validateAction({
    actionId: 'INJECT-02',
    actionType: 'DELETE_CRITICAL_SYSTEM',
    params: { forceWipe: true },
    targetResource: 'system_root',
    requesterRole: 'FOUNDER',
    timestamp: new Date().toISOString()
  });
  assert.strictEqual(wipeRes.authorized, false);
  assert.ok(wipeRes.reason.includes('prohibited'));
  console.log('✓ Destructive system wipe attempt safely blocked by Sentinel-1.');

  // 4. Failure Test: Malformed/Tampered PQC Signature Verification
  console.log('Injecting Tampered PQC Signature Verification...');
  const { generateMlDsaKeypair, verifyMlDsaSignature } = require('../dist/pqc-kernel');
  const kp = await generateMlDsaKeypair();
  const tamperedVerify = await verifyMlDsaSignature(
    kp.publicKeyHex,
    'LEGITIMATE MESSAGE',
    'SIG-ML-DSA-87-CORRUPTED_SIGNATURE_HEX_12345',
    kp.secretKeyHandle
  );
  assert.strictEqual(tamperedVerify.verified, false);
  assert.strictEqual(tamperedVerify.tamperDetected, true);
  console.log('✓ Cryptographic tamper attempt safely detected and rejected.');

  // 5. Failure Test: Epistemic Refusal on Ambiguous Prompt
  console.log('Injecting Ambiguous Prompt...');
  const ambiguousRes = await JarvisEngine.processQuery({
    query: 'Execute quantum teleportation to Mars base',
    context: 'PUBLIC'
  });
  assert.strictEqual(ambiguousRes.truthState, 'UNKNOWN');
  assert.ok(ambiguousRes.answer.includes('Epistemic status: UNKNOWN'));
  console.log('✓ Epistemic honesty maintained for unverifiable requests.');

  console.log('✓ ALL FAILURE-INJECTION & SECURITY TESTS PASSED SUCCESSFULLY.');
}

runFailureInjectionTests().catch(err => {
  console.error('Failure Injection Test Error:', err);
  process.exit(1);
});
