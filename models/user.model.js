const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es un campo obligatorio"],
    },
    lastName: {
      type: String,
      required: [true, "Debes elegir que tipo de evento será"],
    },
    email: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    password: {
      type: String,
      required: [true, "Tu evento debe tener fecha de inicio"],
    },
    assignedEvents: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event' 
    }
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);

module.exports = User;
