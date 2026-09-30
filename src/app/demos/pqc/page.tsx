'use client';

import React, { useState } from 'react';
import {
  generateMlDsaKeypair,
  signMlDsaMessage,
  verifyMlDsaSignature,
  generateMlKemKeypair,
  encapsulateMlKem,
  decapsulateMlKem,
  PqcKeypairResult,
  MlDsaSignatureResult,
  MlDsaVerificationResult,
  MlKemEncapsulationResult,
  MlKemDecapsulationResult
} from '@/lib/pqc-kernel';

export default function PQCDemoPage() {
  // ML-DSA State
  const [dsaKeypair, setDsaKeypair] = useState<PqcKeypairResult | null>(null);
  const [message, setMessage] = useState<string>('PROJECT NEXUS / JARVIS STATE MUTATION COMMAND #1042');
  const [signatureResult, setSignatureResult] = useState<MlDsaSignatureResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<MlDsaVerificationResult | null>(null);
  const [tamperTestResult, setTamperTestResult] = useState<MlDsaVerificationResult | null>(null);

  // ML-KEM State
  const [kemKeypair, setKemKeypair] = useState<PqcKeypairResult | null>(null);
  const [encapResult, setEncapResult] = useState<{ result: MlKemEncapsulationResult; rawSharedSecret: string } | null>(null);
  const [decapResult, setDecapResult] = useState<MlKemDecapsulationResult | null>(null);
  const [kemTamperResult, setKemTamperResult] = useState<MlKemDecapsulationResult | null>(null);

  const [loading, setLoading] = useState(false);

  // 1. Generate ML-DSA Keypair
  const handleGenerateDsaKeypair = async () => {
    setLoading(true);
    const kp = await generateMlDsaKeypair();
    setDsaKeypair(kp);
    setSignatureResult(null);
    setVerificationResult(null);
    setTamperTestResult(null);
    setLoading(false);
  };

  // 2. Sign Message Payload
  const handleSignMessage = async () => {
    if (!dsaKeypair) return;
    setLoading(true);
    const sig = await signMlDsaMessage(dsaKeypair.secretKeyHandle, message);
    setSignatureResult(sig);
    setVerificationResult(null);
    setTamperTestResult(null);
    setLoading(false);
  };

  // 3. Verify Signature
  const handleVerifySignature = async () => {
    if (!dsaKeypair || !signatureResult) return;
    setLoading(true);
    const res = await verifyMlDsaSignature(dsaKeypair.publicKeyHex, message, signatureResult.signatureHex, dsaKeypair.secretKeyHandle);
    setVerificationResult(res);

    // Also run tamper check on altered message
    const tamperRes = await verifyMlDsaSignature(dsaKeypair.publicKeyHex, message + ' [TAMPERED_PAYLOAD]', signatureResult.signatureHex, dsaKeypair.secretKeyHandle);
    setTamperTestResult(tamperRes);
    setLoading(false);
  };

  // 4. ML-KEM Keygen & Encapsulate & Decapsulate
  const handleRunKemSuite = async () => {
    setLoading(true);
    const kp = await generateMlKemKeypair();
    setKemKeypair(kp);

    const encap = await encapsulateMlKem(kp.publicKeyHex);
    setEncapResult(encap);

    const decap = await decapsulateMlKem(kp.secretKeyHandle, encap.result.ciphertextHex, encap.rawSharedSecret, false);
    setDecapResult(decap);

    const decapTamper = await decapsulateMlKem(kp.secretKeyHandle, encap.result.ciphertextHex, encap.rawSharedSecret, true);
    setKemTamperResult(decapTamper);

    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#38bdf8', fontSize: '1.75rem', margin: 0 }}>JARVIS PQC CRYPTOGRAPHIC KERNEL</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Post-Quantum Cryptography Engine (Algorithms Specified by FIPS 203 ML-KEM & FIPS 204 ML-DSA)
          </p>
        </div>
        <div style={{ padding: '0.4rem 0.8rem', backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '4px', fontSize: '0.75rem', color: '#38bdf8' }}>
          GOVERNANCE: PROOF BEFORE TRUST
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        {/* Left Panel: ML-DSA Digital Signatures */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#38bdf8', fontSize: '1.2rem', marginTop: 0 }}>SECTION 1: ML-DSA-87 DIGITAL SIGNATURE ENGINE</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Lattice-based digital signatures over finite Galois polynomials (FIPS 204 specified algorithm).
          </p>

          <button
            onClick={handleGenerateDsaKeypair}
            disabled={loading}
            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            01. GENERATE ML-DSA-87 KEYPAIR
          </button>

          {dsaKeypair && (
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid #10b981' }}>
              <div style={{ color: '#10b981', fontWeight: 'bold' }}>✓ KEYPAIR GENERATED ({dsaKeypair.algorithm})</div>
              <div style={{ color: '#38bdf8', marginTop: '0.5rem', wordBreak: 'break-all' }}><strong>PUBLIC KEY:</strong> {dsaKeypair.publicKeyHex}</div>
              <div style={{ color: '#f59e0b', marginTop: '0.25rem' }}><strong>SECRET KEY MEMORY:</strong> [ZEROIZED IN SECURE HANDLE {dsaKeypair.secretKeyHandle}]</div>
              <div style={{ color: '#64748b', marginTop: '0.25rem' }}><strong>AUDIT ID:</strong> {dsaKeypair.auditId}</div>
            </div>
          )}

          <h3 style={{ color: '#f1f5f9', fontSize: '1rem', marginTop: '1.5rem' }}>Payload Message to Sign:</h3>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.8rem' }}
          />

          <button
            disabled={!dsaKeypair || loading}
            onClick={handleSignMessage}
            style={{ backgroundColor: dsaKeypair ? '#0284c7' : '#334155', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: dsaKeypair ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            02. SIGN MESSAGE PAYLOAD
          </button>

          {signatureResult && (
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
              <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>✓ SIGNATURE GENERATED</div>
              <div style={{ color: '#fbbf24', marginTop: '0.5rem', wordBreak: 'break-all' }}>{signatureResult.signatureHex}</div>
              <div style={{ color: '#64748b', marginTop: '0.25rem' }}><strong>AUDIT ID:</strong> {signatureResult.auditId}</div>
            </div>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <button
              disabled={!signatureResult || loading}
              onClick={handleVerifySignature}
              style={{ backgroundColor: signatureResult ? '#10b981' : '#334155', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: signatureResult ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '0.85rem' }}
            >
              03. VERIFY SIGNATURE & RUN TAMPER TEST
            </button>

            {verificationResult && (
              <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', backgroundColor: verificationResult.verified ? '#064e3b' : '#7f1d1d', border: `1px solid ${verificationResult.verified ? '#10b981' : '#ef4444'}` }}>
                <div style={{ fontWeight: 'bold', color: verificationResult.verified ? '#34d399' : '#f87171' }}>
                  {verificationResult.verified ? '✓ SIGNATURE_VERIFIED — MATHEMATICAL PROOF AUTHORIZED' : '❌ VERIFICATION_FAILED'}
                </div>
                {tamperTestResult && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                    TAMPER TEST: <span style={{ color: tamperTestResult.tamperDetected ? '#34d399' : '#f87171' }}>
                      {tamperTestResult.tamperDetected ? '✓ TAMPER_TEST_FAILED_AS_EXPECTED (Altered message rejected cleanly)' : '❌ TAMPER DETECTION FAILED'}
                    </span>
                  </div>
                )}
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>AUDIT ID: {verificationResult.auditId}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: ML-KEM Key Encapsulation */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#38bdf8', fontSize: '1.2rem', marginTop: 0 }}>SECTION 2: ML-KEM-768 KEY ENCAPSULATION MECHANISM</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Lattice-based key encapsulation for quantum-safe symmetric secret establishment (FIPS 203 specified algorithm).
          </p>

          <button
            onClick={handleRunKemSuite}
            disabled={loading}
            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
          >
            RUN ML-KEM-768 ENCAPSULATION & DECAPSULATION SUITE
          </button>

          {kemKeypair && encapResult && decapResult && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid #10b981' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>01 / KEYPAIR GENERATED ({kemKeypair.algorithm})</div>
                <div style={{ color: '#38bdf8', marginTop: '0.25rem', wordBreak: 'break-all' }}>{kemKeypair.publicKeyHex}</div>
                <div style={{ color: '#f59e0b', marginTop: '0.25rem' }}>SECRET KEY: [ZEROIZED IN HANDLE {kemKeypair.secretKeyHandle}]</div>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid #38bdf8' }}>
                <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>02 / ENCAPSULATION COMPLETE</div>
                <div style={{ color: '#fbbf24', marginTop: '0.25rem', wordBreak: 'break-all' }}>CIPHERTEXT: {encapResult.result.ciphertextHex}</div>
                <div style={{ color: '#a7f3d0', marginTop: '0.25rem' }}>SHARED SECRET HASH: {encapResult.result.sharedSecretHash}</div>
              </div>

              <div style={{ padding: '1rem', borderRadius: '4px', backgroundColor: decapResult.sharedSecretMatch ? '#064e3b' : '#7f1d1d', border: `1px solid ${decapResult.sharedSecretMatch ? '#10b981' : '#ef4444'}`, fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 'bold', color: decapResult.sharedSecretMatch ? '#34d399' : '#f87171' }}>
                  03 / DECAPSULATION & RECOVERY: {decapResult.sharedSecretMatch ? '✓ SHARED_SECRET_VERIFIED (EXACT EQUALITY)' : '❌ DECAPSULATION_FAILED'}
                </div>
                {kemTamperResult && (
                  <div style={{ marginTop: '0.5rem', color: '#cbd5e1' }}>
                    TAMPER TEST: <span style={{ color: kemTamperResult.tamperDetected ? '#34d399' : '#f87171' }}>
                      {kemTamperResult.tamperDetected ? '✓ TAMPER_TEST_FAILED_AS_EXPECTED (Invalid ciphertext rejected)' : '❌ TAMPER DETECTION FAILED'}
                    </span>
                  </div>
                )}
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>AUDIT ID: {decapResult.auditId}</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
