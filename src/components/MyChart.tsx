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
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    if (!data?.data || !chartRef.current) return;

    const filteredData = data.data.filter((item: any) => {
      const diff = item.month - currentMonth;
      return diff >= -3 && diff <= 3;
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: filteredData.map((item: any) => monthNames[item.month - 1]),
        datasets: [
          {
            label: "Ingresos",
            data: filteredData.map((item: any) => item.income),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Gastos",
            data: filteredData.map((item: any) => item.expense),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 👈 Esto permite usar la altura del contenedor
        plugins: {
          title: {
            display: true,
            text: "Tendencia de Ingresos (últimos y próximos 3 meses)",
            font: { size: 16 },
          },
          legend: { position: "top" },
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

  return (
    <div className="w-[50%] h-[400px] flex items-center justify-center border border-border-input rounded-xl p-3">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
