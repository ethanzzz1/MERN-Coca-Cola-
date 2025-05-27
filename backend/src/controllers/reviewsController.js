import reviewsModel from "../models/Reviews.js";

const reviewsController = {};

// Obtener todas las reseñas
reviewsController.getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewsModel.find()
      .populate('customerId')
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseñas por producto
reviewsController.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await reviewsModel.find({ productId: req.params.productId })
      .populate('customerId')
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseñas por cliente
reviewsController.getReviewsByCustomer = async (req, res) => {
  try {
    const reviews = await reviewsModel.find({ customerId: req.params.customerId })
      .populate('customerId')
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva reseña
reviewsController.createReview = async (req, res) => {
  try {
    const {
      comment,
      rating,
      customerId,
      productId,
      title,
      images,
      purchaseDate
    } = req.body;

    const newReview = new reviewsModel({
      comment,
      rating,
      customerId,
      productId,
      title,
      images,
      purchaseDate
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
    })
    .populate('customerId')
    .populate('productId');
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener estadísticas de reseñas por producto
reviewsController.getProductReviewsStats = async (req, res) => {
  try {
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
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $arrayToObject: {
              $map: {
                input: [1, 2, 3, 4, 5],
                as: 'rating',
                in: {
                  k: { $toString: '$$rating' },
                  v: {
                    $size: {
                      $filter: {
                        input: '$$ROOT.rating',
                        as: 'r',
                        cond: { $eq: ['$$r', '$$rating'] }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default reviewsController;
