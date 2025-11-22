import { useEffect, useRef } from "react";
import { 
  Chart, 
  BarController, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Title, 
  Legend, 
  Tooltip 
} from "chart.js";
import { getHook } from "../hooks/getHook";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip);

export default function IncomeExpensesChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data } = getHook<any>("/report/financiero/expensesVsIncome");

  const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  const currentMonth = new Date().getMonth() + 1; // Enero = 1

  useEffect(() => {
    if (!data || !chartRef.current) return;

    // 🔍 Filtramos solo los 3 meses anteriores y posteriores al actual
    const filteredData = data.filter((item: any) => {
      const diff = item.month - currentMonth;
      return diff >= -3 && diff <= 3;
    });

    // 🔄 Destruir gráfico previo si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: filteredData.map((item: any) => monthNames[item.month - 1]),
        datasets: [
          {
            label: "Ingresos",
            data: filteredData.map((item: any) => item.income),
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
          {
            label: "Gastos",
            data: filteredData.map((item: any) => item.expense),
            backgroundColor: "rgba(255, 99, 132, 0.7)",
          },
        ],
      },
      options: {
        responsive: true, // 👈 se ajusta automáticamente al contenedor
        maintainAspectRatio: false, // 👈 permite usar toda la altura del contenedor
        plugins: {
          title: {
            display: true,
            text: "Comparación de Ingresos vs Gastos (últimos y próximos 3 meses)",
            font: { size: 16 },
          },
          legend: { position: "top" },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          y: { 
            beginAtZero: true, 
            title: { display: true, text: "Monto (Bs)" } 
          },
          x: { 
            title: { display: true, text: "Meses" } 
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
