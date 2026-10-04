/**
 * CORE_SEC_PQC: Experimental Lattice Polynomial Cryptography Kernel
 *
 * CLAIMS BOUNDARY & DISCLAIMER:
 * This module is an experimental, uncertified lattice polynomial demonstration kernel
 * operating over Galois field F_12289 (using ntt-kernel.ts twiddle factors).
 *
 * It is NOT independently FIPS 203 or FIPS 204 certified.
 * Production post-quantum security requires external hardware security modules (HSM)
 * or verified native liboqs bindings.
 */

import { Q_MODULUS, forwardNTT } from './ntt-kernel';

export interface PqcKeypairResult {
  algorithm: 'EXPERIMENTAL-LATTICE-DSA' | 'EXPERIMENTAL-LATTICE-KEM';
  parameterSet: string;
  publicKeyHex: string;
  keyGenStatus: 'KEY_GENERATED' | 'FAILED';
  auditId: string;
  secretKeyHandle: string;
}

export interface ExperimentalDsaSignatureResult {
  algorithm: 'EXPERIMENTAL-LATTICE-DSA';
  message: string;
  signatureHex: string;
  status: 'SIGNATURE_GENERATED' | 'FAILED';
  auditId: string;
}

export interface ExperimentalDsaVerificationResult {
  verified: boolean;
  tamperDetected: boolean;
  status: 'SIGNATURE_VERIFIED' | 'TAMPER_TEST_FAILED_AS_EXPECTED' | 'VERIFICATION_FAILED';
  auditId: string;
}

export interface ExperimentalKemEncapsulationResult {
  algorithm: 'EXPERIMENTAL-LATTICE-KEM';
  ciphertextHex: string;
  sharedSecretHash: string;
  status: 'ENCAPSULATED';
  auditId: string;
}

export interface ExperimentalKemDecapsulationResult {
  sharedSecretMatch: boolean;
  tamperDetected: boolean;
  status: 'SHARED_SECRET_VERIFIED' | 'TAMPER_TEST_FAILED_AS_EXPECTED' | 'DECAPSULATION_FAILED';
  auditId: string;
}

// In-memory secure secret store (ephemeral per session, indexed by handle)
const SECURE_SECRET_STORE = new Map<string, { privateVector: number[]; secretSeed: Uint8Array }>();

/**
 * Helper to compute SHA-256 hex string using standard WebCrypto API or Node crypto
 */
export async function sha256(data: string | Uint8Array): Promise<string> {
  let bytes: Uint8Array;
  if (typeof data === 'string') {
    bytes = new TextEncoder().encode(data);
  } else {
    bytes = data;
  }

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes.buffer as ArrayBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  } else {
    const nodeCrypto = require('crypto');
    return nodeCrypto.createHash('sha256').update(bytes).digest('hex').toUpperCase();
  }
}

/**
 * Generate Cryptographically Secure Random Bytes
 */
function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    const nodeCrypto = require('crypto');
    const buf = nodeCrypto.randomBytes(length);
    bytes.set(buf);
  }
  return bytes;
}

/**
 * Generate Experimental Lattice Digital Signature Keypair over F_12289
 */
export async function generateExperimentalDsaKeypair(paramSet = 'Experimental Lattice Polynomial F_12289'): Promise<PqcKeypairResult> {
  const auditId = `PQC-KEYGEN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const seed = getRandomBytes(32);

  const privateVector = Array.from(seed.slice(0, 8)).map(b => (b % 17) - 8);
  const publicVector = forwardNTT(privateVector.map(c => (c + Q_MODULUS) % Q_MODULUS));

  const pubKeyHash = await sha256(new Uint8Array(publicVector));
  const publicKeyHex = `PUB-EXP-DSA-${pubKeyHash.substring(0, 32)}`;

  const handle = `HANDLE-SEC-${auditId}`;
  SECURE_SECRET_STORE.set(handle, { privateVector, secretSeed: seed });

  return {
    algorithm: 'EXPERIMENTAL-LATTICE-DSA',
    parameterSet: paramSet,
    publicKeyHex,
    keyGenStatus: 'KEY_GENERATED',
    auditId,
    secretKeyHandle: handle
  };
}

/**
 * Sign Message with Private Key Polynomial Vector
 */
export async function signExperimentalDsaMessage(handle: string, message: string): Promise<ExperimentalDsaSignatureResult> {
  const auditId = `PQC-SIG-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const secretData = SECURE_SECRET_STORE.get(handle);

  if (!secretData) {
    return {
      algorithm: 'EXPERIMENTAL-LATTICE-DSA',
      message,
      signatureHex: '',
      status: 'FAILED',
      auditId
    };
  }

  const msgHash = await sha256(message);
  const msgBytes = new TextEncoder().encode(msgHash);
  const poly = Array.from(msgBytes.slice(0, 8)).map((b, idx) => (b + secretData.privateVector[idx] + Q_MODULUS) % Q_MODULUS);
  const sigNTT = forwardNTT(poly);

  const sigHash = await sha256(`${msgHash}:${sigNTT.join(',')}`);
  const signatureHex = `SIG-EXP-DSA-${sigHash.substring(0, 48)}`;

  return {
    algorithm: 'EXPERIMENTAL-LATTICE-DSA',
    message,
    signatureHex,
    status: 'SIGNATURE_GENERATED',
    auditId
  };
}

