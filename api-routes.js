// Initialize express router
let router = require("express").Router();
// Set default API response
router.get("/", function(req, res) {
  res.json({
    status: "API endpoint working",
    message: "please try /api/toilets"
  });
});

// Import toilet controller
var toiletController = require("./toiletController");

// Toilet routes
router
  .route("/toilets")
  .get(toiletController.index)
  .post(toiletController.find);

// Export API routes
module.exports = router;
