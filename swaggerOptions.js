// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000", // your API base url
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the files with documentation
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
