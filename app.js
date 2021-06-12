// Import express
let express = require("express");
// Import Body parser
let bodyParser = require("body-parser");
// Import Mongoose
let mongoose = require("mongoose");

require('dotenv').config()
// store mongo password separately
mongodb_password = process.env.MONGO_PW

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

// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Mlab  connection - au dataset ; 
// mongodb_password is stored in .env file
mongoose.connect(
  "mongodb+srv://jacinto:"+ encodeURIComponent(mongodb_password) +"@toilets-au.kbefj.mongodb.net/toilets_au?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

var db = mongoose.connection;

// check for DB connection
if (!db) console.log("Error connecting db");
else console.log("Db connected successfully");

// Setup server port
var port = process.env.PORT || 8080;


// Send message for default URL
app.get("/", (req, res) =>
  res.send(
    "<p> Public Toilet (AU) REST API -  <br> \
    GET: /api, <br>\
    GET: /api/toilets <br> \
    POST:/api/toilets with body {lat: <>,  long: <>} \
    POST:/api/toilets-dist with body {lat: <>,  long: <>, distance: <>} \
    </p>"
  )
);

// Use Api routes in the App
app.use("/api", apiRoutes);

httpServer.listen(port, () => {
  console.log("jm: Listening for non-SSL requests...");
});

httpsServer
  .createServer(
    // {
    //   key: fs.readFileSync(
    //     "/etc/letsencrypt/live/jacintomendes.com/privkey.pem"
    //   ),
    //   cert: fs.readFileSync("/etc/letsencrypt/live/jacintomendes.com/cert.pem"),
    //   ca: fs.readFileSync("/etc/letsencrypt/live/jacintomendes.com/chain.pem")
    // },
    app
  )
  .listen(port, () => {
    console.log("jm: Listening for SSL requests...");
  });
