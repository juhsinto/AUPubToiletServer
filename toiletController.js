// Import toilet model
Toilet = require("./toiletModel");
// Handle index actions
exports.index = function(req, res) {
  Toilet.get(function(err, toilets) {
    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    res.json({
      status: "success",
      message: "Toilets retrieved successfully",
      data: toilets
    });
  });
};

exports.find = function(req, res) {
  console.log("lat: " + req.body.lat);
  console.log("long: " + req.body.long);

  let toilets = Toilet.find({
    loc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [req.body.long, req.body.lat]
        },
        $minDistance: 0,
        $maxDistance: 500 /* 500 meters */
      }
    }
  }).limit(3).find((err, toiletResults) => {
    console.log(JSON.stringify(toiletResults, 0, 2));

    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    res.json({
      status: "success",
      message: "Toilets retrieved successfully",
      data: toiletResults
    });
  });
};
