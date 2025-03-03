import React from 'react';

const SensitivityTable = ({ data }) => {
  if (!data) return <p>No sensitivity data available</p>;

  // Assume data is an object with growth rates as keys mapping to discount rate objects.
  const growthRates = Object.keys(data).sort();
  const discountRates = Object.keys(data[growthRates[0]]).sort();

  return (
    <div>
      <h2>Sensitivity Analysis</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Growth Rate \ Discount Rate</th>
            {discountRates.map(dRate => (
              <th key={dRate}>{dRate}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {growthRates.map(gRate => (
            <tr key={gRate}>
              <td>{gRate}</td>
              {discountRates.map(dRate => (
                <td key={dRate}>
                  {data[gRate][dRate] ? data[gRate][dRate].toLocaleString() : 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensitivityTable;
