import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'INFRA OBSERVATORY - Unified Observability Platform',
  description:
    'Enterprise-grade observability platform for the INFRA ecosystem. Monitor logs, metrics, traces, and alerts across all platforms.',
  keywords: [
    'observability',
    'monitoring',
    'logs',
    'metrics',
    'traces',
    'alerting',
    'INFRA',
    'fintech',
  ],
  authors: [{ name: 'INFRA Group' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
