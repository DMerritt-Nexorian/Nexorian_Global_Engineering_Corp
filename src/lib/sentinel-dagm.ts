import { ProposedStateTransition, SentinelValidationResult } from './types';
import { generateMlDsaKeypair, signMlDsaMessage } from './pqc-kernel';

/**
 * Sentinel-1 Deterministic Autonomous Control Layer
 * Enforces Proof before Trust and Rules before Reasoning.
 */
export class SentinelGuard {
  private static sentinelDsaHandle: string | null = null;
  private static sentinelPubKeyHex: string | null = null;

  /**
   * Initialize Sentinel-1 ML-DSA-87 Cryptographic Signing Identity.
   */
  public static async initializeIdentity(): Promise<void> {
    if (!this.sentinelDsaHandle) {
      const kp = await generateMlDsaKeypair('Category 5 / Sentinel-1 Root');
      this.sentinelDsaHandle = kp.secretKeyHandle;
      this.sentinelPubKeyHex = kp.publicKeyHex;
    }
  }

  /**
   * Validate a proposed state transition against Sentinel-1 deterministic policy.
   */
  public static async validateAction(proposal: ProposedStateTransition): Promise<SentinelValidationResult> {
    await this.initializeIdentity();

    // 1. Role-based Policy Enforcement
    const isFounderAction = proposal.actionType.startsWith('FOUNDER_') || proposal.targetResource.includes('GOVERNANCE');
    if (isFounderAction && proposal.requesterRole !== 'FOUNDER') {
      return {
        authorized: false,
        reason: 'SENTINEL-1 REJECTION: Resource requires authenticated FOUNDER authority (Gate H1/H3 enforced).',
        invariantsSatisfied: false
      };
    }

    // 2. Destructive Invariant Rule
    if (proposal.actionType === 'DELETE_CRITICAL_SYSTEM' || proposal.params?.forceWipe === true) {
      return {
        authorized: false,
        reason: 'SENTINEL-1 REJECTION: Destructive system wipe action strictly prohibited by invariant rule #101.',
        invariantsSatisfied: false
      };
    }

    // 3. Invariant Satisfied -> Generate PQC Authorization Token (ML-DSA-87)
    const payload = `SENTINEL-AUTH:${proposal.actionId}:${proposal.actionType}:${proposal.requesterRole}:${proposal.timestamp}`;
    const sigResult = await signMlDsaMessage(this.sentinelDsaHandle!, payload);

    return {
      authorized: true,
      reason: 'SENTINEL-1 PASSED: State transition satisfies safety invariants, authority bounds, and policy.',
      invariantsSatisfied: true,
      authorizationToken: sigResult.signatureHex,
      signatureAuditId: sigResult.auditId,
      pqcAlgorithm: 'ML-DSA-87'
    };
  }

  /**
   * Get Sentinel-1 Public Key Hex for verification.
   */
  public static getPublicKey(): string | null {
    return this.sentinelPubKeyHex;
  }
}
