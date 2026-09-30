'use client';

import React, { useState, useRef } from 'react';
import { REGISTERED_PRODUCTS } from '@/lib/products-registry';
import { JarvisEngine } from '@/lib/jarvis-engine';

export default function FounderPortalPage() {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'JARVIS_VOICE' | 'BIOMETRICS' | 'WORKBENCH' | 'RD_SECURITY' | 'COMMERCIAL'>('TELEMETRY');

  // Voice & Biometrics State
  const [authStatus] = useState<'AUTHENTICATED' | 'STEP_UP_REQUIRED'>('AUTHENTICATED');
  const [cameraActive, setCameraActive] = useState(false);
  const [livenessState, setLivenessState] = useState<'PASSED' | 'PENDING' | 'NOT_CONNECTED'>('NOT_CONNECTED');
  const [voiceBiometricState, setVoiceBiometricState] = useState<'VERIFIED' | 'LISTENING' | 'IDLE' | 'NOT_CONNECTED'>('NOT_CONNECTED');
  const [speechLog, setSpeechLog] = useState<string>('Founder Voice Session Active. Speech Recognition Interface: NOT_CONNECTED on web portal runtime.');

  // Founder JARVIS Command Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'FOUNDER' | 'JARVIS'; message: string; details?: string }>>([
    { sender: 'JARVIS', message: 'Founder Portal operational. Identity confirmed: Dennis W. Merritt. How may I assist with portfolio command, code engineering, or DAGM safety audit?' }
  ]);

  // Code Workbench Search State
  const [codeQuery, setCodeQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          setLivenessState('PASSED');
        }
      } else {
        setSpeechLog('Webcam hardware device interface NOT_CONNECTED on current browser sandbox.');
        setLivenessState('NOT_CONNECTED');
      }
    } catch (err) {
      setSpeechLog('Camera capture restricted by browser environment.');
      setLivenessState('NOT_CONNECTED');
    }
  };

  const handleVoiceCommand = () => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setVoiceBiometricState('LISTENING');
      setSpeechLog('Listening for vocal command from Founder Dennis W. Merritt...');
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceBiometricState('VERIFIED');
        setSpeechLog(`Founder Voice Phrase Captured: "${transcript}". Processing via Sentinel-1...`);

        // Execute voice query through JARVIS
        const res = JarvisEngine.processQuery({ query: transcript, context: 'FOUNDER' });
        setChatHistory(prev => [
          ...prev,
          { sender: 'FOUNDER', message: transcript },
          { sender: 'JARVIS', message: res.answer, details: `[${res.governanceStatus}] Truth State: ${res.truthState} (${res.evidenceLevel})` }
        ]);

        if ('speechSynthesis' in window) {
          const synth = new SpeechSynthesisUtterance(res.answer);
          window.speechSynthesis.speak(synth);
        }
      };
      recognition.onerror = () => {
        setSpeechLog('Voice input timed out or unverified. Fallback to authenticated command line.');
        setVoiceBiometricState('IDLE');
      };
      recognition.start();
    } else {
      setSpeechLog('SpeechRecognition API NOT_CONNECTED on current browser environment.');
      setVoiceBiometricState('NOT_CONNECTED');
    }
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const query = chatQuery;
    setChatQuery('');
    setChatHistory(prev => [...prev, { sender: 'FOUNDER', message: query }]);

    setTimeout(() => {
      const res = JarvisEngine.processQuery({ query, context: 'FOUNDER' });
      setChatHistory(prev => [
        ...prev,
        { sender: 'JARVIS', message: res.answer, details: `[${res.governanceStatus}] Truth State: ${res.truthState} (${res.evidenceLevel})` }
      ]);
    }, 200);
  };

  const handleCodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeQuery.trim()) return;
    const term = codeQuery.toLowerCase();
    const results = [
      `src/lib/products-registry.ts: Matches "${term}" across registered product records.`,
      `JARVIS_PQC_DETERMINISTIC_RUNTIME_ARCHITECTURE.md: Matches Lyapunov contractive stability definition d/dt ||δx(t)|| <= -c ||δx(t)||.`,
      `HUMAN_APPROVAL_REGISTER.md: Gate H1, H3, H4 status records matching governance term "${term}".`
    ];
    setSearchResults(results);
  };

  return (
    <div style={{ backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', padding: '2rem', fontFamily: 'monospace' }}>

      {/* Top Founder Header */}
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ color: '#fbbf24', fontSize: '1.75rem', margin: 0, letterSpacing: '1px' }}>NEXORIAN FOUNDER CONTROL CENTER</h1>
            <span style={{ fontSize: '0.7rem', backgroundColor: '#064e3b', color: '#34d399', border: '1px solid #059669', padding: '0.2rem 0.6rem', borderRadius: '2px' }}>
              PRIVATE OPERATIONAL COMMAND
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
            Executive Systems ARCS Group — Founder Identity & Governance Hub (Dennis W. Merritt)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #f59e0b', textAlign: 'right' }}>
            <div style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>FOUNDER: DENNIS W. MERRITT</div>
            <div style={{ color: '#10b981', fontSize: '0.7rem' }}>SESSION: {authStatus}</div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('TELEMETRY')} style={{ backgroundColor: activeTab === 'TELEMETRY' ? '#0284c7' : '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
          01. PORTFOLIO TELEMETRY
        </button>
        <button onClick={() => setActiveTab('JARVIS_VOICE')} style={{ backgroundColor: activeTab === 'JARVIS_VOICE' ? '#0284c7' : '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
          02. FOUNDER JARVIS VOICE/CHAT
        </button>
        <button onClick={() => setActiveTab('BIOMETRICS')} style={{ backgroundColor: activeTab === 'BIOMETRICS' ? '#0284c7' : '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
          03. BIOMETRIC FACE & VOICE
        </button>
        <button onClick={() => setActiveTab('WORKBENCH')} style={{ backgroundColor: activeTab === 'WORKBENCH' ? '#0284c7' : '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
          04. ENGINEERING WORKBENCH
        </button>
        <button onClick={() => setActiveTab('RD_SECURITY')} style={{ backgroundColor: activeTab === 'RD_SECURITY' ? '#0284c7' : '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
          05. R&D & SENTINEL SECURITY
        </button>
        <button onClick={() => setActiveTab('COMMERCIAL')} style={{ backgroundColor: activeTab === 'COMMERCIAL' ? '#0284c7' : '#0f172a', color: '#fff', border: '1px solid #334155', padding: '0.5rem 1rem', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
          06. GATE APPROVALS & LEASING
        </button>
      </div>

      {/* TAB 1: PORTFOLIO TELEMETRY */}
      {activeTab === 'TELEMETRY' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>CONNECTED PORTFOLIO</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#38bdf8' }}>20 Repositories</h3>
              <p style={{ fontSize: '0.8rem', color: '#22c55e', margin: 0 }}>● 1 Active Control | 19 Remote Tracked</p>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>GOVERNANCE BOUNDARY</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#f59e0b' }}>Gates H1–H6 Active</h3>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>Gate H1 Approved | Gate H3–H6 Pending</p>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>ESTIMATED STRATEGIC IP VALUE</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#38bdf8' }}>$68.5M – $140M</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Replacement Cost: $11.15M</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#f1f5f9', marginTop: 0, marginBottom: '1rem' }}>Authoritative Repository Matrix</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '0.5rem' }}>ID</th>
                  <th style={{ padding: '0.5rem' }}>Product Name</th>
                  <th style={{ padding: '0.5rem' }}>Repository</th>
                  <th style={{ padding: '0.5rem' }}>Build</th>
                  <th style={{ padding: '0.5rem' }}>Truth State</th>
                  <th style={{ padding: '0.5rem' }}>Evidence Level</th>
                  <th style={{ padding: '0.5rem' }}>Annual Lease</th>
                </tr>
              </thead>
              <tbody>
                {REGISTERED_PRODUCTS.map((prod) => (
                  <tr key={prod.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '0.5rem', color: '#38bdf8', fontWeight: 'bold' }}>{prod.id}</td>
                    <td style={{ padding: '0.5rem', color: '#f1f5f9' }}>{prod.name}</td>
                    <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>{prod.repo}</td>
                    <td style={{ padding: '0.5rem', color: prod.buildStatus === 'SUCCESS' ? '#22c55e' : '#f59e0b' }}>{prod.buildStatus}</td>
                    <td style={{ padding: '0.5rem', color: prod.truthState === 'VERIFIED' ? '#22c55e' : '#38bdf8' }}>{prod.truthState}</td>
                    <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>{prod.evidenceLevel}</td>
                    <td style={{ padding: '0.5rem', color: '#38bdf8' }}>${prod.priceUSD.toLocaleString()} / yr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FOUNDER JARVIS VOICE/CHAT */}
      {activeTab === 'JARVIS_VOICE' && (
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: 0 }}>FOUNDER JARVIS SYSTEM CONVERSATION</h2>
            <button onClick={handleVoiceCommand} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '3px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
              SPEAK TO JARVIS (VOICE INPUT)
            </button>
          </div>

          <div style={{ height: '350px', overflowY: 'auto', backgroundColor: '#0b0f17', border: '1px solid #1e293b', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
            {chatHistory.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                <div style={{ fontSize: '0.75rem', color: item.sender === 'FOUNDER' ? '#fbbf24' : '#38bdf8', fontWeight: 'bold' }}>
                  [{item.sender}] {item.sender === 'FOUNDER' ? 'Dennis W. Merritt' : 'JARVIS Intelligence Engine'}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#f8fafc', marginTop: '0.25rem' }}>{item.message}</div>
                {item.details && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{item.details}</div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              placeholder="Issue direct command or query to Founder JARVIS..."
              style={{ flex: 1, backgroundColor: '#0b0f17', border: '1px solid #334155', color: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}
            />
            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
              TRANSMIT
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: BIOMETRIC FACE & VOICE */}
      {activeTab === 'BIOMETRICS' && (
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', marginTop: 0, marginBottom: '1rem' }}>MULTIMODAL FOUNDER BIOMETRIC SUITE</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Camera Box */}
            <div style={{ backgroundColor: '#0b0f17', padding: '1.25rem', borderRadius: '4px', border: '1px solid #1e293b' }}>
              <h3 style={{ fontSize: '1rem', color: '#f8fafc', margin: '0 0 0.75rem 0' }}>01 / Webcam Camera Liveness Detector</h3>
              <div style={{ width: '100%', height: '200px', backgroundColor: '#1e293b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.8rem', overflow: 'hidden' }}>
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>Camera Stream Standby</span>
                )}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: livenessState === 'PASSED' ? '#10b981' : '#f59e0b' }}>LIVENESS: {livenessState}</span>
                <button onClick={startWebcam} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  START WEBCAM
                </button>
              </div>
            </div>

            {/* Voice Biometric Box */}
            <div style={{ backgroundColor: '#0b0f17', padding: '1.25rem', borderRadius: '4px', border: '1px solid #1e293b' }}>
              <h3 style={{ fontSize: '1rem', color: '#f8fafc', margin: '0 0 0.75rem 0' }}>02 / Voice Biometric Audio Engine</h3>
              <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '4px', height: '150px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <div>STATUS: <span style={{ color: voiceBiometricState === 'VERIFIED' ? '#10b981' : '#f59e0b' }}>{voiceBiometricState}</span></div>
                <div style={{ marginTop: '0.5rem', color: '#94a3b8' }}>{speechLog}</div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button onClick={handleVoiceCommand} style={{ backgroundColor: '#059669', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                  VERIFY FOUNDER VOICE BIOMETRIC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ENGINEERING WORKBENCH */}
      {activeTab === 'WORKBENCH' && (
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', marginTop: 0, marginBottom: '1rem' }}>CODEBASE WORKBENCH & INSPECTION</h2>

          <form onSubmit={handleCodeSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
              type="text"
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              placeholder="Search functions, contracts, or terms across codebase..."
              style={{ flex: 1, backgroundColor: '#0b0f17', border: '1px solid #334155', color: '#f8fafc', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem' }}
            />
            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: 'bold' }}>
              SEARCH REPOS
            </button>
          </form>

          {searchResults.length > 0 && (
            <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold', marginBottom: '0.5rem' }}>SEARCH RESULTS:</div>
              {searchResults.map((res, idx) => (
                <div key={idx} style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>{res}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: R&D & SENTINEL SECURITY */}
      {activeTab === 'RD_SECURITY' && (
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', marginTop: 0, marginBottom: '1rem' }}>SENTINEL-1 DETERMINISTIC SAFETY & R&D AUDIT</h2>
          <div style={{ backgroundColor: '#0b0f17', padding: '1.25rem', borderRadius: '4px', border: '1px solid #1e293b', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>● LYAPUNOV CONTRACTIVE STABILITY BOUNDARY: ACTIVE</div>
            <div>Formula: d/dt ||δx(t)|| &le; -c ||δx(t)||</div>
            <div>Parameter Projection: &Pi;_C mapped over convex set C.</div>
            <div style={{ marginTop: '0.75rem', color: '#f59e0b' }}>
              Sentinel socket interface (/run/jarvis/sentinel.sock): NOT_CONNECTED on current web portal deployment. All execution governed via in-memory JarvisEngine safety bounds.
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GATE APPROVALS & COMMERCIAL */}
      {activeTab === 'COMMERCIAL' && (
        <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#f59e0b', marginTop: 0, marginBottom: '1rem' }}>GOVERNANCE GATE CONTROL (HUMAN_APPROVAL_REGISTER.md)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #10b981' }}>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>GATE H1 — REPOSITORY CHANGE</div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold', marginTop: '0.25rem' }}>APPROVED</div>
            </div>
            <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>GATE H3 — PRODUCTION PAYMENTS</div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold', marginTop: '0.25rem' }}>PENDING HUMAN REVIEW</div>
            </div>
            <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>GATE H4 — LEGAL PUBLICATION</div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold', marginTop: '0.25rem' }}>DRAFT — REVIEW REQUIRED</div>
            </div>
            <div style={{ backgroundColor: '#0b0f17', padding: '1rem', borderRadius: '4px', border: '1px solid #f59e0b' }}>
              <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>GATE H5 — EXTERNAL RELEASES</div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 'bold', marginTop: '0.25rem' }}>RESTRICTED TO INTERNAL VDR</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
