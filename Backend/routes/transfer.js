const express = require("express");
const router = express.Router();
const Transfer = require("../models/Transfer");
const axios = require("axios");
const { convert, history, histories, deleteRecord } = require("../endpoints/currency-ep");

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

router.post("/convert", convert);

router.get("/history", histories );

router.delete("/revoke/:id", deleteRecord);

module.exports = router;
