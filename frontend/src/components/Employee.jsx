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

  // Obtener empleados desde el backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employees'); // URL de tu backend
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
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
      const response = await fetch('http://localhost:5000/api/employees', {
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
      }
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  // Editar un empleado
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${currentEmployeeId}`, {
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
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Eliminar un empleado
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
      });
      setEmployees(employees.filter((employee) => employee._id !== id)); // Actualiza la lista de empleados
    } catch (error) {
      console.error('Error deleting employee:', error);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {isEditing ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
      </h1>

      {/* Formulario para Crear o Editar un Empleado */}
      <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-6 mb-12">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Contratación</label>
          <input
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">DUI</label>
          <input
            type="text"
            name="dui"
            value={formData.dui}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Número ISSS</label>
          <input
            type="text"
            name="issnumber"
            value={formData.issnumber}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700"
          >
            {isEditing ? 'Actualizar Empleado' : 'Crear Empleado'}
          </button>
        </div>
      </form>

      {/* Lista de Empleados */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <div
            key={employee._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900">{employee.name} {employee.lastName}</h2>
            <p className="text-gray-600 mt-2">Correo: {employee.email}</p>
            <p className="text-gray-600 mt-2">Teléfono: {employee.telephone}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEditClick(employee)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(employee._id)}
                className="text-red-600 hover:text-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employee;

