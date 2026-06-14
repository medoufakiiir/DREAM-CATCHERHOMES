import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Villas from '@/pages/Villas'
import Dining from '@/pages/Dining'
import Amenities from '@/pages/Amenities'
import Gallery from '@/pages/Gallery'
import Location from '@/pages/Location'
import Contact from '@/pages/Contact'
import Booking from '@/pages/Booking'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/villas" element={<Villas />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/location" element={<Location />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  )
}
