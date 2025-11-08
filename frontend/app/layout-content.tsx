'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/navigation/sidebar';

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Pages that should NOT have sidebar
  const authPages = ['/login', '/register'];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    return <div className="h-screen w-screen overflow-auto">{children}</div>;
  }

  return (
    <div className="grid h-screen overflow-hidden" style={{ gridTemplateColumns: '88px 1fr' }}>
      <Sidebar />
      <main className="h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

