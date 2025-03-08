import { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Select, MenuItem, Switch } from "@mui/material";

const Test = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("LKR");
  const [amount, setAmount] = useState("");
  const [converted, setConverted] = useState(null);
  const [history, setHistory] = useState([]);
  const [showTransfers, setShowTransfers] = useState(false)

  const handleConvert = async () => {
    const response = await axios.post(
      "http://localhost:9000/api/transfers/convert",
      { from, to, amount }
    );
    setConverted(response.data.convertedAmount);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const response = await axios.get(
      "http://localhost:9000/api/transfers/history"
    );
    setHistory(response.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRevoke = async (id) => {
    await axios.delete(`http://localhost:9000/api/transfers/revoke/${id}`);
    fetchHistory();
  };

  const handleSwitchChange = (event) => {
    setShowTransfers(event.target.checked)
  }

  return (
    <div class="d-flex w-100 ">
        <div>
      <h1>Currency Converter</h1>
      <Select value={from} onChange={(e) => setFrom(e.target.value)}>
        <MenuItem value="USD">USA (USD)</MenuItem>
        <MenuItem value="LKR">Sri Lanka (LKR)</MenuItem>
        <MenuItem value="AUD">Australia (AUD)</MenuItem>
        <MenuItem value="INR">India (INR)</MenuItem>
      </Select>
      <Select value={to} onChange={(e) => setTo(e.target.value)}>
        <MenuItem value="USD">USA (USD)</MenuItem>
        <MenuItem value="LKR">Sri Lanka (LKR)</MenuItem>
        <MenuItem value="AUD">Australia (AUD)</MenuItem>
        <MenuItem value="INR">India (INR)</MenuItem>
      </Select>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={handleConvert}>Convert</Button>
      {converted && <h2>Converted Amount: {converted}</h2>} </div>
<div>
      <h2>Transfer History</h2><Switch checked = {showTransfers} onChange={handleSwitchChange}/>
      {showTransfers?history.map((record) => (
        <div key={record._id}>
          <p>
            {record.fromCountry} → {record.toCountry}: {record.transferAmount} →{" "}
            {record.convertedAmount}
          </p>
          <Button onClick={() => handleRevoke(record._id)}>Revoke</Button>
        </div>
      )): null}</div>
    </div>
  );
};

export default Test;
