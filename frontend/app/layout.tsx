import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SocketProvider } from '@/contexts/SocketContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { UserStatusProvider } from '@/contexts/UserStatusContext';
import LayoutContent from './layout-content';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickPing - Chat Platform',
  description: 'Chat platform for students and teachers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SocketProvider>
          <SidebarProvider>
            <UserStatusProvider>
              <LayoutContent>{children}</LayoutContent>
            </UserStatusProvider>
          </SidebarProvider>
        </SocketProvider>
      </body>
    </html>
  );
}

