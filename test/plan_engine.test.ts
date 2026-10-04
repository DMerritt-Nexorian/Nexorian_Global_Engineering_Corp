import assert from 'assert';
import {
  createJarvisPlan,
  validateJarvisPlan,
  getExecutionOrder,
  createSentinelPlanEnvelope,
  fingerprintPlan,
  ResourceBudget,
  JarvisPlanStep
} from '../src/lib/jarvis-plan';

console.log('----------------------------------------------------');
console.log('RUNNING JARVIS PLAN ENGINE (FILE 8) TEST SUITE');
console.log('----------------------------------------------------');

const defaultBudget: ResourceBudget = {
  maxSteps: 5,
  maxExecutionMs: 5000,
  maxReadBytes: 100000,
  maxWriteBytes: 10000,
  maxToolCalls: 5
};

const validStep1: JarvisPlanStep = {
  id: 'step:1',
  kind: 'READ',
  description: 'Inspect repository root',
  dependsOn: [],
  capabilities: [{ id: 'repository.inspect', authorization: 'DEVELOPER', sentinelApprovalRequired: true }],
  preconditions: [{ id: 'c1', description: 'System online', truthState: 'VERIFIED' }],
  postconditions: [{ id: 'c2', description: 'Repository inspected', truthState: 'OBSERVED' }],
  evidence: [{ type: 'OBSERVATION', description: 'Dir list', required: true }],
  risk: 'LOW',
  requiresRollback: false,
  mutatesState: false
};

const validStep2: JarvisPlanStep = {
  id: 'step:2',
  kind: 'COMPUTE',
  description: 'Execute NTT polynomial recovery',
  dependsOn: ['step:1'],
  capabilities: [{ id: 'ntt.transform', authorization: 'DEVELOPER', sentinelApprovalRequired: true }],
  preconditions: [{ id: 'c3', description: 'Inputs valid', truthState: 'VERIFIED' }],
  postconditions: [{ id: 'c4', description: 'Polynomial recovered', truthState: 'VERIFIED' }],
  evidence: [{ type: 'TEST', description: 'Polynomial match', required: true }],
  risk: 'LOW',
  requiresRollback: false,
  mutatesState: false
};

// 1. Create & validate valid plan
const validPlan = createJarvisPlan({
  planId: 'plan:valid:1',
  objective: 'Inspect repository and verify NTT transform',
  steps: [validStep1, validStep2],
  authorization: 'DEVELOPER',
  sentinelApprovalRequired: true,
  budget: defaultBudget
});

const val1 = validateJarvisPlan(validPlan);
assert.strictEqual(val1.valid, true);
assert.strictEqual(val1.issues.length, 0);
assert.ok(val1.fingerprint);
console.log('✓ 1. Valid plan creation and validation passed.');

// 2. Deterministic fingerprinting test (identical canonical plans produce identical hashes)
const planA = createJarvisPlan({
  planId: 'plan:canon:1',
  objective: 'Canonical test',
  steps: [validStep1],
  authorization: 'DEVELOPER',
  sentinelApprovalRequired: true,
  budget: defaultBudget
});

const planB = createJarvisPlan({
  planId: 'plan:canon:1',
  objective: 'Canonical test',
  steps: [validStep1],
  authorization: 'DEVELOPER',
  sentinelApprovalRequired: true,
  budget: defaultBudget
});

assert.strictEqual(fingerprintPlan(planA), fingerprintPlan(planB));
console.log('✓ 2. Deterministic fingerprint consistency passed.');

// 3. Validation: EMPTY_OBJECTIVE
const emptyObjPlan = createJarvisPlan({ ...validPlan, objective: '   ' });
const valEmptyObj = validateJarvisPlan(emptyObjPlan);
assert.strictEqual(valEmptyObj.valid, false);
assert.ok(valEmptyObj.issues.some(i => i.code === 'EMPTY_OBJECTIVE'));
console.log('✓ 3. Empty objective validation passed.');

// 4. Validation: NO_STEPS
const noStepsPlan = createJarvisPlan({ ...validPlan, steps: [] });
const valNoSteps = validateJarvisPlan(noStepsPlan);
assert.strictEqual(valNoSteps.valid, false);
assert.ok(valNoSteps.issues.some(i => i.code === 'NO_STEPS'));
console.log('✓ 4. No steps validation passed.');

