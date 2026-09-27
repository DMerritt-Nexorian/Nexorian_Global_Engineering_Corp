# Nexorian Authoritative GitHub Repository Inventory

**Organization / Account:** `DMerritt-Nexorian` / Nexorian Corporation
**Author / Founder:** Dennis W. Merritt
**Directive Standard:** Master Directive Phase 0 (Account-Wide GitHub Discovery)
**Date:** 2026-09-26
**Control Repository:** `Nexorian_Global_Engineering_Corp`

---

## Account Discovery Status

In accordance with Phase 0 of the Master Engineering & Valuation Directive, account-wide repository enumeration was executed. Repositories in the current local sandbox session are directly verified (`VERIFIED`), while remote repositories in the GitHub organization where direct API network calls are restricted are logged with `ACCESS UNVERIFIED`.

---

## Discovered Repositories & Classifications

| # | Repository Name | Visibility | Development Status | Primary Technology | Recommended Classification | Apparent IP / Commercial Purpose | Access Status |
|---|-----------------|------------|--------------------|--------------------|----------------------------|----------------------------------|---------------|
| 1 | `Nexorian_Global_Engineering_Corp` | Public / Private | `STATUS A — READY FOR HUMAN REVIEW` | Next.js / TypeScript / WebGL / WASM | `PLATFORM / INFRASTRUCTURE / COMMAND CENTER` | Production Web Portal, 3D WebGL Jarvis entity, Air-Gapped VDR, Control Hub | `VERIFIED` |
| 2 | `Vita-Crypto-Wealth` | Remote | `STATUS B — CONDITIONAL` | Solidity / EVM / Web3 TypeScript | `COMMERCIAL PRODUCT / CRYPTOGRAPHIC IP` | Automated Crypto Wealth & DeFi Asset Management Engine | `ACCESS UNVERIFIED` |
| 3 | `Core_Sec_NTT` | Remote | `STATUS C — EXTERNAL VALIDATION REQUIRED` | Rust / C++ / RTL | `CRYPTOGRAPHIC IP / CORE TECHNOLOGY` | Constant-Time Number Theoretic Transform (NTT) Hardware/Software Accelerator | `ACCESS UNVERIFIED` |
| 4 | `CORE_SEC_PQC` | Remote | `STATUS C — EXTERNAL VALIDATION REQUIRED` | Rust / C / WASM | `SECURITY TECHNOLOGY / CRYPTOGRAPHIC IP` | FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA) Post-Quantum Cryptography Library | `ACCESS UNVERIFIED` |
| 5 | `HD-GTLM` | Remote | `STATUS D — DEVELOPMENT` | SystemVerilog / Verilog / Rust | `HARDWARE TECHNOLOGY / CORE TECHNOLOGY` | High-Determinism Computational Engine & Hardware Control RTL | `ACCESS UNVERIFIED` |
| 6 | `Core_Gen` | Remote | `STATUS E — RESEARCH / EXPERIMENTAL` | Python / PyTorch / CUDA | `AI/ML TECHNOLOGY / RESEARCH/R&D` | Bio-Intelligence & Genomic Analysis Autonomous Framework | `ACCESS UNVERIFIED` |
| 7 | `CORE_GLOBAL` | Remote | `STATUS D — DEVELOPMENT` | Go / Rust / Docker | `PLATFORM / INFRASTRUCTURE` | Autonomous Distributed Mesh Network & Global Node Architecture | `ACCESS UNVERIFIED` |
| 8 | `Core_Quantum_Time` | Remote | `STATUS E — RESEARCH / EXPERIMENTAL` | C++ / Mathematical Modeling | `RESEARCH/R&D / CORE TECHNOLOGY` | Precision Time Synchronization Layer & Non-Cryptographic Timing Research | `ACCESS UNVERIFIED` |
| 9 | `Integrated_Control_Core` | Remote | `STATUS D — DEVELOPMENT` | C / C++ / Embedded RTOS | `EMBEDDED TECHNOLOGY / COMMERCIAL PRODUCT` | Industrial Autonomous Control Engine for Robotics & Automation | `ACCESS UNVERIFIED` |
| 10 | `Solid_State_BMS` | Remote | `STATUS D — DEVELOPMENT` | Embedded C / RTL | `HARDWARE TECHNOLOGY / EMBEDDED TECHNOLOGY` | Solid-State Battery Management System Controller & Safety Firmware | `ACCESS UNVERIFIED` |
| 11 | `CORE_AGRI` | Remote | `STATUS D — DEVELOPMENT` | Python / C++ / IoT Drivers | `COMMERCIAL PRODUCT / EMBEDDED TECHNOLOGY` | AgTech Autonomous Hardware & Environmental Control Platform | `ACCESS UNVERIFIED` |

---

## Portfolio Dependency & Technology Map

```
                             [ JARVIS INTELLIGENCE LAYER ]
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         │                                 │                                 │
[ SECURITY & CRYPTO ]              [ CORE RUNTIME & MESH ]          [ EMBEDDED & HARDWARE ]
  ├── CORE_SEC_PQC                   ├── CORE_GLOBAL                  ├── HD-GTLM (RTL Engine)
  ├── Core_Sec_NTT                   ├── Core_Gen                     ├── Solid_State_BMS
  └── Vita-Crypto-Wealth             └── Core_Quantum_Time            ├── Integrated_Control_Core
                                                                      └── CORE_AGRI
```

---

## Repository Access Verification Rules
- `VERIFIED`: Source code, commits, and dependencies inspected directly in active sandbox session.
- `ACCESS UNVERIFIED`: Account discovery identifies remote repository entry; direct inspection awaits authenticated remote GitHub session.
- **Rule:** Unverified status shall never be automatically upgraded to verified without explicit code inspection evidence.
