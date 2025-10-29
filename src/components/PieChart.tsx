import { useEffect, useRef } from "react";
import { Chart, PieController, ArcElement, Title } from "chart.js";

Chart.register(PieController, ArcElement, Title);

interface PieCharProps {
  servciveTotalReport: any;
}

export default function PieChart({ servciveTotalReport }: PieCharProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destruir gráfico anterior si existe (evita duplicados)
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx!, {
      type: "pie",
      data: {
        labels: servciveTotalReport?.data?.map((item: any) => item?.serviceName),
        datasets: [
          {
            label: "Ingresos totales",
            data: servciveTotalReport?.data?.map((item: any) => item?.totalGenerated),
            backgroundColor: servciveTotalReport?.data?.map(
              () =>
                `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)` 
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
         plugins: {
      title: {
        display: true,
        text: "Distribución de Servicios", 
        font: { size: 16, weight: "bold" },
        color: "#333",
      },
      legend: {
        position: "right", 
        labels: {
          boxWidth: 20,
          padding: 15,
          font: { size: 12 },
        },
      },
    },
      },
    });
  }, [servciveTotalReport]);

  return (
    <div className="w-[50%] h-[400px] flex items-center justify-center border border-border-input p-3 rounded-xl">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
