// src/components/DCFChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const DCFChart = ({ breakdown }) => {
  if (!breakdown || breakdown.length === 0) return <p>No chart data available.</p>;

  const chartData = {
    labels: breakdown.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Projected FCF',
        data: breakdown.map(item => item.projected_fcf),
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'Present Value',
        data: breakdown.map(item => item.present_value),
        borderColor: 'green',
        fill: false,
      },
    ],
  };

  return (
    <div style={{ width: '80%', margin: 'auto' }}>
      <h3>DCF Projection Chart</h3>
      <Line data={chartData} />
    </div>
  );
};

export default DCFChart;
