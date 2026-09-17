import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import TripPage from './pages/TripPage.jsx'
import SampleFormPage from './pages/SampleFormPage.jsx'
import SampleViewPage from './pages/SampleViewPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/trip/:tripId" element={<TripPage />} />
      <Route path="/trip/:tripId/sample/new" element={<SampleFormPage />} />
      <Route path="/trip/:tripId/sample/:sampleId" element={<SampleFormPage />} />
      <Route path="/trip/:tripId/sample/:sampleId/view" element={<SampleViewPage />} />
    </Routes>
  )
}
