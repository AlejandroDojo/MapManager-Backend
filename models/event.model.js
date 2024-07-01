const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es un campo obligatorio"],
    },
    type: {
      type: Array,
      required: [true, "Debes elegir que tipo de evento será"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    startDate: {
      type: Date,
      required: [true, "Tu evento debe tener fecha de inicio"],
    },
    endDate: {
      type: Date,
      required: [true, "Tu evento debe tener fecha de finalización"],
    },
    imagenUrl: { type: String, required: true },
    price: {
      type: Number,
      default: 0,
    },
    location: {
      type: Array,
      required: [true, "Debes elegir en el mapa donde será el evento"],
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
