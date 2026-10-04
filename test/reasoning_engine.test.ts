import assert from 'assert';
import { JarvisWorldModel } from '../src/lib/jarvis-world-model';
import { JarvisEvidenceEngine } from '../src/lib/jarvis-evidence-engine';
import { JarvisReasoningEngine } from '../src/lib/jarvis-reasoning-engine';

console.log('----------------------------------------------------');
console.log('RUNNING JARVIS REASONING ENGINE (FILE 4) TEST SUITE');
console.log('----------------------------------------------------');

const wm = new JarvisWorldModel();
const ee = new JarvisEvidenceEngine(wm);
const re = new JarvisReasoningEngine(wm, ee);

// Seed facts into world model for testing
wm.assertFact({
  id: 'fact:repo:1',
  subjectId: 'repository',
  attribute: 'status',
  value: 'VERIFIED',
  truthState: 'VERIFIED',
  evidence: [{
    id: 'evid:repo:1',
    sourceType: 'filesystem',
    description: 'Repository filesystem read verified.',
    truthState: 'VERIFIED',
    observedAt: new Date().toISOString()
  }],
  sourceObservationIds: [],
  firstObservedAt: new Date().toISOString()
});

wm.assertFact({
  id: 'fact:pqc:1',
  subjectId: 'pqc_kernel',
  attribute: 'state',
  value: 'EXPERIMENTAL',
  truthState: 'EXPERIMENTAL',
  evidence: [{
    id: 'evid:pqc:1',
    sourceType: 'tool',
    description: 'Experimental lattice signature generated.',
    truthState: 'EXPERIMENTAL',
    observedAt: new Date().toISOString()
  }],
  sourceObservationIds: [],
  firstObservedAt: new Date().toISOString()
});

// Scenario 1: Reasoning with verified premises
const res1 = re.reason({
  id: 'req:1',
  mode: 'VALIDATION',
  question: 'Is repository status verified?',
  claims: [{
    id: 'claim:repo:status',
    subject: 'repository',
    predicate: 'status',
    value: 'VERIFIED',
    truthState: 'VERIFIED',
    evidence: [],
    createdAt: new Date().toISOString()
  }]
});
assert.strictEqual(res1.status, 'COMPLETE');
assert.strictEqual(res1.truthState, 'DERIVED');
assert.strictEqual(res1.premises[0].truthState, 'VERIFIED');
console.log('✓ 1. Reasoning with verified premises passed.');

// Scenario 2: Reasoning with observed premises
const res2 = re.reason({
  id: 'req:2',
  mode: 'VALIDATION',
  question: 'Is query observed?',
  claims: [{
    id: 'claim:obs:1',
    subject: 'user_prompt',
    predicate: 'input',
    value: 'INSPECT',
    truthState: 'OBSERVED',
    evidence: [],
    createdAt: new Date().toISOString()
  }]
});
assert.strictEqual(res2.premises[0].truthState, 'UNKNOWN');
console.log('✓ 2. Reasoning with observed premises passed.');

// Scenario 3: Reasoning with inferred premises
const res3 = re.reason({
  id: 'req:3',
  mode: 'VALIDATION',
  question: 'Is system inferred state valid?',
  claims: [{
    id: 'claim:inf:1',
    subject: 'jarvis_platform',
    predicate: 'ntt_accelerated',
    value: true,
    truthState: 'INFERRED',
    evidence: [],
    createdAt: new Date().toISOString()
  }]
});
assert.strictEqual(res3.truthState, 'UNKNOWN');
console.log('✓ 3. Reasoning with inferred premises passed.');

// Scenario 4: Reasoning with no premises
const res4 = re.reason({
  id: 'req:4',
  mode: 'VALIDATION',
  question: 'Are there premises?',
  claims: []
});
assert.strictEqual(res4.status, 'INSUFFICIENT_EVIDENCE');
assert.strictEqual(res4.confidence, 0);
console.log('✓ 4. Reasoning with no premises passed.');

// Scenario 5 & 19: Contradicted premises & contradictory evidence handling
wm.assertFact({
  id: 'fact:conflict:1',
  subjectId: 'pqc_kernel',
  attribute: 'state',
  value: 'INACTIVE',
  truthState: 'FAILED',
  evidence: [],
  sourceObservationIds: [],
  firstObservedAt: new Date().toISOString()
});

