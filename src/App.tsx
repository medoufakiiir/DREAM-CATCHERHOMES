import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'

const Villas = lazy(() => import('@/pages/Villas'))
const Dining = lazy(() => import('@/pages/Dining'))
const Amenities = lazy(() => import('@/pages/Amenities'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Location = lazy(() => import('@/pages/Location'))
const Contact = lazy(() => import('@/pages/Contact'))
const Booking = lazy(() => import('@/pages/Booking'))
const Legal = lazy(() => import('@/pages/Legal'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const AdminApp = lazy(() => import('@/admin/AdminApp'))

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="*" element={<PublicSite />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  )
}

function PublicSite() {
  return (
        <Layout>
          <Suspense fallback={<div className="min-h-screen" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/villas" element={<Villas />} />
              <Route path="/dining" element={<Dining />} />
              <Route path="/amenities" element={<Amenities />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/location" element={<Location />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/privacy" element={<Legal kind="privacy" />} />
              <Route path="/terms" element={<Legal kind="terms" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
  )
}
