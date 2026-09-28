import React from 'react';

export const metadata = {
  title: 'Nexorian Global Engineering Corp.',
  description: 'Production Web Portal, 3D WebGL Jarvis Entity, and Air-Gapped VDR',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'monospace, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
