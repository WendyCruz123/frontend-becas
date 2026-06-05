import Scene3D from '@/components/Scene3D';

export default function Modelado3DPage() {
  return (
    <main style={{ height: '100vh', width: '100vw', position: 'relative', background: '#000' }}>
      <Scene3D selectedOffice={null} />
    </main>
  );
}