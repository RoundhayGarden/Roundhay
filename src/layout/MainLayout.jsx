import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/Footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <main className="mx-auto w-full max-w-[1800px] px-4 pb-10 pt-28 sm:px-6 sm:pt-32 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout