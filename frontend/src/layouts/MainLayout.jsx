// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../layouts/Navbar'
import Footer from '../layouts/Footer'
import AuthWrapper from '../features/auth/pages/AuthWrapper'
import { useStateProvider } from '../context/StateContext'

export default function MainLayout() {
  const [{ showLoginModal, showSignupModal },dispatch] = useStateProvider()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? 'login' : 'signup'} />
      )}
    </div>
  )
}
