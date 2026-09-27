# JARVIS PQC & Deterministic Runtime Architecture

**Nexorian Corporation / Executive Systems ARCS Group**
**Version 2.1 — JARVIS Post-Quantum Security & Deterministic Runtime Division**
**Author:** Executive Systems ARCS Group (Security Architecture Division)
**Date:** 2026-09-26
**Control Repository:** `Nexorian_Global_Engineering_Corp`

---

## Executive Summary

This architecture specification details the integration of `Core_Sec_NTT` and `CORE_SEC_PQC` as a unified post-quantum security kernel guarding the **JARVIS Autonomous Engineering Platform**. By surrounding probabilistic LLM reasoning with a **Deterministic Autonomous Guardrail Mesh (DAGM)** and a **Proof-before-Trust** execution model, JARVIS enforces strict state-mutation safety, capability-controlled tool execution, and quantum-resistant identity verification.

---

## 1. Unified Security Architecture

```
                                PROBABILISTIC REASONING
                                         │
                                         ▼
                            [ JARVIS Agent Core / LLM ]
                                         │
                                  (Proposed Action)
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DETERMINISTIC CONTROL BOUNDARY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Policy Parser & Guardrail Mesh (DAGM)                                    │
│    - Evaluates action graph: Parse -> Policy Check -> Invariant Validation  │
│ 2. Contractive Safety Kernel                                                │
│    - Parameter Projection (Π_C) ensuring bounded system energy/drift        │
│ 3. Proof-before-Trust Gate                                                  │
│    - State Mutation: PROPOSE -> VALIDATE -> AUTHORIZE -> COMMIT / ROLLBACK │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                                (Validated Intent)
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       POST-QUANTUM SECURITY KERNEL                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ CORE_SEC_PQC (High-Level PQC Protocols)                                     │
│  ├── ML-KEM (FIPS 203) Key Encapsulation (Agent-to-Agent Key Exchange)     │
│  └── ML-DSA (FIPS 204) Digital Signatures (State Transition Certificates)   │
│                                                                             │
│ Core_Sec_NTT (Foundational Arithmetic Engine)                              │
│  └── Constant-Time Finite-Field Number Theoretic Transform (NTT)             │
└─────────────────────────────────────────────────────────────────────────────┘
                                         │
                               (Signed & Verified)
                                         │
                                         ▼
                              [ Execution Environment ]
                            (Tools, IPC, Local Daemon)
```

---

## 2. Core Security Subsystems & Dependency Chain

### 2.1 Core_Sec_NTT (Arithmetic Layer)
- **Role:** High-speed, constant-time polynomial arithmetic engine implementing finite-field operations and Number Theoretic Transforms over prime moduli $q$.
- **Features:** `no_std` Rust/C++ compatibility, constant-time modular reduction, pre-calculated twiddle factor tables, and zero-allocation memory guarantees for embedded and runtime execution.
- **Evidence Level:** `[DOCUMENTED]` (Requires Kani formal verification and timing attack analysis upon remote repo access).

### 2.2 CORE_SEC_PQC (Cryptographic Protocol Layer)
- **Role:** Cryptographic key encapsulation (ML-KEM / FIPS 203) and digital signature scheme (ML-DSA / FIPS 204).
- **Features:** Zeroization of private key memory, constant-time rejection sampling, and structured serialization.
- **Claims Boundary:** Implements algorithms defined in FIPS 203 and FIPS 204. Does **NOT** make claims of formal NIST module certification without third-party laboratory audit records.

---

## 3. Deterministic AI Runtime & Guardrail Mesh

### 3.1 Deterministic Autonomous Guardrail Mesh (DAGM)
The DAGM operates as a gatekeeper between agent intent generation and execution:
1. **Instruction Parsing:** Converts raw LLM output into structured execution nodes.
2. **Policy Evaluation:** Matches action requested against agent capability tokens.
3. **Proof Verification:** Ensures proposed state mutation satisfies safety invariants before granting execution rights.

### 3.2 Proof-before-Trust Model
State mutation is split into discrete stages:
- `PROPOSE`: Agent submits state change vector.
- `VALIDATE`: Deterministic runtime computes invariant check $I(x_{next}) = 0$.
- `AUTHORIZE`: PQC Security Kernel issues short-lived ML-DSA signature token.
- `COMMIT`: State mutation executed.
- `ROLLBACK`: Invariant failure triggers immediate memory restore.

### 3.3 Contractive Safety Kernel & Projection $(\Pi_{\mathcal{C}})$
To prevent LLM drift or infinite looping, state updates $x(t)$ are constrained via a continuous-to-discrete Lyapunov stability condition:
$$\frac{d}{dt}\|\delta x(t)\| \le -c\|\delta x(t)\|$$
The projection operator $\Pi_{\mathcal{C}}(x)$ maps any parameter update back onto the closed convex safety set $\mathcal{C}$, enforcing bounded execution budgets and strict resource ceilings.

---

## 4. Local-First Sentinel Daemon (`sentinel_daemon`)

The `sentinel_daemon` operates as an unprivileged, local socket daemon:
- Binds exclusively to local IPC sockets (`/run/jarvis/sentinel.sock`).
- Enforces payload size limits, caller identity verification, and anti-replay timestamps.
- Provides offline local-first security controls independent of cloud connectivity.
