'use client';

import React, { useState } from 'react';
import { forwardNTT, inverseNTT, verifyPolynomialRecovery, Q_MODULUS, OMEGA_ROOT } from '@/lib/ntt-kernel';

export default function NTTDemoPage() {
  const [inputPoly, setInputPoly] = useState<number[]>([12, 45, 102, 3, 0, 89, 500, 120]);
  const [nttResult, setNttResult] = useState<number[] | null>(null);
  const [invNttResult, setInvNttResult] = useState<number[] | null>(null);
  const [verificationPassed, setVerificationPassed] = useState<boolean | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);

  const runNTT = () => {
    const forward = forwardNTT(inputPoly, Q_MODULUS, OMEGA_ROOT);
    setNttResult(forward);
    setInvNttResult(null);
    setVerificationPassed(null);
    setAuditId(`NTT-AUDIT-${Date.now()}-${Math.floor(Math.random() * 10000)}`);
  };

  const runInverseNTT = () => {
    if (!nttResult) return;
    const recovered = inverseNTT(nttResult, Q_MODULUS, OMEGA_ROOT);
    setInvNttResult(recovered);

    // Verify recovered polynomial matches original input polynomial
    const matches = verifyPolynomialRecovery(inputPoly, recovered);
    setVerificationPassed(matches);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#38bdf8', fontSize: '1.75rem', margin: 0 }}>LIVE DEMONSTRATION: CORE_SEC_NTT</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Number Theoretic Transform (NTT) Constant-Time Finite-Field Polynomial Arithmetic Engine (q = {Q_MODULUS}, &omega; = {OMEGA_ROOT})
          </p>
        </div>
        <div style={{ padding: '0.4rem 0.8rem', backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: '4px', fontSize: '0.75rem', color: '#10b981' }}>
          VERIFIED GALOIS ARITHMETIC
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Panel: Input & Forward NTT */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>1. Polynomial Coefficient Input (N = 8, Mod q = {Q_MODULUS})</h2>

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
            EXECUTE FORWARD NTT: A(x) &rarr; A_hat(&omega;)
          </button>

          {nttResult && (
            <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
              <p style={{ color: '#10b981', margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 'bold' }}>✓ FORWARD NTT TRANSFORMATION COMPLETE</p>
              <div style={{ color: '#fbbf24', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                <strong>NTT REPRESENTATION:</strong> [{nttResult.join(', ')}]
              </div>
              {auditId && <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.5rem' }}>AUDIT ID: {auditId}</div>}
            </div>
          )}
        </div>

        {/* Right Panel: Inverse NTT & Verification */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>2. Inverse NTT & Exact Mathematical Recovery</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Computes INNTT(A_hat(&omega;)) mod q and verifies original polynomial coefficients are exactly recovered without precision loss.
          </p>

          <button
            disabled={!nttResult}
            onClick={runInverseNTT}
            style={{ backgroundColor: nttResult ? '#10b981' : '#334155', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: nttResult ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
          >
            EXECUTE INVERSE NTT & VERIFY RECOVERY
          </button>

          {invNttResult && (
            <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px' }}>
              <p style={{ color: '#38bdf8', margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 'bold' }}>RECOVERED POLYNOMIAL:</p>
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
