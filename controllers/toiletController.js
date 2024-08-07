// Import toilet model
Toilet = require("../models/toiletModel");

// limit results in search
let default_search_limit = 3;
let max_search_limit = 500;

// Handle index actions
exports.index = async function (req, res) {
  try {
    const toilets = await Toilet.find({}).limit(max_search_limit);
    return res.status(200).json(toilets);
  } catch (err) {
    return res.json({
      status: "error",
      message: err,
    });
  }
};

exports.find = async function (req, res) {
  console.log(
    "Handling POST request for /toilets with lat,long parameters ",
    req.body.lat,
    ",",
    req.body.long
  );

  let result = "";

  try {
    result = await Toilet.find({
      loc: {
        $near: {
          $minDistance: 0,
          $maxDistance: 500 /* 500 meters */,
          $geometry: {
            type: "Point",
            coordinates: [req.body.long, req.body.lat],
          },
        },
      },
    }).limit(default_search_limit);
  
  } catch(exception) {
    result = "Exception: " + JSON.stringify(exception.message);
    console.log('Encountered Exception ', exception);
  } finally {
    return  res.status(200).json(result);
  }
};

exports.findByDistance = async function (req, res) {
  console.log(
    "Handling POST request for /toilets-dist with lat,long, and distance parameters ",
    req.body.lat,
    ",",
    req.body.long,
    ",",
    req.body.distance
  );

  let result = "";

  try {
    result = await Toilet.find({
      loc: {
        $near: {
          $minDistance: 10,
          $maxDistance: req.body.distance,
          $geometry: {
            type: "Point",
            coordinates: [req.body.long, req.body.lat],
          },
        },
      },
    }).limit(default_search_limit);

  } catch(exception) {
    result = "Exception: " + JSON.stringify(exception.message);
    console.log('Encountered Exception ', exception);
  } finally {
    return res.status(200).json(result);
  }
};
