import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Review = () => {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    comment: '',
    rating: '',
    idClient: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);

  // Obtener comentarios desde el backend
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/reviews'); // URL del backend
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
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
    try {
      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          comment: '',
          rating: '',
          idClient: '',
        });
        fetchComments(); // Recarga los comentarios
        navigate('/comments');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // Editar un comentario
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/reviews/${currentCommentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchComments(); // Recarga los comentarios
        setIsEditing(false);
        setFormData({
          comment: '',
          rating: '',
          idClient: '',
        });
        navigate('/comments');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
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
      rating: comment.rating,
      idClient: comment.idClient,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        {isEditing ? 'Editar Comentario' : 'Crear Nuevo Comentario'}
      </h1>

      {/* Formulario para Crear o Editar un Comentario */}
      <form onSubmit={isEditing ? handleEdit : handleCreate} className="space-y-6 mb-12">
        <div>
          <label className="block text-sm font-medium text-gray-700">Comentario</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating (1 a 5)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">ID Cliente</label>
          <input
            type="text"
            name="idClient"
            value={formData.idClient}
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
            {isEditing ? 'Actualizar Comentario' : 'Crear Comentario'}
          </button>
        </div>
      </form>

      {/* Lista de Comentarios */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900">Cliente: {comment.idClient}</h2>
            <p className="text-gray-600 mt-2">{comment.comment}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-yellow-600 font-semibold">Rating: {comment.rating}</span>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleEditClick(comment)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(comment._id)}
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

export default Review;
