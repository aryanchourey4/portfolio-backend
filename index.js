const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const dotenv = require("dotenv")

// server configuration
const PORT = process.env.PORT || 8080;

const cors = require("cors");
const whitelist = process.env.frontendURL || "http://localhost:3000"
console.log(whitelist)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
dotenv.config();

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", require("./routes/contact.js"));



app.listen(PORT, () => {
    console.log(`Server listening at: ${PORT}`);
  });