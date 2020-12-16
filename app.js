// Import express
let express = require("express");
// Import Body parser
let bodyParser = require("body-parser");
// Import Mongoose
let mongoose = require("mongoose");

// store mongo password separately
require("./mlab_password_file")

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
// mongodb_password is stored in password file like `var mongodb_password = "xyz"`
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
    </p>"
  )
);

// Use Api routes in the App
app.use("/api", apiRoutes);

httpServer.listen(8080, () => {
  console.log("Listening for non-SSL requests...");
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
    console.log("Listening for SSL requests...");
  });
