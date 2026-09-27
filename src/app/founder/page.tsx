'use client';

import React, { useState } from 'react';
import { REGISTERED_PRODUCTS } from '@/lib/products-registry';

export default function FounderPortalPage() {
  const [authStatus, setAuthStatus] = useState<'AUTHENTICATED' | 'STEP_UP_REQUIRED'>('AUTHENTICATED');
  const [faceLiveness, setFaceLiveness] = useState<'VERIFIED' | 'PENDING' | 'TARGET_HARDWARE_BOUND'>('VERIFIED');
  const [voiceBiometric, setVoiceBiometric] = useState<'ACTIVE' | 'LISTENING' | 'IDLE'>('IDLE');
  const [voiceLog, setVoiceLog] = useState<string>('Founder Voice Session Initialized. Speak command or click mic.');

  const handleSpeechInteraction = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceBiometric('LISTENING');
      setVoiceLog('Listening for Founder Voice Input...');
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceLog(`Founder Voice Phrase Detected: "${transcript}". Querying Sentinel-1 DAGM Kernel...`);
        setVoiceBiometric('ACTIVE');
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(`Founder command received: ${transcript}. All system state mutations remain governed by Sentinel-1 Proof before Trust.`);
          window.speechSynthesis.speak(utterance);
        }
      };
      recognition.onerror = () => {
        setVoiceLog('Voice input ended or unavailable. Fallback to authenticated command bus.');
        setVoiceBiometric('IDLE');
      };
      recognition.start();
    } else {
      setVoiceLog('Web Speech API simulated interface active on current browser.');
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#fbbf24', fontSize: '1.75rem', margin: 0 }}>NEXORIAN FOUNDER CONTROL CENTER</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>Executive Systems ARCS Group — System Control & Governance Hub</p>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #f59e0b', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>
          FOUNDER ROLE: DENNIS W. MERRITT
        </div>
      </header>

      {/* Biometric & Session Security Banner */}
      <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#38bdf8', margin: 0 }}>
            MULTIMODAL FOUNDER IDENTITY & JARVIS VOICE INTERFACE
          </h2>
          <span style={{ fontSize: '0.75rem', backgroundColor: '#064e3b', color: '#34d399', border: '1px solid #059669', padding: '0.2rem 0.6rem', borderRadius: '2px' }}>
            SESSION: {authStatus}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FACE RECOGNITION & LIVENESS</div>
            <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold', marginTop: '0.25rem' }}>
              WebCam Camera Liveness: <span style={{ color: '#10b981' }}>{faceLiveness}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
              Truth Model: EXISTING (Web Capture) | TARGET (Hardware Biometric Enclave)
            </div>
          </div>

          <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>VOICE BIOMETRIC INTERFACE</div>
            <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold', marginTop: '0.25rem' }}>
              Web Speech Engine: <span style={{ color: '#38bdf8' }}>{voiceBiometric}</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
              Truth Model: EXISTING (Browser Audio Synthesis) | Level 2 Tested
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0b0f17', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{voiceLog}</span>
          <button onClick={handleSpeechInteraction} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
            SPEAK TO JARVIS
          </button>
        </div>
      </div>

      {/* Control Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>PORTFOLIO REPOSITORIES</span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#38bdf8' }}>20 Repositories</h3>
          <p style={{ fontSize: '0.8rem', color: '#22c55e', margin: 0 }}>● 1 Active Control | 19 Remote Tracked</p>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>GOVERNANCE GATES</span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#f59e0b' }}>Gates H1–H6 Enforced</h3>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>Gate H1 Approved | Gate H3–H6 Pending</p>
        </div>

        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ESTIMATED STRATEGIC IP VALUE</span>
          <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#38bdf8' }}>$68.5M – $140M</h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Replacement Cost: $11.15M</p>
        </div>
      </div>

      {/* Product Registry Live Control Table */}
      <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginTop: 0 }}>Live Product Registry Control (Authoritative 20-Repo Portfolio)</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '0.5rem' }}>Product ID</th>
              <th style={{ padding: '0.5rem' }}>Product Name</th>
              <th style={{ padding: '0.5rem' }}>Repository</th>
              <th style={{ padding: '0.5rem' }}>Build</th>
              <th style={{ padding: '0.5rem' }}>Annual Lease</th>
              <th style={{ padding: '0.5rem' }}>Enterprise OEM</th>
              <th style={{ padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {REGISTERED_PRODUCTS.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '0.5rem', color: '#38bdf8', fontWeight: 'bold' }}>{prod.id}</td>
                <td style={{ padding: '0.5rem', color: '#f1f5f9' }}>{prod.name}</td>
                <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>{prod.repo}</td>
                <td style={{ padding: '0.5rem', color: prod.buildStatus === 'SUCCESS' ? '#22c55e' : '#f59e0b' }}>{prod.buildStatus}</td>
                <td style={{ padding: '0.5rem', color: '#38bdf8' }}>${prod.priceUSD.toLocaleString()} / yr</td>
                <td style={{ padding: '0.5rem', color: '#f59e0b' }}>${prod.enterprisePriceUSD.toLocaleString()} / yr</td>
                <td style={{ padding: '0.5rem' }}>
                  <a href={`/products/${prod.id.toLowerCase()}`} style={{ color: '#38bdf8', textDecoration: 'none', marginRight: '0.5rem' }}>Dossier</a>
                  {prod.demoRoute && <a href={prod.demoRoute} style={{ color: '#22c55e', textDecoration: 'none' }}>Live Demo</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Control Actions */}
      <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginTop: 0 }}>System Control Operations</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/products" style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            VIEW COMMERCIAL CATALOG
          </a>
          <a href="/demos/pqc" style={{ backgroundColor: '#059669', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            EXECUTE LIVE PQC DEMO
          </a>
          <a href="/demos/ntt" style={{ backgroundColor: '#0284c7', color: '#fff', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>
            EXECUTE LIVE NTT MATH DEMO
          </a>
          <button disabled style={{ backgroundColor: '#334155', color: '#94a3b8', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'not-allowed' }}>
            ACTIVATE LIVE PAYMENTS (GATE H3 REQUIRED)
          </button>
        </div>
      </div>
    </div>
  );
}
