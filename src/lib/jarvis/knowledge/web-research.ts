export interface WebFetcher {
  fetch(url: string): Promise<{ status: number; contentType: string; text: string; finalUrl: string }>;
}

export class SafeWebResearch {
  constructor(private fetcher: WebFetcher) {}

  async fetch(url: string) {
    const u = new URL(url);
    if (!["https:"].includes(u.protocol)) {
      throw new Error("Only HTTPS URLs are allowed");
    }

    const host = u.hostname.toLowerCase();
    if (
      ["localhost", "127.0.0.1", "0.0.0.0", "::1", "::"].includes(host) ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host)
    ) {
      throw new Error("SSRF Protection: Local and private destinations are blocked");
    }

    return this.fetcher.fetch(u.toString());
  }
}
