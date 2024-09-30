import React, { useEffect } from "react";
import { init, dispose } from "klinecharts";

const CandlestickChart = ({ data }) => {
  useEffect(() => {
    const chart = init("chart");

    // Apply initial or updated data
    if (data.length > 0) {
      chart.applyNewData(data);
    }

    // Clean up the chart when the component is unmounted
    return () => {
      dispose("chart");
    };
  }, [data]); // Re-run the effect when 'data' changes

  return <div id="chart" style={{ width: "100%", height: "600px" }} />;
};

export default CandlestickChart;
