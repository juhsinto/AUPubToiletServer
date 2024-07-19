const mongoose = require("mongoose");

// Setup schema
const toiletSchema = mongoose.Schema({
  name: {
    type: String,
  },
  female: {
    type: String,
  },
  male: {
    type: String,
  },
  wheelchair: {
    type: String,
  },
  operator: {
    type: String,
  },
  loc: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
});

// set index on schema
toiletSchema.index({ loc: "2dsphere" });

// Export Toilet model
const Toilet = mongoose.model("toilets", toiletSchema);
module.exports = Toilet;
