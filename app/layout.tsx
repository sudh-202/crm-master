import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import DataLoader from '@/components/DataLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRM Dashboard',
  description: 'Modern CRM system for managing contacts, deals, and tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <Sidebar />
          <div className="pl-64">
            <main className="py-6 px-8">
              <DataLoader>{children}</DataLoader>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
