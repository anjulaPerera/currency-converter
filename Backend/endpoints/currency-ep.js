import Transfer from "../models/Transfer";

  export function convert(){
    async (req, res) => {
      const { from, to, amount } = req.body;
    
      if (!from || !to || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }
    
      try {
        // Fetch latest exchange rates
        const response = await axios.get(`${BASE_URL}/${from}`);
    
        if (response.data.result !== "success") {
          return res
            .status(500)
            .json({
              error: `Exchange rate API error: ${response.data["error-type"]}`,
            });
        }
    
        // Extract conversion rate
        const conversionRate = response.data.conversion_rates[to];
        if (!conversionRate) {
          return res.status(400).json({ error: "Unsupported currency code" });
        }
    
        // Calculate converted amount
        const convertedAmount = (amount * conversionRate).toFixed(2);
    
        // Save transfer to DB
        const transfer = new Transfer({
          fromCountry: from,
          toCountry: to,
          transferAmount: amount,
          convertedAmount,
        });
        await transfer.save();
    
        res.json({ from, to, amount, convertedAmount, rate: conversionRate });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error or API request failed" });
      }
    }
  }

  export function histories(){
    async (req, res) => {
      try {
        const transfers = await Transfer.find();
        res.json(transfers);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch transfer history" });
      }
    }
  }

  export function deleteRecord(){
    async (req, res) => {
      try {
        await Transfer.findByIdAndDelete(req.params.id);
        res.json({ message: "Transfer revoked" });
      } catch (error) {
        res.status(500).json({ error: "Failed to revoke transfer" });
      }
    };
  }
 