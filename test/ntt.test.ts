import assert from 'assert';
import { forwardNTT, inverseNTT } from '../src/lib/ntt-kernel';

console.log('Testing NTT Forward and Inverse Mathematical Recovery...');
const inputPoly = [12, 45, 102, 3, 0, 89, 500, 120];
const transformed = forwardNTT(inputPoly);
const recovered = inverseNTT(transformed);

console.log('Input:', inputPoly);
console.log('Transformed:', transformed);
console.log('Recovered:', recovered);

assert.deepStrictEqual(recovered, inputPoly, 'Inverse NTT failed to mathematically recover input polynomial');
console.log('✓ NTT Inverse Transform Test Passed: INNTT(NTT(poly)) === poly');
