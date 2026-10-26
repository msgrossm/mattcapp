import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ticket FIX — New York traffic ticket help',
  description:
    'Photograph a New York traffic ticket and see the points, the cost range and the assessment, with sources.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
