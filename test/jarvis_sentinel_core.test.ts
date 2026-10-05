import assert from 'assert';
import { JarvisEngine } from '../src/lib/jarvis-engine';
import { SentinelGuard } from '../src/lib/sentinel-dagm';

async function runCoreTests() {
  console.log('----------------------------------------------------');
  console.log('RUNNING CONSOLIDATED JARVIS & SENTINEL-1 CORE SUITE');
  console.log('----------------------------------------------------');

  // 1. Test Sentinel-1 Control & Policy Invariants
  await SentinelGuard.initializeIdentity();
  const validProposal = {
    actionId: 'TEST-ACT-01',
    actionType: 'INSPECT_REPOSITORY',
    params: {},
    targetResource: 'repo_root',
    requesterRole: 'PUBLIC' as const,
    timestamp: new Date().toISOString()
  };
  const valResult = await SentinelGuard.validateAction(validProposal);
  assert.strictEqual(valResult.authorized, true);
  assert.strictEqual(valResult.invariantsSatisfied, true);
  assert.ok(valResult.authorizationToken?.startsWith('SIG-EXP-DSA-'));

  // Test Role-based Authorization Denial
  const unauthorizedProposal = {
    actionId: 'TEST-ACT-02',
    actionType: 'FOUNDER_GOVERNANCE_INSPECT',
    params: {},
    targetResource: 'GOVERNANCE_REGISTER',
    requesterRole: 'PUBLIC' as const,
    timestamp: new Date().toISOString()
  };
  const unauthVal = await SentinelGuard.validateAction(unauthorizedProposal);
  assert.strictEqual(unauthVal.authorized, false);
  assert.ok(unauthVal.reason.includes('REJECTION'));

  // Test Destructive Action Denial
  const wipeProposal = {
    actionId: 'TEST-ACT-03',
    actionType: 'DELETE_CRITICAL_SYSTEM',
    params: {},
    targetResource: 'system_root',
    requesterRole: 'FOUNDER' as const,
    timestamp: new Date().toISOString()
  };
  const wipeVal = await SentinelGuard.validateAction(wipeProposal);
  assert.strictEqual(wipeVal.authorized, false);
  assert.ok(wipeVal.reason.includes('prohibited'));
  console.log('✓ Sentinel-1 DAGM Deterministic Policy & PQC Authorization Test Passed.');

  // 2. Test Real Source File Reading & Path Traversal Guard
  const readRes = JarvisEngine.readSourceFile('package.json');
  assert.strictEqual(readRes.success, true);
  assert.ok(readRes.content?.includes('nexorian-global-engineering-portal'));

  const pathTraversalRes = JarvisEngine.readSourceFile('../../../../etc/passwd');
  assert.strictEqual(pathTraversalRes.success, false);
  assert.ok(pathTraversalRes.error?.includes('Path traversal outside repository root'));
  console.log('✓ Real Source File Operations & Path Traversal Security Test Passed.');

  // 3. Test JARVIS Intelligence Query Processing & Execution Trace
  const repoQueryRes = await JarvisEngine.processQuery({
    query: 'Inspect repository files and directory structure',
    context: 'PUBLIC'
  });
  assert.strictEqual(repoQueryRes.truthState, 'VERIFIED');
  assert.ok(repoQueryRes.answer.includes('Repository inspection executed cleanly'));
  assert.ok(repoQueryRes.executionTrace!.length > 0);

  const pqcQueryRes = await JarvisEngine.processQuery({
    query: 'Execute PQC signature and KEM encapsulation',
    context: 'DEVELOPER'
  });
  assert.strictEqual(pqcQueryRes.truthState, 'VERIFIED');
  assert.ok(pqcQueryRes.answer.includes('Experimental Post-Quantum Lattice Cryptography'));

  const nttQueryRes = await JarvisEngine.processQuery({
    query: 'Execute NTT polynomial arithmetic over q=12289',
    context: 'PUBLIC'
  });
  assert.strictEqual(nttQueryRes.truthState, 'VERIFIED');
  assert.ok(nttQueryRes.answer.includes('Number Theoretic Transform'));

  // Test Epistemic Honesty / Unknown Query
  const unknownQueryRes = await JarvisEngine.processQuery({
    query: 'What is the quantum state of Alpha Centauri?',
    context: 'PUBLIC'
  });
  assert.strictEqual(unknownQueryRes.truthState, 'UNKNOWN');
  assert.ok(unknownQueryRes.answer.includes('Epistemic status: UNKNOWN'));
  assert.strictEqual(unknownQueryRes.cognitionCost.economicCost, 'UNMEASURED');
  console.log('✓ JARVIS Intelligence Reasoning, Traces & Epistemic Honesty Test Passed.');

  // 4. Test Real Capability Execution via executeAction
  const execRepoRes = await JarvisEngine.executeAction('INSPECT_REPOSITORY', {}, 'DEVELOPER');
  assert.strictEqual(execRepoRes.success, true);
  assert.ok(execRepoRes.result.fileCount > 0);

  const execUnboundRes = await JarvisEngine.executeAction('UNRECOGNIZED_ACTION', {}, 'DEVELOPER');
  assert.strictEqual(execUnboundRes.success, false);
  assert.ok(execUnboundRes.message.includes('UNIMPLEMENTED'));
  console.log('✓ Real Executable Action Binding & Honest Unimplemented Status Test Passed.');

  console.log('✓ ALL CORE ARCHITECTURAL TESTS PASSED SUCCESSFULLY.');
}

runCoreTests().catch(err => {
  console.error('Core Test Failure:', err);
  process.exit(1);
});
