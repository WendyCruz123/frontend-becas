import TopBarShell from '@/components/TopBarShell';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='scrollable-dashboard'>
      <TopBarShell >{children}</TopBarShell>;
    </div>
  ) 
}