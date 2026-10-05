import assert from 'assert';
import { JarvisExecutionFabric, createJarvisExecutionFabric } from '../src/lib/jarvis-execution-fabric';
import { JarvisSentinelGate, DEFAULT_SENTINEL_POLICY } from '../src/lib/jarvis-sentinel-gate';
import { ExecutionIntent } from '../src/lib/jarvis-contracts';

async function runExecutionFabricTests() {
  console.log('----------------------------------------------------');
  console.log('RUNNING JARVIS EXECUTION FABRIC (FILE 7) TEST SUITE');
  console.log('----------------------------------------------------');

  const gate = new JarvisSentinelGate(DEFAULT_SENTINEL_POLICY);
  const fabric = createJarvisExecutionFabric(gate);

  const validObjective = {
    id: 'obj:fab:1',
    description: 'Inspect repository filesystem',
    priority: 1,
    successCriteria: [{ id: 'sc:1', description: 'fs.readdirSync returns list of files', verificationRequired: true }],
    createdAt: new Date().toISOString()
  };

  const validIntent: ExecutionIntent = {
    objective: validObjective,
    scope: ['src/lib/'],
    authority: {
      role: 'DEVELOPER',
      authorizationRequired: true
    },
    verificationRequirements: [{ id: 'ver:1', description: 'Check fs', method: 'fs_check', mandatory: true }],
    reasoningConclusion: {
      truthState: 'VERIFIED',
      confidence: 1,
      evidenceRefs: ['EVID-1']
    }
  };

  // 1. Register Capability
  fabric.registerCapability({
    id: 'repository.inspect',
    description: 'Audits repository structure.',
    status: 'IMPLEMENTED',
    requiredRoles: ['DEVELOPER', 'FOUNDER'],
    sideEffects: ['READ_FILESYSTEM'],
    inputSchema: 'JSON',
    outputSchema: 'JSON',
    execute: async (input: any) => ({
      status: 'SUCCESS',
      truthState: 'VERIFIED',
      output: { items: 10 },
      evidence: [{
        type: 'OBSERVATION',
        source: 'filesystem',
        statement: 'Found 10 items',
        truthState: 'VERIFIED',
        timestamp: new Date().toISOString()
      }]
    })
  });

  const capDesc = fabric.describeCapability('repository.inspect');
  assert.ok(capDesc);
  assert.strictEqual(capDesc.status, 'IMPLEMENTED');
  console.log('✓ 1. Capability registration & descriptor lookup passed.');

  // 2. Duplicate registration rejection
  assert.throws(() => {
    fabric.registerCapability({
      id: 'repository.inspect',
      description: 'Duplicate',
      status: 'IMPLEMENTED',
      requiredRoles: ['DEVELOPER'],
      sideEffects: ['NONE'],
      inputSchema: 'JSON',
      outputSchema: 'JSON',
      execute: async () => ({ status: 'SUCCESS', truthState: 'VERIFIED', evidence: [] })
    });
  }, /already registered/);
  console.log('✓ 2. Duplicate capability registration rejection passed.');

  // 3. Unknown capability rejection
  const unkRes = await fabric.execute(validIntent, 'ntt.transform' as any, {});
  assert.strictEqual(unkRes.status, 'UNIMPLEMENTED');
  assert.strictEqual(unkRes.truthState, 'UNIMPLEMENTED');
  console.log('✓ 3. Unknown capability rejection passed.');

  // 4. Unimplemented capability registration & rejection
  fabric.registerCapability({
    id: 'pqc.polynomial',
    description: 'Unimplemented PQC core',
    status: 'UNIMPLEMENTED',
    requiredRoles: ['DEVELOPER'],
    sideEffects: ['NONE'],
    inputSchema: 'JSON',
    outputSchema: 'JSON'
  });

  const unimplRes = await fabric.execute(validIntent, 'pqc.polynomial', {});
  assert.strictEqual(unimplRes.status, 'UNIMPLEMENTED');
  console.log('✓ 4. Unimplemented capability rejection passed.');

  // 5. Sentinel denial preventing execution
  const deniedIntent: ExecutionIntent = { ...validIntent, scope: [] }; // Invalid scope triggers Sentinel denial
  const deniedRes = await fabric.execute(deniedIntent, 'repository.inspect', {});
  assert.strictEqual(deniedRes.status, 'DENIED');
  assert.strictEqual(deniedRes.sentinel.decision, 'DENY');
  console.log('✓ 5. Sentinel denial preventing capability execution passed.');

  // 6. Security: Authorization requirement cannot be disabled
  const disabledAuthIntent: ExecutionIntent = {
    ...validIntent,
    authority: { role: 'DEVELOPER', authorizationRequired: false }
  };
  const disabledAuthRes = await fabric.execute(disabledAuthIntent, 'repository.inspect', {});
  assert.strictEqual(disabledAuthRes.status, 'DENIED');
  console.log('✓ 6. Security: Disabling authorization requirement triggers DENIED passed.');

  // 7. Capability role mismatch rejection
  const roleMismatchIntent: ExecutionIntent = {
    ...validIntent,
    authority: { role: 'PUBLIC', authorizationRequired: true }
  };
  const roleMismatchRes = await fabric.execute(roleMismatchIntent, 'repository.inspect', {});
  assert.strictEqual(roleMismatchRes.status, 'DENIED');
  console.log('✓ 7. Capability role mismatch rejection passed.');

  // 8. Successful real capability execution & epistemic state preservation
  const execRes = await fabric.execute(validIntent, 'repository.inspect', {});
  assert.strictEqual(execRes.status, 'EXECUTED');
  assert.strictEqual(execRes.truthState, 'VERIFIED');
  assert.deepStrictEqual(execRes.output, { items: 10 });
  console.log('✓ 8. Successful real capability execution & epistemic state preservation passed.');

  // 9. Capability failure propagation
  fabric.registerCapability({
    id: 'file.read',
    description: 'Failing read',
    status: 'IMPLEMENTED',
    requiredRoles: ['DEVELOPER'],
    sideEffects: ['READ_FILESYSTEM'],
    inputSchema: 'JSON',
    outputSchema: 'JSON',
    execute: async () => ({
      status: 'FAILED',
      truthState: 'FAILED',
      error: 'File not found',
      evidence: [{
        type: 'ERROR',
        source: 'filesystem',
        statement: 'File not found',
        truthState: 'FAILED',
        timestamp: new Date().toISOString()
      }]
    })
  });

  const failRes = await fabric.execute(validIntent, 'file.read', {});
  assert.strictEqual(failRes.status, 'FAILED');
  assert.strictEqual(failRes.truthState, 'FAILED');
  assert.strictEqual(failRes.error, 'File not found');
  console.log('✓ 9. Capability failure propagation passed.');

  // 10. Exception handling
  const isolateFabric = createJarvisExecutionFabric(gate);
  isolateFabric.registerCapability({
    id: 'pqc.polynomial',
    description: 'Throwing cap',
    status: 'IMPLEMENTED',
    requiredRoles: ['DEVELOPER'],
    sideEffects: ['NONE'],
    inputSchema: 'JSON',
    outputSchema: 'JSON',
    execute: async () => { throw new Error('Hardware exception'); }
  });

  const excRes = await isolateFabric.execute(validIntent, 'pqc.polynomial', {});
  assert.strictEqual(excRes.status, 'FAILED');
  assert.strictEqual(excRes.error, 'Hardware exception');
  console.log('✓ 10. Exception handling passed.');

  // 11. Epistemic state preservation (EXPERIMENTAL state preserved, no automatic VERIFIED upgrade)
  fabric.registerCapability({
    id: 'ntt.transform',
    description: 'Experimental transform',
    status: 'IMPLEMENTED',
    requiredRoles: ['DEVELOPER'],
    sideEffects: ['NONE'],
    inputSchema: 'JSON',
    outputSchema: 'JSON',
    execute: async () => ({
      status: 'SUCCESS',
      truthState: 'EXPERIMENTAL',
      output: { verified: true },
      evidence: [{
        type: 'OBSERVATION',
        source: 'ntt-kernel',
        statement: 'Experimental transform executed',
        truthState: 'EXPERIMENTAL',
        timestamp: new Date().toISOString()
      }]
    })
  });

  const expRes = await fabric.execute(validIntent, 'ntt.transform', {});
  assert.strictEqual(expRes.status, 'EXECUTED');
  assert.strictEqual(expRes.truthState, 'EXPERIMENTAL'); // Truth state remains EXPERIMENTAL, not upgraded to VERIFIED
  console.log('✓ 11. Epistemic state preservation (no automatic VERIFIED upgrade) passed.');

  console.log('✓ ALL JARVIS EXECUTION FABRIC TEST SCENARIOS PASSED CLEANLY.');
}

runExecutionFabricTests().catch(err => {
  console.error('Execution Fabric Test Failure:', err);
  process.exit(1);
});
