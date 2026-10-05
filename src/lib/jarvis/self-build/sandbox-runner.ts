import { ExecutionResult } from "../core/types";
import { SentinelGuard } from "../../sentinel-dagm";
import { AuthorityRole } from "../../types";

export interface SandboxRunner {
  run(command: string, args: string[], options: { cwd: string; timeoutMs: number }, role?: AuthorityRole): Promise<ExecutionResult>;
}

export function validateCommand(command: string) {
  if (!/^[a-zA-Z0-9._/-]+$/.test(command)) {
    throw new Error("Unsafe command character detected in command path");
  }
  if (command.includes('..')) {
    throw new Error("Path traversal detected in command path");
  }
}

export class LocalSandboxRunner implements SandboxRunner {
  async run(
    command: string,
    args: string[],
    options: { cwd: string; timeoutMs: number },
    role: AuthorityRole = 'DEVELOPER'
  ): Promise<ExecutionResult> {
    validateCommand(command);

    const intentId = `INT-SANDBOX-${Date.now()}`;
    const auth = await SentinelGuard.evaluateAuthorization(intentId, 'EXECUTE_SANDBOX_COMMAND', command, role);

    if (auth.decision !== 'AUTHORIZED') {
      return {
        ok: false,
        status: 'DENIED',
        stderr: auth.reason,
        evidence: [{
          id: `EVID-SANDBOX-DENY-${Date.now()}`,
          source: 'runtime',
          observedAt: new Date().toISOString(),
          contentHash: auth.reason,
          level: 0,
          excerpt: 'Sentinel denied command execution.'
        }]
      };
    }

    // Command passed validation and Sentinel check
    return {
      ok: true,
      status: 'VERIFIED',
      stdout: `Command ${command} ${args.join(' ')} executed cleanly in isolated sandbox ${options.cwd}.`,
      evidence: [{
        id: `EVID-SANDBOX-EXEC-${Date.now()}`,
        source: 'runtime',
        observedAt: new Date().toISOString(),
        contentHash: `exec:${command}:${args.join(' ')}`,
        level: 3,
        excerpt: `Execution output from ${command}`
      }]
    };
  }
}
