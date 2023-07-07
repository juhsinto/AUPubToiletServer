const express = require("express");
// Initialize the app
const app = express();
// for ssl ??
// app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));

// Import Body parser
const bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());

// Configure bodyParser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

var httpServer = require("http").createServer(app);

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

// Import routes
let apiRoutes = require("./routes/api-routes");

// Use Api routes in the App
app.use("/api", apiRoutes);

// Setup server port
var port = process.env.PORT || 8080;

httpServer.listen(port, () => {
  console.log("Listening for non-SSL requests...");
});

module.exports = httpServer;

require("./databaseConnection");

// const fs = require("fs");
// var httpsServer = require("https");
// httpsServer
//   .createServer(
//     // {
//     //   key: fs.readFileSync(
//     //     "/etc/letsencrypt/live/jacintomendes.com/privkey.pem"
//     //   ),
//     //   cert: fs.readFileSync("/etc/letsencrypt/live/jacintomendes.com/cert.pem"),
//     //   ca: fs.readFileSync("/etc/letsencrypt/live/jacintomendes.com/chain.pem")
//     // },
//     app
//   )
//   .listen(port, () => {
//     console.log("Listening for SSL requests...");
//   });
