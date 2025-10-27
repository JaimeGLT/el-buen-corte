// src/components/IncomeExpensesTrendChart.tsx
import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";
import { getHook } from "../hooks/getHook";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

export default function IncomeExpensesTrendChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data } = getHook("/report/financiero/expensesVsIncome");

  const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  useEffect(() => {
    if (!data?.data || !chartRef.current) return;

    // Destruir chart previo si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.data.map((item: any) => monthNames[item.month - 1]),
        datasets: [
          {
            label: "Ingresos",
            data: data.data.map((item: any) => item.income),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4, // suaviza la línea
          },
          // {
          //   label: "Gastos",
          //   data: data.data.map((item: any) => item.expense),
          //   borderColor: "rgba(255, 99, 132, 1)",
          //   backgroundColor: "rgba(255, 99, 132, 0.2)",
          //   fill: true,
          //   tension: 0.4,
          // },
        ],
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: "Tendencia de Ingresos vs Gastos",
            font: { size: 18 },
          },
          legend: {
            position: "top",
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Monto (Bs)" },
          },
          x: {
            title: { display: true, text: "Meses" },
          },
        },
      },
    });
  }, [data]);

  return <div style={{ width: "700px", height: "400px" }}><canvas width={500} height={400} ref={chartRef}></canvas></div>;
}
