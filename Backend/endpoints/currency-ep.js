const Transfer = require("../models/Transfer");
const axios = require("axios");
require("dotenv").config();
const getCountryFromCurrency = require("../utils/currencyUtils");

const convert = async (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
    const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`;
    const response = await axios.get(BASE_URL);

    if (response.data.result !== "success") {
      return res.status(500).json({
        error: `Exchange rate API error: ${response.data["error-type"]}`,
      });
    }

    const conversionRate = response.data.conversion_rates[to];
    if (!conversionRate) {
      return res.status(400).json({ error: "Unsupported currency code" });
    }

    const convertedAmount = (amount * conversionRate).toFixed(2);

    // Use the utility function to get the country name
    const fromCountry = getCountryFromCurrency(from);
    const toCountry = getCountryFromCurrency(to);

    const transfer = new Transfer({
      fromCountry,
      toCountry,
      transferAmount: amount,
      convertedAmount,
    });

    await transfer.save();

    res.json({ from, to, amount, convertedAmount, rate: conversionRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error or API request failed" });
  }
};

const histories = async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transfer history" });
  }
};

const deleteRecord = async (req, res) => {
  try {
    await Transfer.findByIdAndDelete(req.params.id);
    res.json({ message: "Transfer revoked" });
  } catch (error) {
    res.status(500).json({ error: "Failed to revoke transfer" });
  }
};

module.exports = { convert, histories, deleteRecord };
