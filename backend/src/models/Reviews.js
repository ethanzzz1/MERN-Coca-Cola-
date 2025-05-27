/*
    Campos:
        comment
        rating
        idClient
*/

import { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      set: (v) => Math.round(v)
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    images: [{
      type: String,
      validate: {
        validator: function(v) {
          return v.startsWith('http') && (v.endsWith('.jpg') || v.endsWith('.png') || v.endsWith('.jpeg'));
        },
        message: 'La URL de la imagen debe ser una URL válida de imagen'
      }
    }],
    purchaseDate: {
      type: Date,
      required: true
    },
    verifiedPurchase: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

// Index para búsqueda rápida por producto y cliente
reviewsSchema.index({ productId: 1, customerId: 1 });

// Validación personalizada para el rating mínimo
reviewsSchema.path('rating').validate(function(rating) {
  return rating >= 1;
}, 'La calificación mínima es 1');

// Validación personalizada para el comentario duplicado
reviewsSchema.pre('save', async function(next) {
  const review = this;
  const existingReview = await reviewsModel.findOne({
    customerId: review.customerId,
    productId: review.productId,
    status: 'approved'
  });
  
  if (existingReview) {
    next(new Error('Ya existe una reseña aprobada para este producto del cliente'));
  }
  next();
});

export default model("Review", reviewsSchema);
