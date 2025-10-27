import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip } from "chart.js";
import { getHook } from "../hooks/getHook";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip);

export default function IncomeExpensesChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data } = getHook("/report/financiero/expensesVsIncome");

  const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  useEffect(() => {
    if (!data?.data || !chartRef.current) return; // espera a que los datos existan

    // Si ya hay un chart creado, lo destruimos antes de crear uno nuevo
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.data.map((item: any) => monthNames[item.month - 1]),
        datasets: [
          {
            label: "Ingresos",
            data: data.data.map((item: any) => item.income),
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
          {
            label: "Gastos",
            data: data.data.map((item: any) => item.expense),
            backgroundColor: "rgba(255, 99, 132, 0.7)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Comparación de Ingresos vs Gastos",
            font: { size: 18 },
          },
          legend: { position: "top" },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Monto (Bs)" } },
          x: { title: { display: true, text: "Meses" } },
        },
      },
    });
  }, [data]); // 🔹 dependemos de 'data'

  return (
    <div style={{ width: "800px", height: "400px" }}>
      <canvas width={500} height={400} ref={chartRef}></canvas>
    </div>
  );
}
