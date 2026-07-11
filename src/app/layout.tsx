import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Horror Stories Platform',
  description: 'Watch and share horror story videos from Indian creators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}
