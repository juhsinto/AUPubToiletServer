// Import Mongoose
let mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
// If .env.local file present dotenv will override .env
dotenv.config({ path: `.env.local`, override: true });

// load config
mongodb_username = process.env.USERNAME;
mongodb_password = process.env.MONGO_PW;
cluster = process.env.CLUSTER;
collection = process.env.COLLECTION;
isDev = process.env.IS_DEV;

// MongoDb  connection - to the toilets collection on the toilet database
mongoose
  .connect(
    `mongodb+srv://${mongodb_username}:${mongodb_password}@${cluster}.kbefj.mongodb.net/${collection}?retryWrites=true&w=majority`
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
