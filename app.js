// Import express
let express = require("express");
// Import Body parser
let bodyParser = require("body-parser");
// Import Mongoose
let mongoose = require("mongoose");

// Initialize the app
let app = express();

const fs = require("fs");

var httpServer = require("http").createServer(app);
var httpsServer = require("https");

// Import routes
let apiRoutes = require("./api-routes");

// for ssl
app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));

var cors = require("cors");
app.use(cors());

//app.use(function(req, res, next) {
//res.header("Access-Control-Allow-Origin", "www.jacintomendes.com"); // update to match the domain you will make the request from
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Mlab  connection ; old - melbourne only dataset
// mongoose.connect(
//   "mongodb://jacinto:D4VkaYik#lG5@ds337418.mlab.com:37418/toilets-melbourne",
//   { useNewUrlParser: true }
// );

// Mlab  connection - new ; au dataset ; TODO: protect password
mongoose.connect(
  "mongodb://jacinto:D4VkaYik#lG5@ds121406.mlab.com:21406/toilets_au",
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
//app.listen(port, function() {
// console.log("Running server on port " + port);
//});

httpServer.listen(8080, () => {
  console.log("Listening...");
});

httpsServer
  .createServer(
    {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/jacintomendes.com/privkey.pem"
      ),
      cert: fs.readFileSync("/etc/letsencrypt/live/jacintomendes.com/cert.pem"),
      ca: fs.readFileSync("/etc/letsencrypt/live/jacintomendes.com/chain.pem")
    },
    app
  )
  .listen(8443, () => {
    console.log("Listening...");
  });
