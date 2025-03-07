const getCountryFromCurrency = (currencyCode) => {
  const currencyCountryMap = {
    USD: "USA",
    LKR: "Sri Lanka",
    AUD: "Australia",
    INR: "India",
  };

  return currencyCountryMap[currencyCode] || "Unknown Country";
};

module.exports = getCountryFromCurrency;
