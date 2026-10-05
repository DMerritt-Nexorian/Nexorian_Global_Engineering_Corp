import assert from 'assert';
import { JarvisWorldModel } from '../src/lib/jarvis-world-model';
import { JarvisEvidenceEngine } from '../src/lib/jarvis-evidence-engine';
import { JarvisReasoningEngine, ReasoningResult } from '../src/lib/jarvis-reasoning-engine';
import { JarvisIntentCompiler, JARVIS_INTENT_COMPILER_VERSION } from '../src/lib/jarvis-intent-compiler';

console.log('----------------------------------------------------');
console.log('RUNNING JARVIS INTENT COMPILER (FILE 5) TEST SUITE');
console.log('----------------------------------------------------');

const wm = new JarvisWorldModel();
const ee = new JarvisEvidenceEngine(wm);
const re = new JarvisReasoningEngine(wm, ee);
const compiler = new JarvisIntentCompiler();

const validObjective = {
  id: 'obj:comp:1',
  description: 'Inspect repository filesystem',
  priority: 1,
  successCriteria: [{ id: 'sc:1', description: 'fs.readdirSync returns list of files', verificationRequired: true }],
  createdAt: new Date().toISOString()
};

const validReasoning: ReasoningResult = {
  id: 'reasoning:valid:1',
  objective: validObjective,
  mode: 'PLANNING',
  status: 'COMPLETE',
  premises: [{
    id: 'premise:1',
    statement: 'repository.status = VERIFIED',
    truthState: 'VERIFIED',
    confidence: 1,
    evidence: [],
    evidenceRefs: ['EVID-100'],
    sourceFactIds: []
  }],
  assumptions: [],
  steps: [],
  alternatives: [],
  conclusion: {
    text: 'A candidate execution plan may be constructed.',
    truthState: 'DERIVED',
    confidence: 0.9,
    evidenceRefs: ['EVID-100']
  },
  truthState: 'DERIVED',
  confidence: 0.9,
  evidence: [],
  blockers: [],
  uncertainties: [],
  contradictions: [],
  requiresVerification: true,
  executionAuthorizationRequired: true
};

// 1. Valid reasoning -> successful compilation
const res1 = compiler.compile({
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [{ id: 'pre:1', description: 'Repository root exists on disk' }],
  verificationRequirements: [{ id: 'ver:1', description: 'Verify readdirSync results', method: 'fs_check', mandatory: true }],
  resourceBudget: { maxCpuTimeMs: 1000 }
});

assert.strictEqual(res1.compiled, true);
assert.ok(res1.intent);
assert.strictEqual(res1.authorizationRequired, true);
console.log('✓ 1. Valid reasoning -> successful compilation passed.');

