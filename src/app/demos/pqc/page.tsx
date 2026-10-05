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

interface EncapState {
  result: MlKemEncapsulationResult;
  rawSharedSecret: string;
}

export default function PQCDemoPage() {
  // ML-DSA State
  const [dsaKeypair, setDsaKeypair] = useState<PqcKeypairResult | null>(null);
  const [message, setMessage] = useState<string>('PROJECT NEXUS / JARVIS STATE MUTATION COMMAND #1042');
  const [signatureResult, setSignatureResult] = useState<MlDsaSignatureResult | null>(null);
  const [verificationResult, setVerificationResult] = useState<MlDsaVerificationResult | null>(null);
  const [tamperTestResult, setTamperTestResult] = useState<MlDsaVerificationResult | null>(null);

  // ML-KEM State
  const [kemKeypair, setKemKeypair] = useState<PqcKeypairResult | null>(null);
  const [encapResult, setEncapResult] = useState<EncapState | null>(null);
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

  const isDsaValid = Boolean(verificationResult && verificationResult.verified);
  const isDsaTamperFailed = Boolean(tamperTestResult && tamperTestResult.verified);

  const isKemValid = Boolean(decapResult && decapResult.sharedSecretMatch);
  const isKemTamperMatched = Boolean(kemTamperResult && kemTamperResult.sharedSecretMatch);

  const kemTamperStyle = {
    marginTop: '0.5rem',
    color: isKemTamperMatched ? '#f87171' : '#34d399'
  };

  const kemValidStyle = {
    marginTop: '0.5rem',
    color: isKemValid ? '#34d399' : '#f87171'
  };

  const dsaStatusText = isDsaValid ? '✓ VERIFICATION SUCCESSFUL — PROOF AUTHORIZED' : '❌ VERIFICATION FAILED';
  const dsaTamperText = isDsaTamperFailed ? 'FAIL (Tamper undetected)' : 'PASS (Tampered payload correctly rejected)';
  const kemValidText = isKemValid ? 'VERIFIED MATCH' : 'MISMATCH';
  const kemTamperText = isKemTamperMatched ? 'ACCEPTED (Error)' : 'REJECTED (Correct)';

  return (
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ color: '#38bdf8', fontSize: '1.75rem', margin: 0 }}>LIVE DEMONSTRATION: CORE_SEC_PQC</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Post-Quantum Cryptography (FIPS 203 ML-KEM & FIPS 204 ML-DSA Signature Engine)</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Panel: ML-DSA Operations */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>1. ML-DSA Digital Signature Verification</h2>
          <button
            onClick={handleGenerateDsaKeypair}
            disabled={loading}
            style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            GENERATE ML-DSA KEYPAIR
          </button>

          {dsaKeypair && (
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', wordBreak: 'break-all', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px' }}>
              <p style={{ color: '#22c55e', margin: '0 0 0.5rem 0' }}>✓ KEYPAIR GENERATED</p>
              <div style={{ color: '#38bdf8' }}><strong>PUBLIC KEY:</strong> {dsaKeypair.publicKeyHex.slice(0, 48)}...</div>
              <div style={{ color: '#94a3b8', marginTop: '0.5rem' }}><strong>PRIVATE KEY HANDLE:</strong> {dsaKeypair.secretKeyHandle}</div>
            </div>
          )}

          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: '2rem' }}>2. Sign Message Payload</h2>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '4px', marginBottom: '1rem' }}
          />
          <button
            disabled={!dsaKeypair || loading}
            onClick={handleSignMessage}
            style={{ backgroundColor: dsaKeypair ? '#0284c7' : '#334155', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: dsaKeypair ? 'pointer' : 'not-allowed', fontWeight: 'bold' }}
          >
            GENERATE ML-DSA SIGNATURE
          </button>

          {signatureResult && (
            <div style={{ marginTop: '1rem', fontSize: '0.8rem', wordBreak: 'break-all', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px' }}>
              <p style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>✓ SIGNATURE GENERATED</p>
              <div style={{ color: '#f59e0b' }}>{signatureResult.signatureHex.slice(0, 48)}...</div>
            </div>
          )}

          {signatureResult && (
            <button
              onClick={handleVerifySignature}
              disabled={loading}
              style={{ marginTop: '1rem', backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              VERIFY SIGNATURE IN SENTINEL-1
            </button>
          )}

          {verificationResult && (
            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', backgroundColor: isDsaValid ? '#064e3b' : '#7f1d1d', border: `1px solid ${isDsaValid ? '#10b981' : '#ef4444'}` }}>
              <h3 style={{ margin: 0, color: isDsaValid ? '#34d399' : '#f87171' }}>
                {dsaStatusText}
              </h3>
              {tamperTestResult && (
                <p style={{ fontSize: '0.8rem', margin: '0.5rem 0 0 0', color: isDsaTamperFailed ? '#f87171' : '#34d399' }}>
                  Tamper Test Status: {dsaTamperText}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: ML-KEM Operations */}
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '1.2rem', marginTop: 0 }}>3. ML-KEM Key Encapsulation Suite</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Tests FIPS 203 encapsulation, shared secret derivation, and decapsulation integrity.
          </p>

          <button
            onClick={handleRunKemSuite}
            disabled={loading}
            style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            EXECUTE ML-KEM ENCAPSULATION & DECAPSULATION
          </button>

          {kemKeypair && encapResult && decapResult && (
            <div style={{ marginTop: '1.5rem', backgroundColor: '#1e293b', padding: '1rem', borderRadius: '4px', fontSize: '0.8rem' }}>
              <p style={{ color: '#a78bfa', fontWeight: 'bold' }}>✓ ML-KEM EXECUTED</p>
              <div><strong>Ciphertext:</strong> {encapResult.result.ciphertextHex.slice(0, 32)}...</div>
              <div style={kemValidStyle}>
                <strong>Shared Secret Match:</strong> {kemValidText}
              </div>
              {kemTamperResult && (
                <div style={kemTamperStyle}>
                  <strong>Tampered Ciphertext Rejection:</strong> {kemTamperText}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
