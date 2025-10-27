// src/components/LineChart.jsx
import { useEffect, useRef } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title } from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);

export default function LineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
        datasets: [{
          label: "Ingresos",
          data: [5000, 7000, 6000, 8000, 9000],
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true
        }]
      },
      options: { responsive: true }
    });
  }, []);

  return <canvas ref={chartRef}></canvas>;
}
