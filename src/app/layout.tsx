
import React from "react";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata = {
  title: "Nexorian Global Engineering Corp",
  description: "Operating portal for the Nexorian repository. Not a product catalog for sale."
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
