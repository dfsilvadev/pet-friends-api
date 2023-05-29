const express = require("express");
const router = express();

router.use("/api/users", require("./User"));
router.use("/api/photos", require("./Photo"));

router.get("/", (_, res) => {
  res.send("API Working");
});

module.exports = router;
