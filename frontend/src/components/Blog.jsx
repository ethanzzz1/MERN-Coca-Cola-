import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog= () => {
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  // Obtener blogs desde el backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, []);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear un nuevo blog
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          image: '',
        });
        fetchBlogs(); // Recarga los blogs
        navigate('/blogs');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  // Editar un blog
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${currentBlogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchBlogs(); // Recarga los blogs
        setIsEditing(false);
        setFormData({
          title: '',
          content: '',
          image: '',
        });
        navigate('/blogs');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  // Eliminar un blog
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
      });
      setBlogs(blogs.filter((blog) => blog._id !== id)); // Actualiza la lista de blogs
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // Función para establecer la edición de un blog
  const handleEditClick = (blog) => {
    setIsEditing(true);
    setCurrentBlogId(blog._id);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {isEditing ? 'Editar Blog' : 'Crear Nuevo Blog'}
      </h1>

      {/* Formulario para Crear o Editar un Blog */}
      <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-6 mb-12">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contenido</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="5"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen (URL)</label>
          <input
            type="text"
            name="image"
            value={formData.image}
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
            {isEditing ? 'Actualizar Blog' : 'Crear Blog'}
          </button>
        </div>
      </form>

      {/* Lista de Blogs */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <img
              src={blog.image || 'https://via.placeholder.com/400'}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>
            <p className="text-gray-600 mt-2">{blog.content.slice(0, 100)}...</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEditClick(blog)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(blog._id)}
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

export default Blog;
