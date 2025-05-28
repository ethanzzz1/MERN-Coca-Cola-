import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Review = () => {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    comment: '',
    rating: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);

  // Función para obtener comentarios
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/api/reviews'); // URL del backend
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Error al cargar los comentarios. Por favor, intente nuevamente.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar comentarios al iniciar
  useEffect(() => {
    fetchComments();
  }, []);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear un nuevo comentario
  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validación de longitud mínima
    if (formData.comment.length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      setFormData({
        comment: '',
        rating: ''
      });
      setError(null);
      fetchComments(); // Recarga los comentarios
    } catch (error) {
      console.error('Error creating comment:', error);
      setError(`Error al crear el comentario: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Editar un comentario
  const handleEdit = async (e) => {
    e.preventDefault();
    
    // Validación de longitud mínima
    if (formData.comment.length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/reviews/${currentCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      fetchComments(); // Recarga los comentarios
      setIsEditing(false);
      setFormData({
        comment: '',
        rating: ''
      });
      setError(null);
    } catch (error) {
      console.error('Error updating comment:', error);
      setError(`Error al actualizar el comentario: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un comentario
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/reviews/${id}`, {
        method: 'DELETE',
      });
      setComments(comments.filter((comment) => comment._id !== id)); // Actualiza la lista de comentarios
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Función para establecer la edición de un comentario
  const handleEditClick = (comment) => {
    setIsEditing(true);
    setCurrentCommentId(comment._id);
    setFormData({
      comment: comment.comment,
      rating: comment.rating
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">Opiniones y Comentarios</span>
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna izquierda: Formulario */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditing ? 'Editar Comentario' : 'Agregar Nuevo Comentario'}
            </h2>
            
            <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tu opinión</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows="6"
                  placeholder="Comparte tu experiencia (mínimo 10 caracteres)..."
                  required
                  minLength="10"
                ></textarea>
                <small className="text-gray-500 mt-1">{formData.comment.length}/500 caracteres (mínimo 10)</small>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className={`text-2xl focus:outline-none ${parseInt(formData.rating) >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="hidden"
                    min="1"
                    max="5"
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-6 text-white font-medium rounded-lg bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 focus:ring-4 focus:ring-red-300 shadow-lg transform transition hover:-translate-y-1"
                >
                  {isEditing ? 'Actualizar Comentario' : 'Publicar Comentario'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Columna derecha: Lista de comentarios */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Comentarios Recientes</h2>
            
            {/* Mensajes de error o carga */}
            {loading && (
              <div className="bg-white rounded-lg p-8 shadow-md mb-6">
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-3 text-gray-700">Cargando comentarios...</span>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {Array.isArray(comments) && comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover-effect shine-effect"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Opinión</h3>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xl ${i < comment.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(comment)}
                            className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mt-3 leading-relaxed">{comment.comment}</p>
                      
                      {comment.title && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h4 className="font-medium text-gray-900">{comment.title}</h4>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <p className="text-gray-600">No hay comentarios disponibles. ¡Sé el primero en compartir tu opinión!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
