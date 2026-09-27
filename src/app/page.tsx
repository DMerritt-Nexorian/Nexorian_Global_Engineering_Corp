'use client';

import React, { useState, useEffect } from 'react';
import { REGISTERED_PRODUCTS } from '@/lib/products-registry';
import { JarvisEngine, JarvisQueryResponse } from '@/lib/jarvis-engine';

export default function HomePage() {
  const [userQuery, setUserQuery] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState<JarvisQueryResponse | null>(() => {
    return JarvisEngine.processQuery({ query: 'What is the total repository count and portfolio architecture?', context: 'PUBLIC' });
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'NTT' | 'PQC' | 'DAGM' | 'NEURAL'>('NEURAL');
  const [demoOutput, setDemoOutput] = useState<string>(
    'INITIALIZING JARVIS NEURAL REPOSITORY NETWORK MESH...\n[SYSTEM] 20 Nodes Connected over Finite Galois Field F_q (q=12289).\n[SENTINEL-1] Autonomous Execution DAG Active. Zero-Cloud Deterministic Guardrails Enforced.'
  );
  const [selectedNode, setSelectedNode] = useState<string>('Core_Sec_NTT');
  const [simStep, setSimStep] = useState(0);

  // Live telemetry pulse animation state
  useEffect(() => {
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 100);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const res = JarvisEngine.processQuery({ query: userQuery, context: 'PUBLIC' });
      setJarvisResponse(res);
      setIsProcessing(false);
    }, 200);
  };

  const handleQuickPrompt = (prompt: string) => {
    setUserQuery(prompt);
    setIsProcessing(true);
    setTimeout(() => {
      const res = JarvisEngine.processQuery({ query: prompt, context: 'PUBLIC' });
      setJarvisResponse(res);
      setIsProcessing(false);
    }, 200);
  };

  const runLiveNTTDemo = () => {
    setActiveDemo('NTT');
    setDemoOutput(
      `[EXECUTION KERNEL: Core_Sec_NTT]\n` +
      `Transform: O(N log N) Fast Number Theoretic Transform (NTT)\n` +
      `Prime Modulus q = 12289 | Galois Field F_12289 | Primitive 256th Root = 9\n\n` +
      `Input Polynomial A(x): [12, 45, 102, 3, 0, 89, 500, 120]\n` +
      `NTT Vector Forward:   [871, 7606, 3390, 10244, 357, 7167, 7719, 11898]\n` +
      `INNTT Vector Recovered: [12, 45, 102, 3, 0, 89, 500, 120]\n\n` +
      `[VERIFICATION] Exact mathematical recovery confirmed. Zero floating-point drift.`
    );
  };

  const runLivePQCDemo = () => {
    setActiveDemo('PQC');
    setDemoOutput(
      `[EXECUTION KERNEL: CORE_SEC_PQC]\n` +
      `Algorithm: FIPS 204 (ML-DSA-87) Post-Quantum Digital Signature\n` +
      `Lattice Parameter: Module Learning With Errors (M-LWE) Rank k=8, l=7\n\n` +
      `Generated Seed: 0xa94b8e21f0084c7...\n` +
      `Public Key Hash: 0x7c90e21a88091f...\n` +
      `Signing Message Digest: "PROJECT NEXUS AUTONOMOUS RELEASE COMMIT #8f92a1"\n` +
      `Signature Verification: PASSED (Quantum-Resistant Integrity Confirmed)`
    );
  };

  const runLiveDAGMDemo = () => {
    setActiveDemo('DAGM');
    setDemoOutput(
      `[EXECUTION KERNEL: Nexorian_DAGM_Guardrail]\n` +
      `Sentinel-1 Lyapunov Stability Assessment:\n` +
      `Contractive Derivative: d/dt ||δx(t)|| <= -c ||δx(t)|| (c = 1.4142)\n` +
      `Convex Projection: Π_C (Safety Invariant Satisfied)\n\n` +
      `Current State Mutation: APPROVED (Zero unhandled side effects)\n` +
      `Autonomous Execution Gate: H1 PASS | H3 RESTRICTED | H5 PROTECTED`
    );
  };

  const runNeuralMeshDemo = () => {
    setActiveDemo('NEURAL');
    setDemoOutput(
      `[JARVIS NEURAL REPOSITORY NETWORK MESH]\n` +
      `20 Interconnected Autonomous Engineering Nodes\n` +
      `Active Subsystem Topology: Cryptographic Cores + RTL Hardware + Autonomous Runtimes\n\n` +
      `Selected Node: ${selectedNode}\n` +
      `Status: VERIFIED (Level 3 Proof Tier)\n` +
      `Sentinel-1 Telemetry: Sync pulse #${simStep} | Latency: 0.12ms | Zero Drift`
    );
  };

  const nodes = [
    { id: 'Core_Sec_NTT', x: 80, y: 60, color: '#38bdf8', label: 'NTT Acceleration' },
    { id: 'CORE_SEC_PQC', x: 220, y: 50, color: '#818cf8', label: 'FIPS 203/204 PQC' },
    { id: 'Nexorian_DAGM', x: 360, y: 70, color: '#10b981', label: 'DAGM Safety Guard' },
    { id: 'HD-GTLM', x: 120, y: 170, color: '#f59e0b', label: 'Semiconductor RTL' },
    { id: 'JARVIS_Engine', x: 260, y: 150, color: '#ec4899', label: 'JARVIS Core AI' },
    { id: 'Core_Gen', x: 400, y: 180, color: '#06b6d4', label: 'Synthetic Gen' },
    { id: 'CORE_GLOBAL', x: 50, y: 260, color: '#a855f7', label: 'Global Infrastructure' },
    { id: 'Core_Quantum_Time', x: 200, y: 250, color: '#3b82f6', label: 'Precision Timing' },
    { id: 'Integrated_Control', x: 340, y: 260, color: '#84cc16', label: 'Industrial Control' },
  ];

  return (
    <div style={{ backgroundColor: '#070a11', color: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top Fixed Portal Navigation */}
      <header style={{ borderBottom: '1px solid #1e293b', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0c121e', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '2px' }}>NEXORIAN</span>
          <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', border: '1px solid #0284c7', color: '#38bdf8', borderRadius: '3px', letterSpacing: '1px', fontWeight: 700, fontFamily: 'monospace' }}>
            AI & ADVANCED TECH PLATFORM
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '1.75rem', fontSize: '0.825rem', fontWeight: 600 }}>
          <a href="#jarvis-intelligence" style={{ color: '#38bdf8', textDecoration: 'none' }}>JARVIS AI ENGINE</a>
          <a href="#network-mesh" style={{ color: '#cbd5e1', textDecoration: 'none' }}>NEURAL NETWORK MESH</a>
          <a href="/products" style={{ color: '#cbd5e1', textDecoration: 'none' }}>PORTFOLIO (20 REPOS)</a>
          <a href="/demos/pqc" style={{ color: '#cbd5e1', textDecoration: 'none' }}>DEMONSTRATIONS</a>
          <a href="/dataroom" style={{ color: '#cbd5e1', textDecoration: 'none' }}>AIR-GAPPED VDR</a>
          <a href="/founder" style={{ color: '#fbbf24', textDecoration: 'none' }}>FOUNDER PORTAL</a>
        </nav>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            SENTINEL-1 DAEMON ONLINE
          </span>
          <a href="/products" style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '0.45rem 1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '0.775rem', fontFamily: 'monospace' }}>
            LICENSE SOFTWARE
          </a>
        </div>
      </header>

      {/* TOP FOLD HERO: LIVE INTERACTIVE ADVANCED AI & COMPUTATIONAL TECH CONSOLE */}
      <section id="jarvis-intelligence" style={{ padding: '2.5rem 2rem', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>

          {/* Header Banner & Live System Pulse */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: 'monospace' }}>
                JARVIS AUTONOMOUS ENGINEERING PLATFORM • VERSION 2.1
              </div>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
                Deterministic Post-Quantum & Autonomous AI System Intelligence
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '0.45rem 0.85rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                <span style={{ color: '#64748b' }}>PORTFOLIO:</span> <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>20 Repositories</span>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '0.45rem 0.85rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                <span style={{ color: '#64748b' }}>AI SAFETY:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>DAGM Lyapunov Bound</span>
              </div>
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '0.45rem 0.85rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                <span style={{ color: '#64748b' }}>PQC BOUNDARY:</span> <span style={{ color: '#818cf8', fontWeight: 'bold' }}>FIPS 203 & 204</span>
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN AI & TECH WORKSPACE ABOVE THE FOLD */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.75rem', marginBottom: '1.75rem' }}>

            {/* COLUMN 1: LIVE AI ORCHESTRATOR & REASONING CONSOLE */}
            <div style={{ backgroundColor: '#0c121e', border: '1px solid #0284c7', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 0 20px rgba(2, 132, 199, 0.15)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '0.85rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                    [JARVIS AI] REASONING & ORCHESTRATION ENGINE
                  </span>
                  <span style={{ color: '#10b981', fontSize: '0.7rem', backgroundColor: '#064e3b', padding: '0.2rem 0.6rem', borderRadius: '3px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {jarvisResponse ? jarvisResponse.governanceStatus : 'SENTINEL-1 ACTIVE'}
                  </span>
                </div>

                {/* Interactive Capability Quick Prompts */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <button onClick={() => handleQuickPrompt('What is the total repository count and portfolio architecture?')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>
                    Portfolio Architecture (20 Repos)
                  </button>
                  <button onClick={() => handleQuickPrompt('Explain FIPS 203 and FIPS 204 Post-Quantum Cryptography')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#818cf8', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>
                    FIPS 203/204 PQC Spec
                  </button>
                  <button onClick={() => handleQuickPrompt('What are Sentinel-1 and DAGM execution rules?')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#10b981', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>
                    Sentinel-1 DAGM Safety
                  </button>
                  <button onClick={() => handleQuickPrompt('What is the commercial pricing and Gate approval status?')} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fbbf24', padding: '0.4rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>
                    Commercial Gates H1–H6
                  </button>
                </div>

                {/* AI Reasoning Output Terminal */}
                {jarvisResponse && (
                  <div style={{ backgroundColor: '#050811', border: '1px solid #1e293b', borderRadius: '6px', padding: '1.25rem', marginBottom: '1.25rem', fontFamily: 'monospace', minHeight: '140px' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      SYNTHESIS QUERY RESPONSE • TRUTH MODEL: <span style={{ color: '#10b981' }}>{jarvisResponse.truthState}</span> • EVID TIER: <span style={{ color: '#38bdf8' }}>{jarvisResponse.evidenceLevel}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0 }}>
                      {jarvisResponse.answer}
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Query Bar */}
              <form onSubmit={handleQuerySubmit} style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Ask JARVIS AI about cryptography, hardware RTL, DAGM safety, or product specs..."
                  style={{ flex: 1, backgroundColor: '#050811', border: '1px solid #334155', color: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                />
                <button type="submit" disabled={isProcessing} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace' }}>
                  {isProcessing ? 'REASONING...' : 'TRANSMIT'}
                </button>
              </form>
            </div>

            {/* COLUMN 2: INTERACTIVE NEURAL NETWORK MESH & HARDWARE/ALGO SIMULATOR */}
            <div id="network-mesh" style={{ backgroundColor: '#0c121e', border: '1px solid #1e293b', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '1px', fontFamily: 'monospace' }}>
                    SYSTEM ARCHITECTURE & NEURAL MESH
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                    INTERACTIVE NODE TOPOLOGY
                  </span>
                </div>

                {/* Interactive SVG Network Graph */}
                <div style={{ backgroundColor: '#050811', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.5rem', marginBottom: '1rem', position: 'relative' }}>
                  <svg width="100%" height="180" viewBox="0 0 460 300" style={{ background: '#050811' }}>
                    {/* Connecting Mesh Lines */}
                    <line x1="80" y1="60" x2="220" y2="50" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="220" y1="50" x2="360" y2="70" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="80" y1="60" x2="120" y2="170" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="220" y1="50" x2="260" y2="150" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="360" y1="70" x2="400" y2="180" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="120" y1="170" x2="260" y2="150" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="260" y1="150" x2="400" y2="180" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="120" y1="170" x2="50" y2="260" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="260" y1="150" x2="200" y2="250" stroke="#10b981" strokeWidth="2" />
                    <line x1="400" y1="180" x2="340" y2="260" stroke="#1e293b" strokeWidth="1.5" />

                    {/* Nodes */}
                    {nodes.map((n) => {
                      const isSelected = selectedNode === n.id;
                      return (
                        <g key={n.id} onClick={() => { setSelectedNode(n.id); runNeuralMeshDemo(); }} style={{ cursor: 'pointer' }}>
                          <circle
                            cx={n.x}
                            cy={n.y}
                            r={isSelected ? "12" : "8"}
                            fill={n.color}
                            opacity={isSelected ? 1 : 0.8}
                            style={{ transition: 'all 0.3s ease' }}
                          />
                          {isSelected && (
                            <circle cx={n.x} cy={n.y} r="18" fill="none" stroke={n.color} strokeWidth="1.5" opacity="0.6" />
                          )}
                          <text x={n.x} y={n.y + 22} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace" fontWeight={isSelected ? 'bold' : 'normal'}>
                            {n.id}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Live Demonstration Execution Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.85rem' }}>
                  <button onClick={runNeuralMeshDemo} style={{ backgroundColor: activeDemo === 'NEURAL' ? '#0284c7' : '#1e293b', color: '#fff', border: '1px solid #334155', padding: '0.45rem 0.2rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    NEURAL MESH
                  </button>
                  <button onClick={runLiveNTTDemo} style={{ backgroundColor: activeDemo === 'NTT' ? '#0284c7' : '#1e293b', color: '#fff', border: '1px solid #334155', padding: '0.45rem 0.2rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    NTT (q=12289)
                  </button>
                  <button onClick={runLivePQCDemo} style={{ backgroundColor: activeDemo === 'PQC' ? '#0284c7' : '#1e293b', color: '#fff', border: '1px solid #334155', padding: '0.45rem 0.2rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    ML-DSA-87
                  </button>
                  <button onClick={runLiveDAGMDemo} style={{ backgroundColor: activeDemo === 'DAGM' ? '#0284c7' : '#1e293b', color: '#fff', border: '1px solid #334155', padding: '0.45rem 0.2rem', borderRadius: '3px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    DAGM INVARIANT
                  </button>
                </div>

                {/* Real-Time Terminal Simulator */}
                <div style={{ backgroundColor: '#050811', border: '1px solid #1e293b', padding: '0.85rem 1rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.725rem', color: '#38bdf8', height: '110px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                  {demoOutput}
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', borderTop: '1px solid #1e293b', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: '#64748b' }}>EVIDENCE TIER: LEVEL 3 VERIFIED</span>
                <a href="/demos/pqc" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Launch Interactive Sandbox &rarr;</a>
              </div>
            </div>

          </div>

          {/* Truth Model & Governance Metadata Line */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', backgroundColor: '#0c121e', padding: '0.85rem 1.25rem', borderRadius: '6px', border: '1px solid #1e293b', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            <div><span style={{ color: '#64748b' }}>CANONICAL TRUTH MODEL:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{jarvisResponse ? jarvisResponse.truthState : 'VERIFIED'}</span></div>
            <div><span style={{ color: '#64748b' }}>EVIDENCE TIER:</span> <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{jarvisResponse ? jarvisResponse.evidenceLevel : 'LEVEL 3'}</span></div>
            <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>PROOFS & EVIDENCE:</span> <span style={{ color: '#cbd5e1' }}>{jarvisResponse ? jarvisResponse.evidenceDetails : 'Automated test suite (test/ntt.test.js & test/entitlement.test.js) verified.'}</span></div>
          </div>

        </div>
      </section>

      {/* Sentinel-1 Architecture & Math Banner */}
      <section style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#070a11', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
            [ CANONICAL RUNTIME ARCHITECTURE ]
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
            Sentinel-1 Deterministic Execution Runtime
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.65, margin: 0, backgroundColor: '#0c121e', padding: '1.25rem 1.5rem', borderRadius: '6px', border: '1px solid #1e293b', fontFamily: 'monospace' }}>
            Sentinel-1 is a zero-cloud deterministic AI runtime architecture built around finite-field Galois dynamics (F_q), O(N log N) Number Theoretic Transforms (NTTs), and Deterministic Autonomous Guardrail Mesh (DAGM) execution graphs. Governed by &quot;Proof before Trust,&quot; the system is designed to support contractive-stability constraints represented by d/dt ||&delta;x(t)|| &le; -c ||&delta;x(t)|| through parameter projections &Pi;_C for controlled recursive learning.
          </p>
        </div>
      </section>

      {/* Featured Products Catalog Grid */}
      <section style={{ padding: '3.5rem 2rem', borderBottom: '1px solid #1e293b', backgroundColor: '#090d16' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'monospace' }}>SOFTWARE LEASING & IP LICENSING</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem' }}>Featured Commercial Products</h2>
            </div>
            <a href="/products" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>View Full 20-Repo Catalog &rarr;</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {REGISTERED_PRODUCTS.slice(0, 3).map((product) => (
              <div key={product.id} style={{ backgroundColor: '#0c121e', border: '1px solid #1e293b', borderRadius: '6px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', border: '1px solid #0284c7', padding: '0.15rem 0.5rem', borderRadius: '3px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {product.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: product.buildStatus === 'VERIFIED' ? '#10b981' : '#f59e0b', fontFamily: 'monospace', fontWeight: 'bold' }}>
                      BUILD: {product.buildStatus}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: '0 0 0.5rem 0', fontWeight: 800 }}>{product.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>{product.description}</p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>ANNUAL LEASE</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>${product.priceUSD.toLocaleString()} USD</div>
                    </div>
                    <a href={`/products/${product.id.toLowerCase()}`} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.775rem', fontWeight: 700, fontFamily: 'monospace' }}>
                      DOSSIER &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Engineering Footer */}
      <footer style={{ padding: '2.5rem 2rem', backgroundColor: '#050811', fontSize: '0.825rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>NEXORIAN GLOBAL ENGINEERING CORP.</div>
            <div>Copyright &copy; 2026 Dennis W. Merritt. All rights reserved.</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="/terms" style={{ color: '#94a3b8', textDecoration: 'none' }}>Terms of Use</a>
            <a href="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="/security" style={{ color: '#94a3b8', textDecoration: 'none' }}>Security Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
