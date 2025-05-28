/*
    Campos:
        comment
        rating
*/

import { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'El comentario debe tener al menos 10 caracteres'],
      maxlength: [500, 'El comentario no puede exceder los 500 caracteres']
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      set: (v) => Math.round(v)
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    title: {
      type: String,
      required: false,
      trim: true,
      maxlength: 100,
      default: 'Reseña'
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
      required: false,
      default: Date.now
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

// Index para búsqueda rápida por producto
reviewsSchema.index({ productId: 1 });

// Validación personalizada para el rating mínimo
reviewsSchema.path('rating').validate(function(rating) {
  return rating >= 1;
}, 'La calificación mínima es 1');

// No validation for duplicates since we removed the customerId requirement

export default model("Review", reviewsSchema);
