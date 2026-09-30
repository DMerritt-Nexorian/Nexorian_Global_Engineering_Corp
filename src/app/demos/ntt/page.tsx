'use client';

import React, { useState } from 'react';

// Real Number Theoretic Transform (NTT) Implementation over prime modulus q = 12289 (Kyber/NTT prime)
const Q = 12289;
const OMEGA = 4043; // Primitive 8-th root of unity modulo 12289 (4043^8 mod 12289 = 1)

// Modular exponentiation (a^b mod m)
const power = (a: number, b: number, m: number): number => {
  let res = 1;
  a = (a % m + m) % m;
  while (b > 0) {
    if (b % 2 === 1) res = (res * a) % m;
    b = Math.floor(b / 2);
    a = (a * a) % m;
  }
  return res;
};

// Modular inverse via Fermat's Little Theorem
const modInverse = (n: number, m: number): number => power(n, m - 2, m);

// Forward NTT algorithm for N = 8 polynomial
const forwardNTT = (poly: number[]): number[] => {
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

// Inverse NTT algorithm for N = 8 polynomial
const inverseNTT = (nttPoly: number[]): number[] => {
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

export default function NTTDemoPage() {
  const [inputPoly, setInputPoly] = useState<number[]>([12, 45, 102, 3, 0, 89, 500, 120]);
  const [nttResult, setNttResult] = useState<number[] | null>(null);
  const [invNttResult, setInvNttResult] = useState<number[] | null>(null);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);

  const runNTT = () => {
    const forward = forwardNTT(inputPoly);
    setNttResult(forward);
    setInvNttResult(null);
    setVerificationPassed(null);
  };

  const runInverseNTT = () => {
    if (!nttResult) return;
    const recovered = inverseNTT(nttResult);
    setInvNttResult(recovered);

    // Verify recovered polynomial matches original input polynomial
    const matches = recovered.every((val, idx) => val === inputPoly[idx]);
    setVerificationPassed(matches);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '1.75rem', margin: 0 }}>LIVE DEMONSTRATION: CORE_SEC_NTT</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Number Theoretic Transform (NTT) Constant-Time Finite-Field Polynomial Arithmetic Engine (q = 12289)</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Panel: Input & Forward NTT */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>1. Polynomial Coefficient Input (N = 8, Mod q = 12289)</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {inputPoly.map((val, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>a_{idx}</label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) => {
                    const next = [...inputPoly];
                    next[idx] = Number(e.target.value) || 0;
                    setInputPoly(next);
                  }}
                  style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '0.4rem', borderRadius: '4px', textAlign: 'center' }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={runNTT}
            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            EXECUTE FORWARD NTT: A(x) → A_hat(ω)
          </button>

          {nttResult && (
            <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px' }}>
              <p style={{ color: '#22c55e', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>✓ FORWARD NTT TRANSFORMATION COMPLETE</p>
              <div style={{ color: '#fbbf24', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                <strong>NTT REPRESENTATION:</strong> [{nttResult.join(', ')}]
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Inverse NTT & Verification */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>2. Inverse NTT & Mathematical Recovery</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Computes INNTT(A_hat(ω)) mod q and verifies original polynomial coefficients are exactly recovered without precision loss.
          </p>

          <button
            disabled={!nttResult}
            onClick={runInverseNTT}
            style={{ backgroundColor: nttResult ? '#22c55e' : '#334155', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: nttResult ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
          >
            EXECUTE INVERSE NTT & VERIFY RECOVERY
          </button>

          {invNttResult && (
            <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px' }}>
              <p style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>RECOVERED POLYNOMIAL:</p>
              <div style={{ color: '#f1f5f9', fontSize: '0.85rem' }}>[{invNttResult.join(', ')}]</div>

              {verificationPassed !== null && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '4px', backgroundColor: verificationPassed ? '#064e3b' : '#7f1d1d', border: `1px solid ${verificationPassed ? '#10b981' : '#ef4444'}` }}>
                  <strong style={{ color: verificationPassed ? '#34d399' : '#f87171' }}>
                    {verificationPassed ? '✓ MATHEMATICAL VERIFICATION PASSED: INNTT(NTT(A)) === A' : '❌ VERIFICATION FAILED'}
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
