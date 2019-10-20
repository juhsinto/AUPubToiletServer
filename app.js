// Import express
let express = require("express");
// Import Body parser
let bodyParser = require("body-parser");
// Import Mongoose
let mongoose = require("mongoose");
// Initialize the app
let app = express();

// Import routes
let apiRoutes = require("./api-routes");
// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Mlab  connection ; protect password
mongoose.connect(
  "mongodb://jacinto:D4VkaYik#lG5@ds337418.mlab.com:37418/toilets-melbourne",
  { useNewUrlParser: true }
);

var db = mongoose.connection;

// Added check for DB connection

if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get("/", (req, res) =>
  res.send(
    "<p> Melbourne Public Toilet REST API -  <br> \
    GET: /api, <br>\
    GET: /api/toilets <br> \
    POST:/api/toilets with body {lat: <>,  long: <>} \
    </p>"
  )
);

// Use Api routes in the App
app.use("/api", apiRoutes);

// Launch app to listen to specified port
app.listen(port, function() {
  console.log("Running server on port " + port);
});
