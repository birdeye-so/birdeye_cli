import type { Metadata } from 'next';
import './page.css';
export const metadata: Metadata = {title: 'Birdeye CLI — On-chain research, from your terminal', description: 'Explore Birdeye CLI skills and workflows for Solana token research, market discovery and wallet intelligence.'};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