// 5. Validation: TOO_MANY_STEPS
const tooManyStepsPlan = createJarvisPlan({
  ...validPlan,
  steps: [validStep1, validStep2, { ...validStep1, id: 'step:3' }],
  budget: { ...defaultBudget, maxSteps: 2 }
});
const valTooMany = validateJarvisPlan(tooManyStepsPlan);
assert.strictEqual(valTooMany.valid, false);
assert.ok(valTooMany.issues.some(i => i.code === 'TOO_MANY_STEPS'));
console.log('✓ 5. Too many steps budget validation passed.');

// 6. Validation: DUPLICATE_STEP_ID
const dupStepPlan = createJarvisPlan({
  ...validPlan,
  steps: [validStep1, { ...validStep2, id: 'step:1' }]
});
const valDup = validateJarvisPlan(dupStepPlan);
assert.strictEqual(valDup.valid, false);
assert.ok(valDup.issues.some(i => i.code === 'DUPLICATE_STEP_ID'));
console.log('✓ 6. Duplicate step ID validation passed.');

// 7. Validation: SELF_DEPENDENCY
const selfDepStep: JarvisPlanStep = { ...validStep1, id: 'step:self', dependsOn: ['step:1', 'step:self'] };
const selfDepPlan = createJarvisPlan({ ...validPlan, steps: [validStep1, selfDepStep] });
const valSelfDep = validateJarvisPlan(selfDepPlan);
assert.strictEqual(valSelfDep.valid, false);
assert.ok(valSelfDep.issues.some(i => i.code === 'SELF_DEPENDENCY'));
console.log('✓ 7. Self dependency validation passed.');

// 8. Validation: DEPENDENCY_CYCLE
const stepA: JarvisPlanStep = { ...validStep1, id: 'step:A', dependsOn: ['step:B'] };
const stepB: JarvisPlanStep = { ...validStep2, id: 'step:B', dependsOn: ['step:A'] };
const cyclePlan = createJarvisPlan({ ...validPlan, steps: [stepA, stepB] });
const valCycle = validateJarvisPlan(cyclePlan);
assert.strictEqual(valCycle.valid, false);
assert.ok(valCycle.issues.some(i => i.code === 'DEPENDENCY_CYCLE'));
console.log('✓ 8. Dependency cycle validation passed.');

// 9. Validation: MUTATION_WITHOUT_AUTH
const mutatingStep: JarvisPlanStep = {
  ...validStep1,
  id: 'step:mut',
  mutatesState: true,
  capabilities: [{ id: 'file.write', authorization: 'DEVELOPER', sentinelApprovalRequired: true }]
};
const unauthMutPlan = createJarvisPlan({ ...validPlan, authorization: 'PUBLIC', steps: [mutatingStep] });
const valUnauthMut = validateJarvisPlan(unauthMutPlan);
assert.strictEqual(valUnauthMut.valid, false);
assert.ok(valUnauthMut.issues.some(i => i.code === 'MUTATION_WITHOUT_AUTH'));
console.log('✓ 9. Mutation without proper authorization validation passed.');

// 10. Validation: UNKNOWN_REQUIRED_PRECONDITION
const unknownPreStep: JarvisPlanStep = {
  ...validStep1,
  id: 'step:unk',
  preconditions: [{ id: 'c10', description: 'Unchecked condition', truthState: 'UNKNOWN' }]
};
const unkPrePlan = createJarvisPlan({ ...validPlan, steps: [unknownPreStep] });
const valUnkPre = validateJarvisPlan(unkPrePlan);
assert.strictEqual(valUnkPre.valid, false);
assert.ok(valUnkPre.issues.some(i => i.code === 'UNKNOWN_REQUIRED_PRECONDITION'));
console.log('✓ 10. UNKNOWN required precondition validation passed.');

// 11. Topological Execution Order
const orderedSteps = getExecutionOrder(validPlan);
assert.strictEqual(orderedSteps.length, 2);
assert.strictEqual(orderedSteps[0].id, 'step:1');
assert.strictEqual(orderedSteps[1].id, 'step:2');
console.log('✓ 11. Topological execution ordering passed.');

// 12. Sentinel Plan Envelope Generation
const envelope = createSentinelPlanEnvelope(validPlan);
assert.strictEqual(envelope.planId, 'plan:valid:1');
assert.strictEqual(envelope.authorization, 'DEVELOPER');
assert.strictEqual(envelope.sentinelApprovalRequired, true);
assert.deepStrictEqual(envelope.requiredCapabilities, ['ntt.transform', 'repository.inspect']);
console.log('✓ 12. Sentinel plan envelope generation passed.');

console.log('✓ ALL JARVIS PLAN ENGINE SCENARIOS PASSED CLEANLY.');
