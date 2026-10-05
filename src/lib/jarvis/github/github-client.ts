import { SentinelGuard } from "../../sentinel-dagm";
import { AuthorityRole } from "../../types";

export interface GitHubClient {
  request(path: string, init?: RequestInit, role?: AuthorityRole): Promise<{ status: number; json: any; reason?: string }>;
}

export function githubApi(token?: string): GitHubClient {
  return {
    async request(path: string, init: RequestInit = {}, role: AuthorityRole = 'DEVELOPER') {
      if (!token || token.trim() === '') {
        return {
          status: 401,
          json: { error: 'UNAUTHORIZED: GitHub API token is absent or not configured.' },
          reason: 'GitHub token absent in environment.'
        };
      }

      const isMutation = Boolean(init.method && init.method !== 'GET');
      const actionType = isMutation ? 'GITHUB_MUTATION' : 'GITHUB_READ';
      const auth = await SentinelGuard.evaluateAuthorization(`INT-GH-${Date.now()}`, actionType, path, role);

      if (auth.decision !== 'AUTHORIZED') {
        return {
          status: 403,
          json: { error: `DENIED: ${auth.reason}` },
          reason: auth.reason
        };
      }

      try {
        const r = await fetch(`https://api.github.com${path}`, {
          ...init,
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            ...init.headers
          }
        });
        return { status: r.status, json: await r.json() };
      } catch (err: any) {
        return {
          status: 503,
          json: { error: `UNAVAILABLE: ${err.message}` },
          reason: err.message
        };
      }
    }
  };
}
