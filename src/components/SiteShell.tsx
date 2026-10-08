
import React from "react";
import Link from "next/link";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <nav className="nav">
        <strong>NEXORIAN</strong>
        <Link href="/">Principles</Link>
        <Link href="/products">Registry</Link>
        <Link href="/downloads">Downloads</Link>
        <Link href="/work">Private work</Link>
        <Link href="/acquire">Access</Link>
        <Link href="/demonstrations">Demonstrations</Link>
        <Link href="/jarvis">Jarvis</Link>
        <Link href="/founder">Founder</Link>
      </nav>
      {children}
      <footer className="site">Nexorian Global Engineering Corp is the operating surface. It is not offered for sale or lease.</footer>
    </div>
  );
}
