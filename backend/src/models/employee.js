/*
    Campos:
        nombre
        descripcion
        precio
        stock
*/

import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },

    birthday: {
      type: Date,
      required: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/
    },

    address: {
      type: String,
      trim: true,
      maxlength: 200
    },

    telephone: {
      type: String,
      required: true,
      trim: true,
      match: /^[0-9]{8}$/
    },

    dui: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: /^[0-9]{8}-[0-9]$/
    },

    issNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },

    hireDate: {
      type: Date,
      required: true
    },

    position: {
      type: String,
      required: true,
      enum: ['manager', 'supervisor', 'employee', 'assistant']
    },

    salary: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'on leave'],
      default: 'active'
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    },

    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    }
  },
  {
    timestamps: true,
    strict: false
  }
);

// Index para búsqueda rápida por nombre y apellido
employeeSchema.index({ name: 1, lastName: 1 });

// Validación personalizada para la edad mínima
employeeSchema.path('birthday').validate(function(birthday) {
  const age = new Date().getFullYear() - new Date(birthday).getFullYear();
  return age >= 18;
}, 'La edad mínima es 18 años');

export default model("Employee", employeeSchema);
