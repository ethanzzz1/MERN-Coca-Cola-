/*
    Modelo simplificado de Employee para coincidir con el frontend
*/

import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    birthday: {
      type: Date,
      required: false
    },

    email: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: false,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    telephone: {
      type: String,
      required: true,
      trim: true
    },

    dui: {
      type: String,
      required: true,
      trim: true
    },

    // Campo alineado con el frontend (issnumber -> issNumber)
    issNumber: {
      type: String,
      required: true,
      trim: true
    },

    hireDate: {
      type: Date,
      required: false
    },

    // Campos opcionales con valores predeterminados
    position: {
      type: String,
      required: false,
      default: 'employee'
    },

    salary: {
      type: Number,
      required: false,
      default: 0
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'on leave'],
      default: 'active'
    },

    // Ya no es requerido
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: false
    },

    supervisor: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: false
    },
    
    isVerified: {
      type: Boolean,
      default: false
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
