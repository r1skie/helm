import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { Providers } from '@/app/providers';
import '@/styles/globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'HELM',
  description: 'Control panel for your subscription bot',
};

// Anti-flash: apply the saved theme class before first paint.
const themeScript = `(function(){try{var t=localStorage.getItem('helm:theme');
document.documentElement.classList.add(t==='studio'?'studio':'mono');}catch(e){
document.documentElement.classList.add('mono');}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-base text-content antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
