import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import NavBar from './components/NavBar'
import Review from './components/Review'
import Blog from './components/Blog' 
import Employee from './components/Employee'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Blog />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/review" element={<Review />} />
        <Route path="/comments" element={<Review />} /> {/* Ruta adicional para redirecciones del Review */}
        <Route path="/empleado" element={<Employee />} />
        <Route path="/employees" element={<Employee />} /> {/* Ruta adicional para redirecciones del Employee */}
      </Routes>
    </Router>
  )
}

export default App
