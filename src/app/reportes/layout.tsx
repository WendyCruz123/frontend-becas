import TopBarShell from '@/components/TopBarShell';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TopBarShell >{children}</TopBarShell>
    </div>
  ) 
}
