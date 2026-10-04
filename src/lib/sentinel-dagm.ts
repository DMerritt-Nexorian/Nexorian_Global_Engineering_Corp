import { AuthorityRole, AuthorizationDecision, ProposedStateTransition, SentinelValidationResult } from './types';
import { generateExperimentalDsaKeypair, signExperimentalDsaMessage } from './pqc-kernel';

/**
 * Sentinel-1 Deterministic Autonomous Control Layer
 * Enforces Proof before Trust and Rules before Reasoning.
 */
export class SentinelGuard {
  private static sentinelDsaHandle: string | null = null;
  private static sentinelPubKeyHex: string | null = null;

  /**
   * Initialize Sentinel-1 Cryptographic Signing Identity.
   */
  public static async initializeIdentity(): Promise<void> {
    if (!this.sentinelDsaHandle) {
      const kp = await generateExperimentalDsaKeypair('Category 5 / Sentinel-1 Root');
      this.sentinelDsaHandle = kp.secretKeyHandle;
      this.sentinelPubKeyHex = kp.publicKeyHex;
    }
  }

  /**
   * Evaluate authorization for a proposed execution intent against Sentinel-1 deterministic policy.
   * Conforms to JARVIS CORE CONTRACTS (AuthorizationDecision).
   */
  public static async evaluateAuthorization(
    intentId: string,
    actionType: string,
    targetResource: string,
    requesterRole: AuthorityRole
  ): Promise<AuthorizationDecision> {
    await this.initializeIdentity();
    const evaluatedAt = new Date().toISOString();

    // 1. Role-based Policy Enforcement
    const isFounderAction = actionType.startsWith('FOUNDER_') || targetResource.includes('GOVERNANCE');
    if (isFounderAction && requesterRole !== 'FOUNDER') {
      return {
        decision: 'DENIED',
        intentId,
        authorizedRole: requesterRole,
        reason: 'SENTINEL-1 REJECTION: Resource requires authenticated FOUNDER authority (Gate H1/H3 enforced).',
        evaluatedAt,
        evidence: [{
          id: `EVID-SENTINEL-DENY-${Date.now()}`,
          sourceType: 'runtime',
          sourceId: 'SentinelGuard',
          description: 'Role-based policy rejection enforced for non-FOUNDER role.',
          truthState: 'VERIFIED',
          observedAt: evaluatedAt
        }]
      };
    }

    // 2. Destructive Invariant Rule
    if (actionType === 'DELETE_CRITICAL_SYSTEM') {
      return {
        decision: 'DENIED',
        intentId,
        authorizedRole: requesterRole,
        reason: 'SENTINEL-1 REJECTION: Destructive system wipe action strictly prohibited by invariant rule #101.',
        evaluatedAt,
        evidence: [{
          id: `EVID-SENTINEL-WIPE-${Date.now()}`,
          sourceType: 'runtime',
          sourceId: 'SentinelGuard',
          description: 'Destructive system wipe blocked by invariant rule #101.',
          truthState: 'VERIFIED',
          observedAt: evaluatedAt
        }]
      };
    }

    // 3. Invariant Satisfied -> Generate PQC Authorization Token
    const payload = `SENTINEL-AUTH:${intentId}:${actionType}:${requesterRole}:${evaluatedAt}`;
    const sigResult = await signExperimentalDsaMessage(this.sentinelDsaHandle!, payload);

    return {
      decision: 'AUTHORIZED',
      intentId,
      authorizedRole: requesterRole,
      reason: 'SENTINEL-1 PASSED: State transition satisfies safety invariants, authority bounds, and policy.',
      evaluatedAt,
      evidence: [{
        id: sigResult.auditId,
        sourceType: 'tool',
        sourceId: 'EXPERIMENTAL-LATTICE-DSA',
        description: `Authorization signature generated: ${sigResult.signatureHex}`,
        truthState: 'VERIFIED',
        observedAt: evaluatedAt,
        contentHash: sigResult.signatureHex
      }]
    };
  }

  /**
   * Legacy / direct transition validation helper.
   */
  public static async validateAction(proposal: ProposedStateTransition): Promise<SentinelValidationResult> {
    const auth = await this.evaluateAuthorization(
      proposal.actionId,
      proposal.actionType,
      proposal.targetResource,
      proposal.requesterRole
    );

    return {
      authorized: auth.decision === 'AUTHORIZED',
      reason: auth.reason,
      invariantsSatisfied: auth.decision === 'AUTHORIZED',
      authorizationToken: auth.evidence[0]?.contentHash,
      signatureAuditId: auth.evidence[0]?.id,
      pqcAlgorithm: 'EXPERIMENTAL-LATTICE-DSA'
    };
  }

  /**
   * Get Sentinel-1 Public Key Hex for verification.
   */
  public static getPublicKey(): string | null {
    return this.sentinelPubKeyHex;
  }
}
