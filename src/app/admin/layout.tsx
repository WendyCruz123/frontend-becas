import TopBarShell from '@/components/TopBarShell';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopBarShell>{children}</TopBarShell>;
    </div>
  ) 
}
