
import React from "react";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Nexorian",
  description: "Proof before trust. Rules before reasoning. Determinism before autonomy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
