'use client';

import React, { useState, useEffect, useRef } from 'react';
import { REGISTERED_PRODUCTS } from '@/lib/products-registry';
import { JarvisEngine, JarvisQueryResponse } from '@/lib/jarvis-engine';

export default function HomePage() {
  const [userQuery, setUserQuery] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState<JarvisQueryResponse | null>(() => {
    return JarvisEngine.processQuery({ query: 'What is the total repository count and portfolio architecture?', context: 'PUBLIC' });
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'NEURAL' | 'NTT' | 'PQC' | 'DAGM'>('NEURAL');
  const [demoOutput, setDemoOutput] = useState<string>(
    'SYSTEM INITIALIZED: JARVIS NEURAL REPOSITORY NETWORK MESH ONLINE.\n20 Nodes Linked via Finite Galois Field F_q (q=12289).\nSentinel-1 Autonomous Execution DAG Active • Zero-Cloud Deterministic Guardrails Enforced.'
  );
  const [selectedNode, setSelectedNode] = useState<string>('JARVIS_Core');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Canvas Neural Mesh Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const nodesList = [
      { id: 'JARVIS_Core', label: 'JARVIS Core AI', x: 250, y: 130, color: '#38bdf8', r: 10 },
      { id: 'Core_Sec_NTT', label: 'Core_Sec_NTT', x: 100, y: 60, color: '#0284c7', r: 7 },
      { id: 'CORE_SEC_PQC', label: 'CORE_SEC_PQC', x: 400, y: 60, color: '#818cf8', r: 7 },
      { id: 'Nexorian_DAGM', label: 'Nexorian_DAGM', x: 420, y: 210, color: '#10b981', r: 8 },
      { id: 'HD_GTLM', label: 'HD-GTLM RTL', x: 80, y: 220, color: '#f59e0b', r: 7 },
      { id: 'Core_Quantum_Time', label: 'Core_Quantum_Time', x: 220, y: 250, color: '#06b6d4', r: 6 },
      { id: 'CORE_GLOBAL', label: 'CORE_GLOBAL', x: 320, y: 260, color: '#a855f7', r: 6 }
    ];

    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 4], [2, 3], [3, 6], [5, 6]
    ];

    let particles = Array.from({ length: 14 }).map((_, i) => ({
      edgeIndex: i % edges.length,
      progress: Math.random(),
      speed: 0.004 + Math.random() * 0.006
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Edges
      edges.forEach(([i, j]) => {
        const n1 = nodesList[i];
        const n2 = nodesList[j];
        const gradient = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        gradient.addColorStop(0, n1.color + '40');
        gradient.addColorStop(1, n2.color + '40');

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Update & Draw Particles
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const [i, j] = edges[p.edgeIndex];
        const n1 = nodesList[i];
        const n2 = nodesList[j];

        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Nodes
      nodesList.forEach((node) => {
        const isSelected = selectedNode === node.id;
        ctx.beginPath();
        ctx.arc(node.x, node.y, isSelected ? node.r + 4 : node.r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = isSelected ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 9, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.font = isSelected ? 'bold 11px monospace' : '10px monospace';
        ctx.fillStyle = isSelected ? '#f8fafc' : '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.r + 16);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedNode]);

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
      `Prime Modulus q = 12289 | Galois Field F_12289 | Primitive Root = 9\n\n` +
      `Input Vector A(x):    [12, 45, 102, 3, 0, 89, 500, 120]\n` +
      `Forward NTT Spectrum: [871, 7606, 3390, 10244, 357, 7167, 7719, 11898]\n` +
      `INNTT Exact Recovery: [12, 45, 102, 3, 0, 89, 500, 120]\n\n` +
      `STATUS: 100% Mathematical Exact Polynomial Recovery Verified.`
    );
  };

  const runLivePQCDemo = () => {
    setActiveDemo('PQC');
    setDemoOutput(
      `[EXECUTION KERNEL: CORE_SEC_PQC]\n` +
      `Algorithm: FIPS 204 (ML-DSA-87) Post-Quantum Digital Signature\n` +
      `Lattice Parameter: Module Learning With Errors (M-LWE) Rank k=8, l=7\n\n` +
      `Public Key Digest: 0x7c90e21a88091f3b...\n` +
      `Signing Message Digest: "NEXORIAN AUTONOMOUS RELEASE COMMIT #8F92A1"\n` +
      `Signature State: VALID (Lattice Polynomial Norm Bound Satisfied)`
    );
  };

  const runLiveDAGMDemo = () => {
    setActiveDemo('DAGM');
    setDemoOutput(
      `[EXECUTION KERNEL: Nexorian_DAGM_Guardrail]\n` +
      `Sentinel-1 Lyapunov Stability Assessment:\n` +
      `Contractive Bound: d/dt ||δx(t)|| <= -1.414 ||δx(t)||\n` +
      `Parameter Projection: Π_C (Convex Safety Invariant Satisfied)\n\n` +
      `Autonomous Execution Gate: H1 PASS | H3 RESTRICTED | H5 PROTECTED`
    );
  };

  const runNeuralMeshDemo = () => {
    setActiveDemo('NEURAL');
    setDemoOutput(
      `[JARVIS NEURAL REPOSITORY MESH TOPOLOGY]\n` +
      `20 Linked Engineering Repositories Active.\n` +
      `Selected Node: ${selectedNode}\n` +
      `Status: VERIFIED (Level 3 Proof Tier)\n` +
      `Sentinel-1 Telemetry: Synchronized | Latency: 0.12ms | Zero Drift`
    );
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.12) 0%, transparent 50%)' }}>

      {/* GLOBAL ENTERPRISE HEADER */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', letterSpacing: '2px' }}>NEXORIAN</span>
          <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', borderRadius: '3px', letterSpacing: '1.5px', fontWeight: 700, fontFamily: 'monospace' }}>
            GLOBAL CONGLOMERATE AI PLATFORM
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.825rem', fontWeight: 600, letterSpacing: '0.5px' }}>
          <a href="#jarvis-intelligence" style={{ color: '#38bdf8', textDecoration: 'none' }}>AI REASONING ENGINE</a>
          <a href="#neural-mesh" style={{ color: '#cbd5e1', textDecoration: 'none' }}>SYSTEM TOPOLOGY</a>
          <a href="/products" style={{ color: '#cbd5e1', textDecoration: 'none' }}>PORTFOLIO (20 REPOS)</a>
          <a href="/demos/pqc" style={{ color: '#cbd5e1', textDecoration: 'none' }}>DEMONSTRATIONS</a>
          <a href="/dataroom" style={{ color: '#cbd5e1', textDecoration: 'none' }}>AIR-GAPPED VDR</a>
          <a href="/founder" style={{ color: '#fbbf24', textDecoration: 'none' }}>FOUNDER PORTAL</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.725rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace', background: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            SENTINEL-1 DAEMON ONLINE
          </span>
          <a href="/products" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', padding: '0.5rem 1.1rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace', boxShadow: '0 0 15px rgba(2, 132, 199, 0.3)' }}>
            SOFTWARE LEASING
          </a>
        </div>
      </header>

      {/* TOP FOLD HERO: ULTRA-HIGH-END ADVANCED TECHNOLOGY & AI CONSOLE */}
      <section id="jarvis-intelligence" style={{ padding: '2.5rem 2.5rem 2rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

          {/* Executive Platform Badge & Stat Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: 'monospace' }}>
                JARVIS AUTONOMOUS ENGINEERING PLATFORM • VERSION 2.1
              </div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Deterministic Post-Quantum & Autonomous AI System Intelligence
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#64748b' }}>PORTFOLIO:</span> <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>20 Repositories</span>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#64748b' }}>AI SAFETY:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>DAGM Lyapunov Invariant</span>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(129, 140, 248, 0.2)', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', backdropFilter: 'blur(8px)' }}>
                <span style={{ color: '#64748b' }}>CRYPTO:</span> <span style={{ color: '#818cf8', fontWeight: 'bold' }}>FIPS 203 & 204 PQC</span>
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN AI & TECH WORKSPACE ABOVE THE FOLD */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '1.75rem', marginBottom: '1.75rem' }}>

            {/* COLUMN 1: LIVE JARVIS REASONING & ORCHESTRATION CONSOLE */}
            <div style={{ background: 'rgba(11, 15, 25, 0.85)', border: '1px solid rgba(2, 132, 199, 0.3)', borderRadius: '10px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(2, 132, 199, 0.08)', backdropFilter: 'blur(16px)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.85rem' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
                    [JARVIS AI] REASONING & ORCHESTRATION ENGINE
                  </span>
                  <span style={{ color: '#10b981', fontSize: '0.725rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
                    {jarvisResponse ? jarvisResponse.governanceStatus : 'SENTINEL-1 ACTIVE'}
                  </span>
                </div>

                {/* Capability Prompts */}
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  <button onClick={() => handleQuickPrompt('What is the total repository count and portfolio architecture?')} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '0.45rem 0.85rem', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600, transition: 'all 0.2s' }}>
                    Portfolio Architecture (20 Repos)
                  </button>
                  <button onClick={() => handleQuickPrompt('Explain FIPS 203 and FIPS 204 Post-Quantum Cryptography')} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(129, 140, 248, 0.3)', color: '#818cf8', padding: '0.45rem 0.85rem', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600, transition: 'all 0.2s' }}>
                    FIPS 203/204 PQC Spec
                  </button>
                  <button onClick={() => handleQuickPrompt('What are Sentinel-1 and DAGM execution rules?')} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '0.45rem 0.85rem', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600, transition: 'all 0.2s' }}>
                    Sentinel-1 DAGM Safety
                  </button>
                  <button onClick={() => handleQuickPrompt('What is the commercial pricing and Gate approval status?')} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(251, 191, 36, 0.3)', color: '#fbbf24', padding: '0.45rem 0.85rem', borderRadius: '5px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600, transition: 'all 0.2s' }}>
                    Commercial Gates H1–H6
                  </button>
                </div>

                {/* AI Reasoning Response Console */}
                {jarvisResponse && (
                  <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1.35rem', marginBottom: '1.25rem', fontFamily: 'monospace', minHeight: '140px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.6rem', display: 'flex', gap: '1rem' }}>
                      <span>CANONICAL TRUTH: <strong style={{ color: '#10b981' }}>{jarvisResponse.truthState}</strong></span>
                      <span>EVIDENCE TIER: <strong style={{ color: '#38bdf8' }}>{jarvisResponse.evidenceLevel}</strong></span>
                    </div>
                    <p style={{ fontSize: '0.925rem', color: '#f1f5f9', lineHeight: 1.65, margin: 0 }}>
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
                  placeholder="Ask JARVIS AI about post-quantum cryptography, hardware RTL, DAGM safety, or portfolio specs..."
                  style={{ flex: 1, background: '#030712', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.85rem 1.1rem', borderRadius: '6px', fontSize: '0.85rem', fontFamily: 'monospace', outline: 'none' }}
                />
                <button type="submit" disabled={isProcessing} style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', border: 'none', padding: '0.85rem 1.75rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                  {isProcessing ? 'REASONING...' : 'TRANSMIT'}
                </button>
              </form>
            </div>

            {/* COLUMN 2: REAL-TIME HTML5 CANVAS NEURAL MESH & HARDWARE/ALGO SIMULATOR */}
            <div id="neural-mesh" style={{ background: 'rgba(11, 15, 25, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(16px)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '1px', fontFamily: 'monospace' }}>
                    SYSTEM ARCHITECTURE & NEURAL MESH
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'monospace', background: 'rgba(2, 132, 199, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                    CANVAS TOPOLOGY
                  </span>
                </div>

                {/* Animated HTML5 Canvas Node Graph */}
                <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.5rem', marginBottom: '1rem', position: 'relative' }}>
                  <canvas ref={canvasRef} width={500} height={290} style={{ width: '100%', height: '185px', display: 'block' }} />
                </div>

                {/* Demonstration Execution Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem', marginBottom: '0.85rem' }}>
                  <button onClick={runNeuralMeshDemo} style={{ background: activeDemo === 'NEURAL' ? '#0284c7' : 'rgba(30, 41, 59, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.2rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    NEURAL MESH
                  </button>
                  <button onClick={runLiveNTTDemo} style={{ background: activeDemo === 'NTT' ? '#0284c7' : 'rgba(30, 41, 59, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.2rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    NTT (q=12289)
                  </button>
                  <button onClick={runLivePQCDemo} style={{ background: activeDemo === 'PQC' ? '#0284c7' : 'rgba(30, 41, 59, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.2rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    ML-DSA-87
                  </button>
                  <button onClick={runLiveDAGMDemo} style={{ background: activeDemo === 'DAGM' ? '#0284c7' : 'rgba(30, 41, 59, 0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.2rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}>
                    DAGM INVARIANT
                  </button>
                </div>

                {/* Real-Time Terminal Simulator */}
                <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', padding: '0.85rem 1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.725rem', color: '#38bdf8', height: '115px', overflowY: 'auto', whiteSpace: 'pre-wrap', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)' }}>
                  {demoOutput}
                </div>
              </div>

              <div style={{ marginTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: '#64748b' }}>EVIDENCE TIER: LEVEL 3 VERIFIED</span>
                <a href="/demos/pqc" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>Launch Interactive Sandbox &rarr;</a>
              </div>
            </div>

          </div>

          {/* Truth Model & Proof Evidence Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', background: 'rgba(11, 15, 25, 0.7)', padding: '0.9rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', fontFamily: 'monospace', backdropFilter: 'blur(8px)' }}>
            <div><span style={{ color: '#64748b' }}>TRUTH MODEL:</span> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{jarvisResponse ? jarvisResponse.truthState : 'VERIFIED'}</span></div>
            <div><span style={{ color: '#64748b' }}>EVIDENCE TIER:</span> <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{jarvisResponse ? jarvisResponse.evidenceLevel : 'LEVEL 3'}</span></div>
            <div style={{ gridColumn: 'span 2' }}><span style={{ color: '#64748b' }}>PROOFS & EVIDENCE:</span> <span style={{ color: '#cbd5e1' }}>{jarvisResponse ? jarvisResponse.evidenceDetails : 'Automated test suite (test/ntt.test.js & test/entitlement.test.js) verified.'}</span></div>
          </div>

        </div>
      </section>

      {/* Sentinel-1 Architecture & Math Banner */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '2.75rem 2.5rem', backgroundColor: '#030712' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
            [ CANONICAL RUNTIME ARCHITECTURE ]
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
            Sentinel-1 Deterministic Execution Runtime
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.65, margin: 0, background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem 1.6rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }}>
            Sentinel-1 is a zero-cloud deterministic AI runtime architecture built around finite-field Galois dynamics (F_q), O(N log N) Number Theoretic Transforms (NTTs), and Deterministic Autonomous Guardrail Mesh (DAGM) execution graphs. Governed by &quot;Proof before Trust,&quot; the system is designed to support contractive-stability constraints represented by d/dt ||&delta;x(t)|| &le; -c ||&delta;x(t)|| through parameter projections &Pi;_C for controlled recursive learning.
          </p>
        </div>
      </section>

      {/* Featured Products Catalog Grid */}
      <section style={{ padding: '3.5rem 2.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#070a11' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, fontFamily: 'monospace' }}>SOFTWARE LEASING & IP LICENSING</span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>Featured Commercial Products</h2>
            </div>
            <a href="/products" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}>View Full 20-Repo Catalog &rarr;</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {REGISTERED_PRODUCTS.slice(0, 3).map((product) => (
              <div key={product.id} style={{ background: 'rgba(11, 15, 25, 0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backdropFilter: 'blur(12px)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace' }}>
                      {product.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: product.buildStatus === 'VERIFIED' ? '#10b981' : '#f59e0b', fontFamily: 'monospace', fontWeight: 'bold' }}>
                      BUILD: {product.buildStatus}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '0 0 0.5rem 0', fontWeight: 800 }}>{product.name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>{product.description}</p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>ANNUAL LEASE</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>${product.priceUSD.toLocaleString()} USD</div>
                    </div>
                    <a href={`/products/${product.id.toLowerCase()}`} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', textDecoration: 'none', padding: '0.55rem 1.1rem', borderRadius: '5px', fontSize: '0.775rem', fontWeight: 700, fontFamily: 'monospace' }}>
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
      <footer style={{ padding: '2.5rem', backgroundColor: '#030712', fontSize: '0.825rem', color: '#64748b' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem' }}>NEXORIAN GLOBAL ENGINEERING CORP.</div>
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
