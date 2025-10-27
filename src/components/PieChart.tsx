// src/components/PieChart.jsx
import { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Title } from "chart.js";

Chart.register(PieController, ArcElement, Title);

export default function PieChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Producto A", "Producto B", "Producto C"],
        datasets: [{
          label: "Ventas",
          data: [300, 500, 200],
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)"
          ]
        }]
      },
      options: { responsive: true }
    });
  }, []);

  return <canvas ref={chartRef}></canvas>;
}
