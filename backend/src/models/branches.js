/*
    Campos:
        name
        lastName
        birthday
        email
        password
        telephone
        dui
*/

import { Schema, model } from "mongoose";

const branchesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    birthday: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    telephone: {
      type: String,
      required: true,
    },

    dui: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("branches", branchesSchema);
