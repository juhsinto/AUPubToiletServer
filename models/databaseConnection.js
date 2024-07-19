// Import Mongoose
let mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
// If .env.local file present dotenv will override .env
dotenv.config({ path: `.env.local`, override: true });

const mongodb_username = encodeURIComponent(process.env.USERNAME);
const mongodb_password = encodeURIComponent(process.env.MONGO_PW);
const cluster = process.env.CLUSTER;
const collection = process.env.COLLECTION;

const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@${cluster}.kbefj.mongodb.net/toilets_au?authSource=admin`;

// MongoDb  connection - to the toilets collection on the toilet database
mongoose
  .connect(
    `${uri}`
  )
  .then(() => {
    console.info("Connection to Database is successful");
  })
  .catch((error) => {
    console.log("Connection Error: ", error);
    if (isDev) {
      // non-graceful server shutdown
      // dont use in PROD - as we expect the connection to stay on
      process.exit(0);
    }
  });

const db = mongoose.connection;

module.exports = db;
