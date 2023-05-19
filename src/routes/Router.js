const express = require("express");
const router = express();

router.get("/", (_, res) => {
  res.send("API Working");
});

module.exports = router;
