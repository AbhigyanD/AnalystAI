// src/components/Dashboard.js
import React, { useState } from 'react';
import InputForm from './InputForm';
import DCFChart from './DCFChart';
import SensitivityTable from './SensitivityTable';
import axios from 'axios';

const Dashboard = () => {
  const [dcfData, setDcfData] = useState(null);
  const [sensitivityData, setSensitivityData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = ({ ticker, growthRate, discountRate, forecastPeriod, terminalGrowthRate }) => {
    setError(null);
    // Fetch DCF breakdown
    axios
      .get(`http://127.0.0.1:8000/compute_dcf/${ticker}`, {
        params: { growth_rate: growthRate, discount_rate: discountRate, forecast_period: forecastPeriod, terminal_growth_rate: terminalGrowthRate }
      })
      .then((response) => {
        setDcfData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching DCF data', error);
        setError("Failed to fetch DCF data.");
      });

    // Fetch Sensitivity analysis
    axios
      .get(`http://127.0.0.1:8000/sensitivity_dcf/${ticker}`)
      .then((response) => {
        setSensitivityData(response.data.sensitivity_analysis);
      })
      .catch((error) => {
        console.error('Error fetching sensitivity data', error);
        setError("Failed to fetch sensitivity analysis.");
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MyGPT Financial Analysis Dashboard</h1>
      <InputForm onSubmit={handleSubmit} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {dcfData && (
        <div style={{ marginTop: '20px' }}>
          <h2>
            Intrinsic Value: $
            {Number(dcfData.intrinsic_value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h2>
          <DCFChart breakdown={dcfData.yearly_breakdown} />
        </div>
      )}
      {sensitivityData && (
        <div style={{ marginTop: '20px' }}>
          <SensitivityTable data={sensitivityData} />
        </div>
      )}
      {/* Debugging: display raw data */}
      {dcfData && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Raw DCF Data (for debugging):</h3>
          <pre>{JSON.stringify(dcfData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
