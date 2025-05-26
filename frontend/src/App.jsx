import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import NavBar from './components/NavBar'
import Review from './components/Review'
import Blog from './components/Blog' // Asegúrate de tener el componente Blog
import Product from './components/Product' // Asegúrate de tener el componente Producto
import Employee from './components/Employee' // Asegúrate de tener el componente Empleado
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
        <Route path="/producto" element={<Product />} />
        <Route path="/empleado" element={<Employee />} />
      </Routes>
    </Router>
  )
}

export default App
