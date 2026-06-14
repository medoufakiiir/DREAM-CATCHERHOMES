import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { useApp } from '@/context/AppContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { dark } = useApp()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'bg-ocean-900' : 'bg-white'} transition-colors duration-300`}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
