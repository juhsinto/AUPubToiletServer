// Initialize express router
let router = require("express").Router();

// Set default API response
router.get("/", function (req, res) {
  res.json({
    status: "API endpoint working",
    message: "please try /api/toilets",
  });
});

// Import toilet controller
var toiletController = require("../controllers/toiletController");

// Toilet routes
router
  .route("/toilets")
  .get(toiletController.index)
  .post(toiletController.find);

router.route("/toilets-dist").post(toiletController.findByDistance);

// Export API routes
module.exports = router;
