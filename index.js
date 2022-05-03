const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 4000;

// express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
global.publicPath = __dirname + "/public";

// database connection
mongoose
  .connect("mongodb://localhost:27017/social-networking", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

require("./routes/index")(app);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
