
import React from "react";
import Link from "next/link";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <nav className="nav">
        <strong>Nexorian</strong>
        <Link href="/">Home</Link>
        <Link href="/products">Registry</Link>
        <Link href="/jarvis">Jarvis</Link>
        <Link href="/founder">Founder</Link>
      </nav>
      {children}
    </div>
  );
}
