/*
    Coleccion: Blog

    Campos:
        Title
        Content
        image
*/

import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },
    image: {
      type: String,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    category: {
      type: String,
      enum: ['news', 'products', 'company', 'events'],
      default: 'news'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

export default model("Blog", blogSchema);
