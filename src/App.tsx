import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Registrations from './pages/Registrations'
import Charging from './pages/Charging'
import Map from './pages/Map'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="charging" element={<Charging />} />
          <Route path="map" element={<Map />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
