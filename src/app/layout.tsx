import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Torquato Engenharia - ERP',
  description: 'Sistema Integrado de Gestão de Engenharia e Obras',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
