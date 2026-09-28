/**
 * CORE_SEC_NTT: Constant-Time Finite-Field Polynomial Arithmetic Engine
 * Prime modulus q = 12289 (Galois Field F_q)
 * Primitive 8-th root of unity omega = 4043 (4043^8 mod 12289 = 1)
 */

export const Q_MODULUS = 12289;
export const OMEGA_ROOT = 4043;

/**
 * Modular exponentiation (a^b mod m)
 */
export const powerMod = (a: number, b: number, m: number = Q_MODULUS): number => {
  let res = 1;
  a = (a % m + m) % m;
  while (b > 0) {
    if (b % 2 === 1) res = (res * a) % m;
    b = Math.floor(b / 2);
    a = (a * a) % m;
  }
  return res;
};

/**
 * Modular multiplicative inverse via Fermat's Little Theorem (a^(p-2) mod p)
 */
export const modInverse = (n: number, m: number = Q_MODULUS): number => {
  return powerMod(n, m - 2, m);
};

/**
 * Forward Number Theoretic Transform (NTT) for N = 8 polynomial
 * Maps polynomial coefficients A(x) -> A_hat(omega) in finite field F_12289
 */
export const forwardNTT = (poly: number[], q: number = Q_MODULUS, omega: number = OMEGA_ROOT): number[] => {
  const N = poly.length;
  const result = new Array(N).fill(0);

  for (let k = 0; k < N; k++) {
    let sum = 0;
    for (let n = 0; n < N; n++) {
      const factor = powerMod(omega, k * n, q);
      sum = (sum + poly[n] * factor) % q;
    }
    result[k] = (sum + q) % q;
  }
  return result;
};

/**
 * Inverse Number Theoretic Transform (INNTT) for N = 8 polynomial
 * Maps A_hat(omega) back to original polynomial coefficients A(x) in finite field F_12289
 */
export const inverseNTT = (nttPoly: number[], q: number = Q_MODULUS, omega: number = OMEGA_ROOT): number[] => {
  const N = nttPoly.length;
  const result = new Array(N).fill(0);
  const invOmega = modInverse(omega, q);
  const invN = modInverse(N, q);

  for (let n = 0; n < N; n++) {
    let sum = 0;
    for (let k = 0; k < N; k++) {
      const factor = powerMod(invOmega, k * n, q);
      sum = (sum + nttPoly[k] * factor) % q;
    }
    result[n] = ((sum % q) * invN) % q;
  }
  return result;
};

/**
 * Verify exact coefficient equality between original and recovered polynomial
 */
export const verifyPolynomialRecovery = (original: number[], recovered: number[]): boolean => {
  if (original.length !== recovered.length) return false;
  return original.every((val, idx) => (val % Q_MODULUS + Q_MODULUS) % Q_MODULUS === (recovered[idx] % Q_MODULUS + Q_MODULUS) % Q_MODULUS);
};

/**
 * Full End-to-End NTT Execution Test
 */
export const executeNTTTransformation = (inputPoly: number[] = [12, 45, 102, 3, 0, 89, 500, 120]) => {
  const forward = forwardNTT(inputPoly);
  const recovered = inverseNTT(forward);
  const isMatch = verifyPolynomialRecovery(inputPoly, recovered);

  return {
    q: Q_MODULUS,
    omega: OMEGA_ROOT,
    input: inputPoly,
    transformed: forward,
    recovered,
    verified: isMatch
  };
};
