import assert from 'assert';
import { JarvisWorldModel } from '../src/lib/jarvis-world-model';
import { JarvisEvidenceEngine } from '../src/lib/jarvis-evidence-engine';

console.log('----------------------------------------------------');
console.log('RUNNING JARVIS EVIDENCE ENGINE (FILE 3) TEST SUITE');
console.log('----------------------------------------------------');

const wm = new JarvisWorldModel();
const ee = new JarvisEvidenceEngine(wm);

// 1. Evaluate Claim when no facts match -> UNKNOWN
const unkAssessment = ee.evaluateClaim({
  claim: {
    id: 'claim:test:1',
    subject: 'quantum_core',
    predicate: 'status',
    value: 'ONLINE',
    truthState: 'HYPOTHESIZED',
    evidence: [],
    createdAt: new Date().toISOString()
  }
});

assert.strictEqual(unkAssessment.assessment, 'UNKNOWN');
assert.strictEqual(unkAssessment.truthState, 'UNKNOWN');
assert.strictEqual(unkAssessment.evidenceStrength, 'NONE');
assert.strictEqual(unkAssessment.confidence, 0);

// 2. Assert Fact and evaluate claim -> SUPPORTED
wm.assertFact({
  id: 'fact:test:1',
  subjectId: 'ntt_kernel',
  attribute: 'modulus',
  value: 12289,
  truthState: 'VERIFIED',
  evidence: [{
    id: 'evid:ntt:math',
    sourceType: 'tool',
    description: 'Exact polynomial recovery verified via finite field transform.',
    truthState: 'VERIFIED',
    observedAt: new Date().toISOString()
  }],
  sourceObservationIds: [],
  firstObservedAt: new Date().toISOString()
});

const supportedAssessment = ee.evaluateClaim({
  claim: {
    id: 'claim:test:2',
    subject: 'ntt_kernel',
    predicate: 'modulus',
    value: 12289,
    truthState: 'VERIFIED',
    evidence: [],
    createdAt: new Date().toISOString()
  }
});

assert.strictEqual(supportedAssessment.assessment, 'SUPPORTED');
assert.strictEqual(supportedAssessment.truthState, 'VERIFIED');
assert.strictEqual(supportedAssessment.evidenceStrength, 'DECISIVE');
assert.strictEqual(supportedAssessment.confidence, 1);

// 3. Satisfy Requirements Test
const satisfied = ee.satisfyRequirements(supportedAssessment, [{
  id: 'req:1',
  description: 'Must have VERIFIED truth state and DECISIVE evidence strength',
  required: true,
  minimumTruthState: 'VERIFIED',
  minimumEvidenceStrength: 'DECISIVE'
}]);
assert.strictEqual(satisfied, true);

// 4. Inference Rule Test
const infResult = ee.evaluateInference({
  id: 'rule:ntt_validity',
  description: 'If ntt_kernel.modulus is 12289 with VERIFIED state, infer NTT acceleration available.',
  premises: [{
    id: 'premise:1',
    subject: 'ntt_kernel',
    predicate: 'modulus',
    object: 12289,
    truthState: 'VERIFIED',
    evidence: []
  }],
  conclusion: {
    id: 'conclusion:1',
    subject: 'jarvis_platform',
    predicate: 'ntt_accelerated',
    object: true,
    truthState: 'INFERRED',
    evidence: []
  }
});

assert.strictEqual(infResult.applied, true);
assert.strictEqual(infResult.conclusion?.truthState, 'INFERRED');

// 5. Epistemic Summary Test
const summary = ee.summarize();
assert.strictEqual(summary.verified, 1);

// 6. Construct Conclusion Test
const reasoningConclusion = ee.constructConclusion(supportedAssessment, 'NTT kernel operation is mathematically verified.');
assert.strictEqual(reasoningConclusion.truthState, 'VERIFIED');
assert.strictEqual(reasoningConclusion.requiresVerification, false);

console.log('✓ JARVIS EVIDENCE ENGINE ALL TESTS PASSED CLEANLY.');
