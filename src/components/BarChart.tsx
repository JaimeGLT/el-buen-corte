// src/components/BarChart.jsx
import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title } from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title);

export default function BarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
        datasets: [{
          label: "Ventas",
          data: [120, 150, 180, 90, 200],
          backgroundColor: "rgba(54, 162, 235, 0.7)"
        }]
      },
      options: { responsive: true }
    });
  }, []);

  return <canvas ref={chartRef}></canvas>;
}
