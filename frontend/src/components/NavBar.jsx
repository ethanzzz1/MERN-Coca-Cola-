import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav className="bg-white border-b-2 border-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-black text-2xl font-bold">
            <Link to="/">TAREA</Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/blog"
              className="text-black text-lg font-medium relative group"
            >
              Blog
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/review"
              className="text-black text-lg font-medium relative group"
            >
              Reviews
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/empleado"
              className="text-black text-lg font-medium relative group"
            >
              Empleados
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Responsive Menu Button (para agregar después si quieres) */}
          {/* <div className="md:hidden">
            <button className="text-black">Menú</button>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
