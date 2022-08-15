const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const { limiter } = require("./utils/rateLimiter");
const congratulations = require("./api/congratulations");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(helmet());

app.use(limiter);

app.use(congratulations);

app.listen(PORT, () => {
  console.log(`Sever is running on ${PORT}`);
});
