const express = require("express");
const path = require("path");
const cors = require("cors");

const port = 8080;

const app = express();

/**
 * Config response
 * JSON
 * FORM DATA
 */

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`App rodando na porta: ${port}`);
});
