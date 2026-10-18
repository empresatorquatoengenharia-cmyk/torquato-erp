import './globals.css';

export const metadata = {
  title: 'Torquato ERP',
  description: 'ERP corporativo - Torquato Engenharia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
