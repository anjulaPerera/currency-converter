const express = require("express");
const router = express.Router();
const {
  convert,
  histories,
  deleteRecord,
} = require("../endpoints/currency-ep");

router.post("/convert", convert);

router.get("/history", histories);

router.delete("/revoke/:id", deleteRecord);

module.exports = router;
