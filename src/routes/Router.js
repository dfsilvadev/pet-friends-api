const express = require("express");
const router = express();

router.use("/api/users", require("./User"));

router.get("/", (_, res) => {
  res.send("API Working");
});

module.exports = router;
