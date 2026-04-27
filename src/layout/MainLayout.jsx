import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="w-full pb-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout
