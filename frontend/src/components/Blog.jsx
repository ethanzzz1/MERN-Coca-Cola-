import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Blog = () => {
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    author: '',
    category: 'news',
    status: 'draft',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  // Función para obtener blogs desde el backend
  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/blogs');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  // Cargar blogs al montar el componente
  useEffect(() => {
    fetchBlogs(); // Call the component-level one
  }, []); // El array vacío asegura que se ejecute solo al montar

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Crear un nuevo blog
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('content', formData.content);
      if (formData.image) {
        dataToSend.append('image', formData.image);
      }
      dataToSend.append('author', formData.author);
      dataToSend.append('category', formData.category);
      dataToSend.append('status', formData.status);

      const response = await fetch('http://localhost:4000/api/blogs', {
        method: 'POST',
        body: dataToSend,
      });
      if (response.ok) {
        setFormData({
          title: '',
          content: '',
          image: null,
          author: '',
          category: 'news',
          status: 'draft',
        });
        fetchBlogs(); // Recarga los blogs
        navigate('/blogs');
      } else {
        const errorData = await response.json();
        console.error('Error creating blog - backend response:', errorData);
        alert(`Error creating blog: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating blog - network/fetch error:', error);
      alert(`Error creating blog: ${error.message}`);
    }
  };

  // Editar un blog
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      dataToSend.append('content', formData.content);
      if (formData.image && typeof formData.image !== 'string') {
        dataToSend.append('image', formData.image);
      }
      dataToSend.append('author', formData.author);
      dataToSend.append('category', formData.category);
      dataToSend.append('status', formData.status);

      const response = await fetch(`http://localhost:4000/api/blogs/${currentBlogId}`, {
        method: 'PUT',
        body: dataToSend,
      });
      if (response.ok) {
        fetchBlogs(); // Recarga los blogs
        setIsEditing(false);
        setFormData({
          title: '',
          content: '',
          image: null,
          author: '',
          category: 'news',
          status: 'draft',
        });
        navigate('/blogs');
      } else {
        const errorData = await response.json();
        console.error('Error updating blog - backend response:', errorData);
        alert(`Error updating blog: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating blog - network/fetch error:', error);
      alert(`Error updating blog: ${error.message}`);
    }
  };

  // Eliminar un blog
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/blogs/${id}`, {
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
      image: '', // No prellenar con la URL, solo si el usuario sube una nueva imagen
      author: blog.author || '',
      category: blog.category || 'news',
      status: blog.status || 'draft',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">Blog Corporativo</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna izquierda: Formulario */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditing ? 'Editar Publicación' : 'Nueva Publicación'}
            </h2>
            
            <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Título del artículo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="6"
                  placeholder="Escribe el contenido aquí..."
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500"
                      >
                        <span>Subir imagen</span>
                        <input
                          id="file-upload"
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nombre del autor"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="news">Noticias</option>
                    <option value="products">Productos</option>
                    <option value="company">Compañía</option>
                    <option value="events">Eventos</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:ring-4 focus:ring-red-300 shadow-lg transform transition hover:-translate-y-1"
                >
                  {isEditing ? 'Actualizar Publicación' : 'Publicar Artículo'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Columna derecha: Lista de blogs */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Artículos Publicados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.length > 0 ? blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover-effect shine-effect"
                >
                  <div className="aspect-w-16 aspect-h-9 w-full">
                    <img
                      src={blog.image || 'https://via.placeholder.com/600x400?text=Coca-Cola+Blog'}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {blog.category === 'news' ? 'Noticias' : 
                           blog.category === 'products' ? 'Productos' : 
                           blog.category === 'company' ? 'Compañía' : 'Eventos'}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {blog.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{blog.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{blog.content.slice(0, 150)}...</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Por:</span> {blog.author}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(blog)}
                          className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full bg-white rounded-lg p-8 text-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p className="text-gray-600">No hay artículos disponibles. ¡Crea el primero!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
