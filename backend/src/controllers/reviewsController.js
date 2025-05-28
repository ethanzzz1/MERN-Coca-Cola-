import reviewsModel from "../models/Reviews.js";
import mongoose from "mongoose";

const reviewsController = {};

// Obtener todas las reseñas
reviewsController.getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewsModel.find()
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseñas por producto - Ya no es necesaria esta función pero la mantenemos por compatibilidad
reviewsController.getReviewsByProduct = async (req, res) => {
  try {
    // Como ya no tenemos productos, esta función retornará un array vacío
    res.json([]);
  } catch (error) {
    console.error('Error getting reviews by product:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseñas por cliente - Ya no es necesaria esta función pero la mantenemos por compatibilidad
reviewsController.getReviewsByCustomer = async (req, res) => {
  try {
    // Como ya no tenemos customerId, esta función retornará un array vacío
    res.json([]);
  } catch (error) {
    console.error('Error getting reviews by customer:', error);
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva reseña
reviewsController.createReview = async (req, res) => {
  try {
    const {
      comment,
      rating,
      productId,
      title,
      images
    } = req.body;

    const newReview = new reviewsModel({
      comment,
      rating,
      productId: productId || null, // Make productId optional
      title: title || 'Reseña', // Provide default title if not provided
      images: images || [],
      status: 'approved', // Default to approved
      helpfulVotes: 0,
      verifiedPurchase: false,
      purchaseDate: new Date() // Default to current date
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Actualizar una reseña
reviewsController.updateReview = async (req, res) => {
  try {
    const {
      comment,
      rating,
      title,
      images,
      status,
      helpfulVotes
    } = req.body;

    const updatedReview = await reviewsModel.findByIdAndUpdate(
      req.params.id,
      {
        comment,
        rating,
        title,
        images,
        status,
        helpfulVotes
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una reseña
reviewsController.deleteReview = async (req, res) => {
  try {
    const deletedReview = await reviewsModel.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json({ message: 'Reseña eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar reseñas por texto
reviewsController.searchReviews = async (req, res) => {
  try {
    const { query } = req.params;
    const reviews = await reviewsModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { comment: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error searching reviews:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener estadísticas de reseñas por producto
reviewsController.getProductReviewsStats = async (req, res) => {
  try {
    // Validar que el ID del producto es válido
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const stats = await reviewsModel.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(req.params.productId),
          status: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    // Contar el número de reseñas por cada calificación
    const ratingCounts = await reviewsModel.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(req.params.productId),
          status: 'approved'
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    // Formatear la respuesta
    const result = stats[0] || { averageRating: 0, totalReviews: 0 };
    
    // Agregar la distribución de calificaciones
    result.ratingDistribution = {};
    ratingCounts.forEach(item => {
      result.ratingDistribution[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error('Error getting product review stats:', error);
    res.status(500).json({ error: error.message });
  }
};

export default reviewsController;