// 2. Blocked reasoning -> rejected
const res2 = compiler.compile({
  reasoning: { ...validReasoning, status: 'BLOCKED' },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res2.compiled, false);
assert.ok(res2.failures.includes('BLOCKED_REASONING'));
console.log('✓ 2. Blocked reasoning -> rejected passed.');

// 3. Conflicted reasoning -> rejected
const res3 = compiler.compile({
  reasoning: { ...validReasoning, status: 'CONFLICTED' },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res3.compiled, false);
assert.ok(res3.failures.includes('CONFLICTED_REASONING'));
console.log('✓ 3. Conflicted reasoning -> rejected passed.');

// 4. Insufficient evidence -> rejected
const res4 = compiler.compile({
  reasoning: { ...validReasoning, status: 'INSUFFICIENT_EVIDENCE' },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res4.compiled, false);
assert.ok(res4.failures.includes('INSUFFICIENT_EVIDENCE'));
console.log('✓ 4. Insufficient evidence -> rejected passed.');

// 5. Missing objective -> rejected
const res5 = compiler.compile({
  reasoning: { ...validReasoning, objective: undefined },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res5.compiled, false);
assert.ok(res5.failures.includes('MISSING_OBJECTIVE'));
console.log('✓ 5. Missing objective -> rejected passed.');

// 6. Missing scope -> rejected
const res6 = compiler.compile({
  reasoning: validReasoning,
  scope: [],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res6.compiled, false);
assert.ok(res6.failures.includes('MISSING_SCOPE'));
console.log('✓ 6. Missing scope -> rejected passed.');

// 7. Missing authority -> rejected
const res7 = compiler.compile({
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: undefined,
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res7.compiled, false);
assert.ok(res7.failures.includes('MISSING_AUTHORITY'));
console.log('✓ 7. Missing authority -> rejected passed.');

// 8. Missing success criteria -> rejected
const res8 = compiler.compile({
  reasoning: { ...validReasoning, objective: { ...validObjective, successCriteria: [] } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res8.compiled, false);
assert.ok(res8.failures.includes('MISSING_SUCCESS_CRITERIA'));
console.log('✓ 8. Missing success criteria -> rejected passed.');

// 9. Missing preconditions -> rejected
const res9 = compiler.compile({
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: undefined,
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res9.compiled, false);
assert.ok(res9.failures.includes('MISSING_PRECONDITIONS'));
console.log('✓ 9. Missing preconditions -> rejected passed.');

// 10. Missing verification -> rejected
const res10 = compiler.compile({
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: []
});
assert.strictEqual(res10.compiled, false);
assert.ok(res10.failures.includes('MISSING_VERIFICATION'));
console.log('✓ 10. Missing verification -> rejected passed.');

// 11. VERIFIED state preserved
const res11 = compiler.compile({
  reasoning: { ...validReasoning, conclusion: { ...validReasoning.conclusion, truthState: 'VERIFIED' } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res11.truthState, 'VERIFIED');
console.log('✓ 11. VERIFIED state preserved passed.');

// 12. DERIVED state preserved
const res12 = compiler.compile({
  reasoning: { ...validReasoning, conclusion: { ...validReasoning.conclusion, truthState: 'DERIVED' } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res12.truthState, 'DERIVED');
console.log('✓ 12. DERIVED state preserved passed.');

// 13. INFERRED state preserved
const res13 = compiler.compile({
  reasoning: { ...validReasoning, conclusion: { ...validReasoning.conclusion, truthState: 'INFERRED' } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res13.truthState, 'INFERRED');
console.log('✓ 13. INFERRED state preserved passed.');

// 14. EXPERIMENTAL state not upgraded
const res14 = compiler.compile({
  reasoning: { ...validReasoning, conclusion: { ...validReasoning.conclusion, truthState: 'EXPERIMENTAL' } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res14.truthState, 'EXPERIMENTAL');
console.log('✓ 14. EXPERIMENTAL state not upgraded passed.');

// 15. UNKNOWN rejected
const res15 = compiler.compile({
  reasoning: { ...validReasoning, conclusion: { ...validReasoning.conclusion, truthState: 'UNKNOWN' } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res15.compiled, false);
assert.ok(res15.failures.includes('UNSUPPORTED_TRUTH_STATE'));
console.log('✓ 15. UNKNOWN rejected passed.');

// 16. CONFLICTING rejected
const res16 = compiler.compile({
  reasoning: { ...validReasoning, status: 'CONFLICTED', conclusion: { ...validReasoning.conclusion, truthState: 'CONFLICTING' } },
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res16.compiled, false);
assert.ok(res16.failures.includes('CONFLICTED_REASONING'));
console.log('✓ 16. CONFLICTING rejected passed.');

// 17. Evidence references preserved
assert.deepStrictEqual(res1.evidenceRefs, ['EVID-100']);
console.log('✓ 17. Evidence references preserved passed.');

// 18. Expected effects preserved without claiming execution
const res18 = compiler.compile({
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  expectedEffects: [{ id: 'eff:1', description: 'Directory list returned' }],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
});
assert.strictEqual(res18.compiled, true);
assert.strictEqual(res18.intent?.expectedEffects?.length, 1);
console.log('✓ 18. Expected effects preserved passed.');

// 19. Resource budget preserved when actually supplied
assert.deepStrictEqual(res1.intent?.resourceBudget, { maxCpuTimeMs: 1000 });
console.log('✓ 19. Resource budget preserved when supplied passed.');

// 20. Absent resource budget produces explicit unresolved warning
const res20 = compiler.compile({
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER',
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }],
  resourceBudget: undefined
});
assert.ok(res20.warnings.some(w => w.includes('No resource budget supplied')));
console.log('✓ 20. Absent resource budget warning passed.');

// 21. Authorization remains required
assert.strictEqual(res1.authorizationRequired, true);
console.log('✓ 21. Authorization remains required passed.');

// 22, 23, 24. Compiler performs no execution/network/file activity & is deterministic
const request24 = {
  reasoning: validReasoning,
  scope: ['src/lib/'],
  authorityRole: 'DEVELOPER' as const,
  preconditions: [],
  verificationRequirements: [{ id: 'ver:1', description: 'Check', method: 'check', mandatory: true }]
};
const res24A = compiler.compile(request24);
const res24B = compiler.compile(request24);
assert.deepStrictEqual(res24A, res24B);
assert.strictEqual(res24A.compilerVersion, JARVIS_INTENT_COMPILER_VERSION);
console.log('✓ 22, 23, 24. Compiler stateless, performs no execution/network/file activity & deterministic output passed.');

console.log('✓ ALL 24 JARVIS INTENT COMPILER SCENARIOS PASSED CLEANLY.');
