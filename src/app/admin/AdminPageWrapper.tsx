import dynamic from 'next/dynamic';

const AdminPageContent = dynamic(() => import('./page'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Loading...
    </div>
  )
});

export default function AdminPage() {
  return <AdminPageContent />;
}