const res5 = re.reason({
  id: 'req:5',
  mode: 'DIAGNOSIS',
  question: 'What is PQC state?',
  claims: [{
    id: 'claim:pqc:state',
    subject: 'pqc_kernel',
    predicate: 'state',
    value: 'EXPERIMENTAL',
    truthState: 'EXPERIMENTAL',
    evidence: [],
    createdAt: new Date().toISOString()
  }]
});
assert.strictEqual(res5.status, 'CONFLICTED');
assert.strictEqual(res5.truthState, 'CONFLICTING');
assert.ok(res5.contradictions.length > 0);
console.log('✓ 5 & 19. Contradicted premises & contradictory evidence passed.');

// Scenario 6: Insufficient evidence
const res6 = re.reason({
  id: 'req:6',
  mode: 'INVESTIGATION',
  question: 'Does dark matter exist in repo?',
  claims: [{
    id: 'claim:dm:1',
    subject: 'dark_matter',
    predicate: 'density',
    value: 100,
    truthState: 'HYPOTHESIZED',
    evidence: [],
    createdAt: new Date().toISOString()
  }]
});
assert.strictEqual(res6.status, 'PARTIAL');
assert.ok(res6.uncertainties.length > 0);
console.log('✓ 6. Insufficient evidence handling passed.');

// Scenario 7: Objective decomposition
const res7 = re.reason({
  id: 'req:7',
  mode: 'DECOMPOSITION',
  question: 'Decompose core objective',
  objective: {
    id: 'obj:1',
    description: 'Verify repository filesystem and core cryptographic arithmetic',
    priority: 1,
    successCriteria: [{ id: 'sc:1', description: 'fs.readdirSync returns > 0 files', verificationRequired: true }],
    createdAt: new Date().toISOString()
  }
});
assert.strictEqual(res7.mode, 'DECOMPOSITION');
assert.ok(res7.steps.length > 0);
console.log('✓ 7. Objective decomposition passed.');

// Scenario 8: Constraint recognition
const res8 = re.reason({
  id: 'req:8',
  mode: 'DECOMPOSITION',
  question: 'Check constraints',
  objective: {
    id: 'obj:2',
    description: 'Execute under safety bounds',
    priority: 1,
    successCriteria: [],
    createdAt: new Date().toISOString()
  },
  constraints: [{
    id: 'const:1',
    description: 'No destructive file wipe allowed',
    type: 'SAFETY',
    mandatory: true
  }]
});
assert.strictEqual(res8.assumptions.length, 1);
assert.strictEqual(res8.assumptions[0].statement, 'No destructive file wipe allowed');
console.log('✓ 8. Constraint recognition passed.');

// Scenario 9: Alternative comparison
const res9 = re.reason({
  id: 'req:9',
  mode: 'COMPARISON',
  question: 'Compare option A vs option B',
  alternatives: [
    {
      id: 'alt:A',
      description: 'Option A: Direct NTT execution',
      advantages: ['Fast', 'Constant-time'],
      disadvantages: [],
      dependencies: [],
      risks: [],
      evidence: [],
      truthState: 'VERIFIED'
    },
    {
      id: 'alt:B',
      description: 'Option B: External RPC call',
      advantages: ['Remote'],
      disadvantages: ['Network latency'],
      dependencies: ['network'],
      risks: ['connection_failure'],
      evidence: [],
      truthState: 'UNVERIFIED'
    }
  ]
});
assert.strictEqual(res9.mode, 'COMPARISON');
assert.strictEqual(res9.steps.length, 2);
console.log('✓ 9. Alternative comparison passed.');

// Scenario 10: Diagnosis
const res10 = re.reason({
  id: 'req:10',
  mode: 'DIAGNOSIS',
  question: 'Diagnose filesystem status',
  claims: [{
    id: 'claim:diag:1',
    subject: 'repository',
    predicate: 'status',
    value: 'VERIFIED',
    truthState: 'VERIFIED',
    evidence: [],
    createdAt: new Date().toISOString()
  }]
});
assert.strictEqual(res10.mode, 'DIAGNOSIS');
assert.ok(res10.steps.length > 0);
console.log('✓ 10. Diagnosis passed.');

