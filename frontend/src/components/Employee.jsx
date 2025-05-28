import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Employee = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    birthday: '',
    email: '',
    address: '',
    password: '',
    hireDate: '',
    telephone: '',
    dui: '',
    isVerified: false,
    issnumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);

  // Función para obtener empleados desde el backend
  const fetchEmployees = async () => {
    try {
      console.log('Obteniendo lista de empleados...');
      const response = await fetch('http://localhost:4000/api/employee'); // URL de tu backend
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error('Error fetching employees - backend response:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching employees - network/fetch error:', error);
    }
  };

  // Cargar empleados al montar el componente
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear un nuevo empleado
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormData({
          name: '',
          lastName: '',
          birthday: '',
          email: '',
          address: '',
          password: '',
          hireDate: '',
          telephone: '',
          dui: '',
          isVerified: false,
          issnumber: '',
        });
        fetchEmployees(); // Recarga los empleados
        navigate('/employees');
      } else {
        const errorData = await response.json();
        console.error('Error creating employee - backend response:', errorData);
        alert(`Error al crear empleado: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating employee - network/fetch error:', error);
      alert(`Error al crear empleado: ${error.message}`);
    }
  };

  // Editar un empleado
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      // Asegurarse de que currentEmployeeId es válido y está en el formato correcto
      if (!currentEmployeeId) {
        alert('ID de empleado no válido');
        return;
      }
      
      console.log(`Editando empleado con ID: ${currentEmployeeId}`);
      
      const response = await fetch(`http://localhost:4000/api/employee/${currentEmployeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchEmployees(); // Recarga los empleados
        setIsEditing(false);
        setFormData({
          name: '',
          lastName: '',
          birthday: '',
          email: '',
          address: '',
          password: '',
          hireDate: '',
          telephone: '',
          dui: '',
          isVerified: false,
          issnumber: '',
        });
        navigate('/employees');
      } else {
        const errorData = await response.json();
        console.error('Error updating employee - backend response:', errorData);
        alert(`Error al actualizar empleado: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating employee - network/fetch error:', error);
      alert(`Error al actualizar empleado: ${error.message}`);
    }
  };

  // Eliminar un empleado
  const handleDelete = async (id) => {
    try {
      // Asegurarse de que id es válido y está en el formato correcto
      if (!id) {
        alert('ID de empleado no válido');
        return;
      }
      
      console.log(`Eliminando empleado con ID: ${id}`);
      
      const response = await fetch(`http://localhost:4000/api/employee/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEmployees(employees.filter((employee) => employee._id !== id)); // Actualiza la lista de empleados
      } else {
        const errorData = await response.json();
        console.error('Error deleting employee - backend response:', errorData);
        alert(`Error al eliminar empleado: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting employee - network/fetch error:', error);
      alert(`Error al eliminar empleado: ${error.message}`);
    }
  };

  // Función para establecer la edición de un empleado
  const handleEditClick = (employee) => {
    setIsEditing(true);
    setCurrentEmployeeId(employee._id);
    setFormData({
      name: employee.name,
      lastName: employee.lastName,
      birthday: employee.birthday,
      email: employee.email,
      address: employee.address,
      password: employee.password,
      hireDate: employee.hireDate,
      telephone: employee.telephone,
      dui: employee.dui,
      isVerified: employee.isVerified,
      issnumber: employee.issnumber,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-blue-700">Gestión de Empleados</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna izquierda: Formulario */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditing ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
            </h2>
            
            <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contratación</label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DUI</label>
                  <input
                    type="text"
                    name="dui"
                    value={formData.dui}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número ISSS</label>
                  <input
                    type="text"
                    name="issnumber"
                    value={formData.issnumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 shadow-lg transform transition hover:-translate-y-1"
                >
                  {isEditing ? 'Actualizar Empleado' : 'Registrar Empleado'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Columna derecha: Lista de empleados */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Empleados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <div
                  key={employee._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl card-hover-effect shine-effect"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-bold text-xl">{employee.name[0]}{employee.lastName[0]}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(employee)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{employee.name} {employee.lastName}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {employee.email}
                      </p>
                      <p className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {employee.telephone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {employees.length === 0 && (
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <p className="text-gray-600">No hay empleados registrados. ¡Agrega uno nuevo!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;

