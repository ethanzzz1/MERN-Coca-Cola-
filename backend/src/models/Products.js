/*
    Campos:
        nombre
        descripcion
        precio
        stock
*/

import { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
      unique: true
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      set: (v) => Math.round(v * 100) / 100
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      enum: ['Coca-Cola', 'Sprite', 'Fanta', 'Powerade', 'Dasani', 'Other']
    },

    image: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'out of stock'],
      default: 'active'
    },

    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier'
    },

    nutritionalInfo: {
      calories: Number,
      servingSize: String,
      servingsPerContainer: Number,
      ingredients: [String]
    },

    packaging: {
      type: String,
      enum: ['bottle', 'can', 'box', 'bag'],
      required: true
    },

    volume: {
      type: Number,
      required: true,
      unit: {
        type: String,
        enum: ['ml', 'l', 'oz'],
        required: true
      }
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

// Index para búsqueda rápida por nombre y categoría
productsSchema.index({ name: 1, category: 1 });

// Validación personalizada para el precio mínimo
productsSchema.path('price').validate(function(price) {
  return price >= 0.5;
}, 'El precio mínimo es $0.50');

// Validación personalizada para el stock máximo
productsSchema.path('stock').validate(function(stock) {
  return stock <= 10000;
}, 'El stock máximo es 10,000 unidades');

export default model("Product", productsSchema);