// Scenario 11 & 12: Causal reasoning & causal result remains INFERRED
const res11 = re.reason({
  id: 'req:11',
  mode: 'CAUSAL',
  question: 'Evaluate cause and effect',
  claims: [
    { id: 'c1', subject: 'repo', predicate: 'status', value: 'VERIFIED', truthState: 'VERIFIED', evidence: [], createdAt: new Date().toISOString() },
    { id: 'c2', subject: 'ntt_kernel', predicate: 'modulus', value: 12289, truthState: 'VERIFIED', evidence: [], createdAt: new Date().toISOString() }
  ]
});
assert.strictEqual(res11.mode, 'CAUSAL');
assert.strictEqual(res11.truthState, 'INFERRED');
console.log('✓ 11 & 12. Causal reasoning remains INFERRED passed.');

// Scenario 13: Planning produces no execution
const res13 = re.reason({
  id: 'req:13',
  mode: 'PLANNING',
  question: 'Plan repository verification',
  objective: {
    id: 'obj:plan:1',
    description: 'Construct execution plan',
    priority: 1,
    successCriteria: [],
    createdAt: new Date().toISOString()
  }
});
assert.strictEqual(res13.mode, 'PLANNING');
assert.strictEqual(res13.executionAuthorizationRequired, true);
assert.ok(res13.uncertainties.some(u => u.includes('No execution should occur')));
console.log('✓ 13. Planning produces no execution passed.');

// Scenario 14: Validation
const res14 = re.reason({
  id: 'req:14',
  mode: 'VALIDATION',
  question: 'Validate fact',
  claims: [{ id: 'v1', subject: 'repository', predicate: 'status', value: 'VERIFIED', truthState: 'VERIFIED', evidence: [], createdAt: new Date().toISOString() }]
});
assert.strictEqual(res14.mode, 'VALIDATION');
assert.ok(res14.steps.length > 0);
console.log('✓ 14. Validation passed.');

// Scenario 15: Investigation
const res15 = re.reason({
  id: 'req:15',
  mode: 'INVESTIGATION',
  question: 'Investigate world model facts'
});
assert.strictEqual(res15.mode, 'INVESTIGATION');
assert.ok(res15.steps.length > 0);
console.log('✓ 15. Investigation passed.');

// Scenario 16: Decision reasoning
const res16 = re.reason({
  id: 'req:16',
  mode: 'DECISION',
  question: 'Decide on algorithm option',
  alternatives: [{
    id: 'alt:d1',
    description: 'Use Experimental Lattice DSA',
    advantages: ['Galois field math'],
    disadvantages: [],
    dependencies: [],
    risks: [],
    evidence: [],
    truthState: 'EXPERIMENTAL'
  }]
});
assert.strictEqual(res16.mode, 'DECISION');
assert.strictEqual(res16.executionAuthorizationRequired, true);
console.log('✓ 16. Decision reasoning passed.');

// Scenario 17: Evidence threshold enforcement
const res17 = re.reason({
  id: 'req:17',
  mode: 'VALIDATION',
  question: 'Check decisive threshold',
  requiredEvidenceStrength: 'DECISIVE',
  claims: [{ id: 'th1', subject: 'unverified_subject', predicate: 'status', value: 'UNVERIFIED', truthState: 'UNVERIFIED', evidence: [], createdAt: new Date().toISOString() }]
});
assert.strictEqual(res17.status, 'BLOCKED');
assert.ok(res17.blockers.some(b => b.includes('does not meet the requested DECISIVE threshold')));
console.log('✓ 17. Evidence threshold enforcement passed.');

// Scenario 18: Confidence remains bounded 0..1
const res18 = re.reason({
  id: 'req:18',
  mode: 'VALIDATION',
  question: 'Check confidence bounds',
  claims: [{ id: 'b1', subject: 'repository', predicate: 'status', value: 'VERIFIED', truthState: 'VERIFIED', evidence: [], createdAt: new Date().toISOString() }]
});
assert.ok(res18.confidence >= 0 && res18.confidence <= 1);
console.log('✓ 18. Confidence bounded 0..1 passed.');

// Scenario 20: Reasoning result indicates when verification is required
assert.strictEqual(res11.requiresVerification, true);
assert.strictEqual(res1.requiresVerification, true); // DERIVED truth state requires verification
console.log('✓ 20. Verification requirement indication passed.');

console.log('✓ JARVIS REASONING ENGINE ALL 20 TEST SCENARIOS PASSED CLEANLY.');
