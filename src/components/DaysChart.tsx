import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip } from "chart.js";
import { getHook } from "../hooks/getHook";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip);



export default function DaysChart() {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const { data: servciveTotalReport } = getHook("/report/service/total-per-week");

    useEffect(() => {
        if (!servciveTotalReport?.data || !chartRef.current) return; // espera a que los datos existan

        // Si ya hay un chart creado, lo destruimos antes de crear uno nuevo
        if (chartInstance.current) {
        chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
            labels: servciveTotalReport?.data?.map((item: any) => item?.dayName),
            datasets: [
            {
                label: "Citas",
                data: servciveTotalReport.data.map((item: any) => item?.totalCitas),
                backgroundColor: "rgba(75, 192, 192, 0.7)",
            }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            title: {
                display: true,
                text: "Citas por Día",
                font: { size: 18 },
            },
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false },
            },
            scales: {
            y: { beginAtZero: true, title: { display: true, text: "Total citas" } },
            x: { title: { display: true, text: "Días" } },
            },
        },
        });
    }, [servciveTotalReport]); // 🔹 dependemos de 'data'

    return (
        <div className="w-[50%] h-[400px] flex items-center justify-center border border-border-input p-3 rounded-xl">
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
