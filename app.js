const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

dotenv.config();
// If .env.local file present dotenv will override .env
dotenv.config({ path: `.env.local`, override: true });

// Initialize the app
const app = express();
// TODO: for ssl ??
// app.use(express.static(__dirname + "/static", { dotfiles: "allow" }));

app.use(cors());

// Configure bodyParser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const httpServer = http.createServer(app);

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
const apiRoutes = require("./routes/api-routes");

// Use Api routes in the App
app.use("/api", apiRoutes);

// Setup server port
const port = process.env.PORT;

httpServer.listen(port, () => {
  console.log("Listening for non-SSL requests... on port ", port);
});

module.exports = httpServer;

require("./models/databaseConnection");

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
