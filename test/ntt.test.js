const assert = require('assert');

const Q = 12289;
const OMEGA = 4043; // Primitive 8-th root of unity modulo 12289 (4043^8 mod 12289 = 1)

const power = (a, b, m) => {
  let res = 1;
  a = (a % m + m) % m;
  while (b > 0) {
    if (b % 2 === 1) res = (res * a) % m;
    b = Math.floor(b / 2);
    a = (a * a) % m;
  }
  return res;
};

const modInverse = (n, m) => power(n, m - 2, m);

const forwardNTT = (poly) => {
  const N = poly.length;
  const result = new Array(N).fill(0);

  for (let k = 0; k < N; k++) {
    let sum = 0;
    for (let n = 0; n < N; n++) {
      const factor = power(OMEGA, k * n, Q);
      sum = (sum + poly[n] * factor) % Q;
    }
    result[k] = (sum + Q) % Q;
  }
  return result;
};

const inverseNTT = (nttPoly) => {
  const N = nttPoly.length;
  const result = new Array(N).fill(0);
  const invOmega = modInverse(OMEGA, Q);
  const invN = modInverse(N, Q);

  for (let n = 0; n < N; n++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      const factor = power(invOmega, k * n, Q);
      sum = (sum + nttPoly[k] * factor) % Q;
    }
    result[n] = ((sum % Q) * invN) % Q;
  }
  return result;
};

console.log('Testing NTT Forward and Inverse Mathematical Recovery...');
const inputPoly = [12, 45, 102, 3, 0, 89, 500, 120];
const transformed = forwardNTT(inputPoly);
const recovered = inverseNTT(transformed);

console.log('Input:', inputPoly);
console.log('Transformed:', transformed);
console.log('Recovered:', recovered);

assert.deepStrictEqual(recovered, inputPoly, 'Inverse NTT failed to mathematically recover input polynomial');
console.log('✓ NTT Inverse Transform Test Passed: INNTT(NTT(poly)) === poly');
