// src/components/InputForm.js
import React, { useState } from 'react';

const InputForm = ({ onSubmit }) => {
  const [ticker, setTicker] = useState('');
  const [growthRate, setGrowthRate] = useState(0.05);
  const [discountRate, setDiscountRate] = useState(0.1);
  const [forecastPeriod, setForecastPeriod] = useState(5);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState(0.02);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ticker: ticker.toUpperCase(),
      growthRate,
      discountRate,
      forecastPeriod,
      terminalGrowthRate,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>
          Ticker:&nbsp;
          <input 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value)} 
            required 
          />
        </label>
      </div>
      <div>
        <label>
          Growth Rate:&nbsp;
          <input
            type="number"
            step="0.01"
            value={growthRate}
            onChange={(e) => setGrowthRate(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Discount Rate:&nbsp;
          <input
            type="number"
            step="0.01"
            value={discountRate}
            onChange={(e) => setDiscountRate(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Forecast Period (years):&nbsp;
          <input
            type="number"
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Terminal Growth Rate:&nbsp;
          <input
            type="number"
            step="0.01"
            value={terminalGrowthRate}
            onChange={(e) => setTerminalGrowthRate(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>Compute DCF</button>
    </form>
  );
};

export default InputForm;
