'use client';
import UserMenu from '@/components/UserMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: '#000' }}>
      <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1000 }}>
        <UserMenu />
      </div>
      {children}
    </div>
  );
}