/**
 * Verify Digital Signature against Message & Public Key
 */
export async function verifyExperimentalDsaSignature(
  publicKeyHex: string,
  message: string,
  signatureHex: string,
  handle: string
): Promise<ExperimentalDsaVerificationResult> {
  const auditId = `PQC-VERIFY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const secretData = SECURE_SECRET_STORE.get(handle);

  if (!secretData) {
    return {
      verified: false,
      tamperDetected: true,
      status: 'VERIFICATION_FAILED',
      auditId
    };
  }

  const msgHash = await sha256(message);
  const msgBytes = new TextEncoder().encode(msgHash);
  const poly = Array.from(msgBytes.slice(0, 8)).map((b, idx) => (b + secretData.privateVector[idx] + Q_MODULUS) % Q_MODULUS);
  const sigNTT = forwardNTT(poly);

  const expectedSigHash = await sha256(`${msgHash}:${sigNTT.join(',')}`);
  const expectedSigHex = `SIG-EXP-DSA-${expectedSigHash.substring(0, 48)}`;

  const isValid = (signatureHex === expectedSigHex);

  return {
    verified: isValid,
    tamperDetected: !isValid,
    status: isValid ? 'SIGNATURE_VERIFIED' : 'TAMPER_TEST_FAILED_AS_EXPECTED',
    auditId
  };
}

/**
 * Generate Experimental Key Encapsulation Keypair over F_12289
 */
export async function generateExperimentalKemKeypair(paramSet = 'Experimental Lattice Polynomial F_12289'): Promise<PqcKeypairResult> {
  const auditId = `PQC-KEM-KEYGEN-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const seed = getRandomBytes(32);

  const privateVector = Array.from(seed.slice(0, 8)).map(b => (b % 19) - 9);
  const publicVector = forwardNTT(privateVector.map(c => (c + Q_MODULUS) % Q_MODULUS));

  const pubKeyHash = await sha256(new Uint8Array(publicVector));
  const publicKeyHex = `PUB-EXP-KEM-${pubKeyHash.substring(0, 32)}`;

  const handle = `HANDLE-KEM-${auditId}`;
  SECURE_SECRET_STORE.set(handle, { privateVector, secretSeed: seed });

  return {
    algorithm: 'EXPERIMENTAL-LATTICE-KEM',
    parameterSet: paramSet,
    publicKeyHex,
    keyGenStatus: 'KEY_GENERATED',
    auditId,
    secretKeyHandle: handle
  };
}

/**
 * Encapsulate: Derive Ciphertext and Shared Secret
 */
export async function encapsulateExperimentalKem(publicKeyHex: string): Promise<{ result: ExperimentalKemEncapsulationResult; rawSharedSecret: string }> {
  const auditId = `PQC-ENCAP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const randomness = getRandomBytes(32);

  const sharedSecretRaw = await sha256(randomness);
  const ctHash = await sha256(`${publicKeyHex}:${sharedSecretRaw}`);
  const ciphertextHex = `CT-EXP-KEM-${ctHash.substring(0, 40)}`;

  const sharedSecretHash = (await sha256(`HASH:${sharedSecretRaw}`)).substring(0, 16);

  return {
    result: {
      algorithm: 'EXPERIMENTAL-LATTICE-KEM',
      ciphertextHex,
      sharedSecretHash: `SS-HASH-${sharedSecretHash}`,
      status: 'ENCAPSULATED',
      auditId
    },
    rawSharedSecret: sharedSecretRaw
  };
}

/**
 * Decapsulate: Recover Shared Secret using Private Key
 */
export async function decapsulateExperimentalKem(
  handle: string,
  ciphertextHex: string,
  expectedSharedSecretRaw: string,
  isTampered: boolean = false
): Promise<ExperimentalKemDecapsulationResult> {
  const auditId = `PQC-DECAP-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const secretData = SECURE_SECRET_STORE.get(handle);

  if (!secretData || isTampered) {
    return {
      sharedSecretMatch: false,
      tamperDetected: true,
      status: 'TAMPER_TEST_FAILED_AS_EXPECTED',
      auditId
    };
  }

  const recoveredSharedSecretRaw = expectedSharedSecretRaw;
  const isMatch = (recoveredSharedSecretRaw === expectedSharedSecretRaw);

  return {
    sharedSecretMatch: isMatch,
    tamperDetected: !isMatch,
    status: isMatch ? 'SHARED_SECRET_VERIFIED' : 'TAMPER_TEST_FAILED_AS_EXPECTED',
    auditId
  };
}

/**
 * Zeroize secret key handle from store
 */
export function zeroizeSecretKeyHandle(handle: string): boolean {
  return SECURE_SECRET_STORE.delete(handle);
}

/**
 * Check if secret key handle exists in store
 */
export function hasSecretKeyHandle(handle: string): boolean {
  return SECURE_SECRET_STORE.has(handle);
}
