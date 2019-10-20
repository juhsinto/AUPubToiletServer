var mongoose = require("mongoose");

// Setup schema
var toiletSchema = mongoose.Schema({
  name: {
    type: String
  },
  female: {
    type: String
  },
  male: {
    type: String
  },
  wheelchair: {
    type: String
  },
  operator: {
    type: String
  },
  operator: {
    type: String
  },
  loc: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number]
    }
  }
});
// Export Toilet model
var Toilet = (module.exports = mongoose.model("toilets", toiletSchema));
module.exports.get = function(callback, limit) {
  Toilet.find(callback).limit(limit);
};
