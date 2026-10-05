import assert from 'assert';
import { JarvisWorldModel } from '../src/lib/jarvis-world-model';

console.log('----------------------------------------------------');
console.log('RUNNING JARVIS WORLD MODEL (FILE 2) UNIT TEST SUITE');
console.log('----------------------------------------------------');

const wm = new JarvisWorldModel();
assert.strictEqual(wm.getVersion(), 0);

// 1. Entity Management
wm.upsertEntity({
  id: 'ent:repo:nexorian-portal',
  type: 'repository',
  properties: { name: 'Nexorian_Global_Engineering_Corp', status: 'ACTIVE' },
  truthState: 'VERIFIED',
  evidence: [{
    id: 'evid:repo:1',
    sourceType: 'filesystem',
    description: 'Repository root directory exists on disk.',
    truthState: 'VERIFIED',
    observedAt: new Date().toISOString()
  }]
});

assert.strictEqual(wm.getVersion(), 1);
const ent = wm.getEntity('ent:repo:nexorian-portal');
assert.ok(ent);
assert.strictEqual(ent.properties.name, 'Nexorian_Global_Engineering_Corp');

// 2. Observation Recording
wm.recordObservation({
  id: 'obs:pqc:1',
  timestamp: new Date().toISOString(),
  source: 'pqc-kernel',
  subjectId: 'pqc_subsystem',
  attribute: 'algorithm',
  value: 'EXPERIMENTAL-LATTICE-DSA',
  truthState: 'EXPERIMENTAL',
  evidence: [],
  confidence: 1
});

const obs = wm.getObservation('obs:pqc:1');
assert.ok(obs);
assert.strictEqual(obs.value, 'EXPERIMENTAL-LATTICE-DSA');

// 3. Fact Assertion & Truth State Inspection
wm.assertFact({
  id: 'fact:ntt:1',
  subjectId: 'ntt_kernel',
  attribute: 'modulus',
  value: 12289,
  truthState: 'VERIFIED',
  evidence: [{
    id: 'evid:ntt:1',
    sourceType: 'tool',
    description: 'NTT transform test verified INNTT(NTT(poly)) === poly',
    truthState: 'VERIFIED',
    observedAt: new Date().toISOString()
  }],
  sourceObservationIds: [],
  firstObservedAt: new Date().toISOString()
});

assert.strictEqual(wm.getTruthState('ntt_kernel', 'modulus'), 'VERIFIED');
assert.strictEqual(wm.hasVerifiedEvidence('ntt_kernel', 'modulus'), true);

// 4. Conflict Detection Test
wm.assertFact({
  id: 'fact:ntt:2',
  subjectId: 'ntt_kernel',
  attribute: 'modulus',
  value: 65537, // Conflicting value
  truthState: 'FAILED',
  evidence: [],
  sourceObservationIds: [],
  firstObservedAt: new Date().toISOString()
});

assert.strictEqual(wm.hasUnresolvedConflicts(), true);
assert.strictEqual(wm.listConflicts().length, 1);
assert.strictEqual(wm.getTruthState('ntt_kernel', 'modulus'), 'FAILED');

// 5. Ingest Claim
wm.ingestClaim({
  id: 'claim:gov:1',
  subject: 'human_approval_register',
  predicate: 'gate_H1_status',
  value: 'APPROVED',
  truthState: 'VERIFIED',
  evidence: [{
    id: 'evid:gov:1',
    sourceType: 'filesystem',
    description: 'Disk read confirmed HUMAN_APPROVAL_REGISTER.md.',
    truthState: 'VERIFIED',
    observedAt: new Date().toISOString()
  }],
  createdAt: new Date().toISOString()
});

assert.strictEqual(wm.getTruthState('human_approval_register', 'gate_H1_status'), 'VERIFIED');

// 6. Snapshot & Query
const snapshot = wm.snapshot();
assert.ok(snapshot.version > 0);
assert.ok(snapshot.entities.length === 1);
assert.ok(snapshot.facts.length === 3);

const qRes = wm.query({ subjectId: 'human_approval_register' });
assert.strictEqual(qRes.facts.length, 1);
assert.strictEqual(qRes.facts[0].value, 'APPROVED');

console.log('✓ JARVIS WORLD MODEL ALL TESTS PASSED CLEANLY.');
