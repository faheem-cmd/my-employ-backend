const express = require("express");
var app = express();
var cors = require("cors");
var mongoose = require("./database/mongoose");
app.use(cors());
require("dotenv").config();
var bodyParser = require("body-parser");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
const router = require("./routes/router");
app.use("/", router);
const { success, error } = require("consola");
const path = require("path");
const http = require("http");
const dbUrl = process.env.DB_URL || `mongodb://0.0.0.0:27017/${dbName}`;
const server = http.createServer(app);

mongoose(`mongodb://0.0.0.0:27017/${dbUrl}`);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  apis: ["./routes/books.js"],
};

const specs = swaggerJsdoc(options);
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));

server.listen(process.env.PORT, () => {
  success({
    message: `Successfully connected with the database \n${dbUrl}`,
    badge: true,
  });
  success({
    message: `Server is running on \n${process.env.PORT}`,
    badge: true,
  });
});
