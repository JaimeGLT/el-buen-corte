import { useEffect, useRef, useState } from 'react'
import PageComponent from '../../components/PageComponent'
import MyChart from '../../components/MyChart';
import PieChart from '../../components/PieChart';
import IncomeExpensesChart from '../../components/IncomeExpensesChart';
import { DollarSign, Package, Scissors, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { getHook } from '../../hooks/getHook';
import DaysChart from '../../components/DaysChart';
import axiosApi from '../../utlis/axiosApi';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image-more';

const ReportPage = () => {

    const [ selectedView, setSelectedView ] = useState<"financiero" | "servicios" | "clientes" | "resumen">("financiero");
    const [ selectedFilter, setSelectedFilter ] = useState<"semanal" | "mensual" | "anual">("mensual");
    const [ filterData, setFilterData ] = useState<any>([]);
    const [ reportsClients, setReportsClients ] = useState<any>([]);

    const { data: monthReport } = getHook("/report/financiero/month");
    const { data: allClients } = getHook("/report/client/all");
    const { data: servciveTotalReport } = getHook("/report/service/total_services");
    const { data: resumen } = getHook("/report/resumen");
    console.log(resumen);


    const date = new Date();
    const month = date.toLocaleString('es-ES', {month: 'long'})
    const year = date.getFullYear()
    
    useEffect(() => {
        const getFilter = async () => {
            try {
                let endpoint = "";
                if (selectedFilter === "semanal") endpoint = "/report/financiero/week";
                else if (selectedFilter === "mensual") endpoint = "/report/financiero/month";
                else endpoint = "/report/financiero/year";

                const response = await axiosApi(endpoint);
                const earnings = response?.data?.earnings || 0;
                const netProfit = response?.data?.netProfit || 0;
                const margin = earnings > 0 ? ((netProfit / earnings) * 100).toFixed(2) : 0;

                const reportsFiltered = [
                    { title: "Ingresos", quantity: "Bs " + response?.data?.earnings, detail: "Total Ingresos" },
                    { title: "Ganancia Neta", quantity: "Bs " + response?.data?.netProfit, detail: "Margen: " + margin + "%" },
                    { title: "Citas", quantity: response?.data?.totalAppointments || 0, detail: "Total citas" },
                    { title: "Ticket Promedio", quantity: "Bs " + response?.data?.averageTicket, detail: "Por cita" },
                ];

                setFilterData(reportsFiltered);
            } catch (error) {
                console.log(error);
            }
        };

        getFilter();
    }, [selectedFilter]); 

    useEffect(() => {
    const getFilter = async () => {
        try {
            let endpoint = "";
            if (selectedFilter === "semanal") endpoint = "/report/client/general_reports_week";
            else if (selectedFilter === "mensual") endpoint = "/report/client/general_reports_month";
            else endpoint = "/report/client/general_reports_year";

            const response = await axiosApi(endpoint);

            const selectedFilterText = selectedFilter === "semanal" ? "Esta semana" : selectedFilter === "mensual" ? "Este mes" : "Este año"

            const reportsFiltered = [
                { title: "Clientes Totales", quantity: response?.data?.totalClients || 0, detail: "Todos los tiempos" },
                { title: "Nuevos Clientes", quantity: response?.data?.newClients || 0, detail: selectedFilterText},
                { title: "Visitas Totales", quantity: response?.data?.totalVisits || 0, detail: selectedFilterText },
            ];

            setReportsClients(reportsFiltered);
        } catch (error) {
            console.log(error);
        }
    };

    getFilter();
}, [selectedFilter]); 

    const selectOpts = [
        {value: "mensual", name: "Este Mes"},
        {value: "semanal", name: "Esta Semana"},
        {value: "anual", name: "Este Año"}
    ]

    const resumenRef = useRef<HTMLDivElement>(null);

  // Función para exportar a PDF
// SOLUCIÓN PROFESIONAL - PDF de alta calidad generado directamente
// Reemplaza la función exportToPDF con esta versión:

const exportToPDF = async () => {
//   if (selectedView !== "resumen") {
//     alert('Por favor, ve a la pestaña "Resumen" para exportar el PDF');
//     return;
//   }

  if (!resumen?.data) {
    alert('No hay datos disponibles para generar el reporte');
    return;
  }

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 20;

    // Colores
    const primaryColor = [220, 38, 38]; // rojo
    const textColor = [51, 51, 51];
    const lightGray = [107, 114, 128];
    const greenColor = [34, 197, 94];

    // HEADER
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setFontSize(24);
    pdf.setTextColor(...primaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Resumen Ejecutivo', 15, 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(...lightGray);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`, 15, 30);

    yPos = 50;

    // FUNCIÓN PARA SECCIONES
    const addSection = (title: string, icon: string, data: any[], yStart: number) => {
      let y = yStart;
      
      // Título de sección
      pdf.setFontSize(14);
      pdf.setTextColor(...primaryColor);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${icon} ${title}`, 15, y);
      y += 8;

      // Línea divisoria
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.line(15, y, pageWidth - 15, y);
      y += 6;

      // Datos
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      data.forEach((item) => {
        pdf.setTextColor(...textColor);
        pdf.text(item.label, 20, y);
        
        pdf.setFont('helvetica', 'bold');
        if (item.highlight) {
          pdf.setTextColor(...greenColor);
        } else {
          pdf.setTextColor(...textColor);
        }
        pdf.text(item.value, pageWidth - 20, y, { align: 'right' });
        pdf.setFont('helvetica', 'normal');
        
        y += 6;
      });

      return y + 5;
    };

    // SECCIÓN 1: Rendimiento Financiero
    const financialData = [
      { label: 'Ingresos Totales', value: `Bs ${resumen.data.totalIncome}` },
      { label: 'Gastos Totales', value: `Bs ${resumen.data.totalExpenses}` },
      { label: 'Ganancia Neta', value: `Bs ${resumen.data.netProfit}`, highlight: true },
      { label: 'Margen de Ganancia', value: `${resumen.data.profitMargin}%` },
    ];
    yPos = addSection('Rendimiento Financiero', '', financialData, yPos);

    // SECCIÓN 2: Clientes
    const clientsData = [
      { label: 'Clientes Totales', value: `${resumen.data.totalClients}` },
      { label: 'Nuevos Clientes', value: `${resumen.data.newClients}` },
      { label: 'Tasa de Retención', value: `${resumen.data.retentionRate}%` },
      { label: 'Clientes Recurrentes', value: `${resumen.data.recurringClients}` },
    ];
    yPos = addSection('Clientes', '', clientsData, yPos);

    // SECCIÓN 3: Operaciones
    const operationsData = [
      { label: 'Total Citas', value: `${resumen.data.totalAppointments}` },
      { label: 'Ticket Promedio', value: `Bs ${resumen.data.averageTicket}` },
      { label: 'Tasa de Ocupación', value: `${resumen.data.occupancyRate?.toFixed(2)}%` },
      { label: 'Citas Canceladas', value: `${resumen.data.canceledAppointments}` },
    ];
    yPos = addSection('Operaciones', '', operationsData, yPos);

    // SECCIÓN 4: Inventario
    const inventoryData = [
      { label: 'Productos en Stock', value: `${resumen.data.totalProducts}` },
      { label: 'Valor Total', value: `Bs ${resumen.data.totalProductsValue}` },
      { label: 'Stock Bajo', value: `${resumen.data.lowStock} productos` },
      { label: 'Movimientos', value: `${resumen.data.totalMovements}` },
    ];
    yPos = addSection('Inventario', '', inventoryData, yPos);

    // FOOTER
    pdf.setFontSize(8);
    pdf.setTextColor(...lightGray);
    pdf.setFont('helvetica', 'italic');
    const footerText = `Generado el ${new Date().toLocaleDateString('es-BO', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })}`;
    pdf.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Guardar PDF
    const fileName = `Resumen_Ejecutivo_${month}_${year}.pdf`;
    pdf.save(fileName);

    // Mensaje de éxito
    const successToast = document.createElement('div');
    successToast.textContent = '✓ PDF generado exitosamente';
    successToast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-weight:600;';
    document.body.appendChild(successToast);
    setTimeout(() => document.body.removeChild(successToast), 3000);

  } catch (error) {
    console.error('Error al generar PDF:', error);
    alert('Hubo un error al generar el PDF. Por favor intenta nuevamente.');
  }
};

    return (
        <PageComponent
            title='Reportes y Análisis'
            description='Visualiza el rendimiento de tu negocio'
            contentButton='Exportar'
            // modalSetState={() => {}}
            onClick={exportToPDF}
            // modalState={true}
            selectTrue={true}
            selectOpts={selectOpts}
            reports={filterData}
            onFilterChange={(value: "semanal" | "mensual" | "anual") => setSelectedFilter(value)}

        >
            <div className='bg-[#f5f1ea] flex p-1 w-min mt-5 rounded-xl mb-5'>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "financiero" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("financiero")}
                >
                    Financiero
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "servicios" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("servicios")}
                >
                    Servicios
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "clientes" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("clientes")}
                >
                    Clientes
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "resumen" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("resumen")}
                >
                    Resumen
                </button>
            </div>

            {
                selectedView === "financiero" ?
                <>
                    <div className='flex w-full gap-5 mb-5'>
                        <IncomeExpensesChart/>
                        <MyChart />
                    </div>

                    <div className='border border-border-input p-5 rounded-xl gap-4 flex flex-col'>
                        <h2 className='font-semibold mb-4'>Desglose Financiero</h2>

                        <div className='bg-green-50 flex gap-3 border border-green-300 p-3 justify-between items-center rounded-xl'>
                            <div className='flex gap-3'>
                                <div className='bg-green-100 p-1 px-3 flex items-center justify-center rounded-xl'>
                                    <DollarSign className='size-5 text-green-600'/>
                                </div>

                                <div>
                                    <h4 className='font-semibold'>Ingresos Totales</h4>
                                    <p className='text-paragraph'>{month} {year}</p>
                                </div>
                            </div>
                            <div>
                                <span className='text-xl font-bold text-green-600'>Bs {monthReport?.data?.earnings}</span>
                            </div>
                        </div>

                        <div className='bg-red-50 flex gap-3 border border-red-300 p-3 justify-between items-center rounded-xl'>
                            <div className='flex gap-3'>
                                <div className='bg-red-100 p-1 px-3 flex items-center justify-center rounded-xl'>
                                    <TrendingDown className='size-5 text-red-600'/>
                                </div>

                                <div>
                                    <h4 className='font-semibold'>Gastos Totales</h4>
                                    <p className='text-paragraph'>{month} {year}</p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                                <span className='text-xl font-semibold text-end text-red-600'>Bs {monthReport?.data?.expenses}</span>
                                <span className='text-xs text-paragraph text-end'>total % de ingresos</span>
                            </div>
                        </div>

                        <div className='bg-blue-50 flex gap-3 border border-blue-300 p-3 justify-between items-center rounded-xl'>
                            <div className='flex gap-3'>
                                <div className='bg-blue-100 p-1 px-3 flex items-center justify-center rounded-xl'>
                                    <TrendingUp className='size-5 text-blue-600'/>
                                </div>

                                <div>
                                    <h4 className='font-semibold'>Ganancia Neta</h4>
                                    <p className='text-paragraph'>{month} {year}</p>
                                </div>
                            </div>
                            <div className='flex flex-col justify-center'>
                                <span className='text-xl font-semibold text-end text-blue-600'>Bs {monthReport?.data?.netProfit}</span>
                                <span className='text-xs text-paragraph text-end'>total % de ingresos</span>
                            </div>
                        </div>

                        
                    </div>
                </> : selectedView === "servicios"  ? <>
                    <div className='flex w-full gap-5 mb-5'>
                        <PieChart 
                            servciveTotalReport={servciveTotalReport}
                        />
                        <DaysChart 
                            
                        />
                    </div>
                    
                    <div className='flex gap-3 flex-col p-5 border border-border-input rounded-xl'>
                        <h2  className='font-semibold mb-3'>Servicios Más Populares</h2>

                        {
                            servciveTotalReport?.data?.map((item: any, index: number) => {
                                const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
                                return (
                                    <div key={index} className='flex gap-3 w-full'>
                                        <div className='flex w-[85%] gap-4'>
                                            <div className='bg-pink-100 text-primary-bg flex items-center justify-center rounded-full p-3 size-6'>
                                                <span className='font-semibold text-center'>{index + 1}</span>
                                            </div>

                                            <div className='flex w-full flex-col'>
                                                <div className='flex items-center justify-between w-full gap-2 mb-1'>
                                                    <h3 className='font-semibold text-sm'>{item?.serviceName}</h3>
                                                    <p className='font-semibold text-sm'>{Math.round(item?.percentage)}%</p>
                                                </div>
                                                <div className='bg-[#9994] h-1.5 w-full rounded-xl'>
                                                    <div className={` h-1.5 rounded-xl`}
                                                        style={{width: item?.percentage+"%", backgroundColor: randomColor,}}
                                                    >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className='font-bold text-sm text-paragraph'>Bs {item?.totalGenerated}</span>
                                            <span className='text-paragraph text-xs'>Ingresos</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    </> : selectedView === "clientes" ? (
                        <>

                        <div className="flex items-center justify-between gap-3 mb-4">
                                {
                                    reportsClients?.map((report: any, index: number) => (
                                        <div key={index} className="border-gray-300 border rounded-xl p-4 gap-3 flex flex-col w-full">
                                            <h3 className="text-base">{report.title}</h3>
                                            <div className="mt-3 flex flex-col gap-1">
                                                <span className="text-2xl font-bold">{report.quantity}</span>
                                                <span className="text-sm">{report.detail}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className='flex flex-col gap-3 border-border-input border rounded-xl p-5'>
                                <h3 className='text-title font-semibold text-base mb-2'>Top Clientes</h3>
                                {
                                    allClients?.data?.map((client: any, i: number) => (
                                        <div key={i} className='p-2 border border-border-input rounded-xl flex justify-between'>
                                            <div className='flex gap-3 w-full items-center'>
                                                <div className='bg-pink-100 p-2 rounded-full size-7 flex items-center justify-center'>
                                                    <span className='text-primary-bg font-semibold text-sm'>{i + 1}</span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <h3 className='text-title font-semibold'>{client?.firstName + " " + client?.lastName}</h3>
                                                    <span className='text-paragraph text-sm'>{client?.totalAppointments} visitas</span>
                                                </div>
                                            </div>

                                            <div className='flex flex-col w-[10%]'>
                                                <span className='font-semibold text-base text-end'>Bs {client?.totalSpent}</span>
                                                <span className='text-xs text-paragraph text-end'>Total gastado</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </>
                    ) :<>
                        <div ref={resumenRef} className='border border-border-input rounded-xl p-5'>
                            <h2 className='font-semibold'>Resumen Ejecutivo - {month[0].toUpperCase()}{month.slice(1)} {year}</h2>
                            <div className='flex w-full gap-8'>
                                 <div className='mt-5 flex flex-col w-full gap-5'>
                                    <div className='w-full'>
                                        <h3 className='font-semibold mb-3 w-full flex items-center gap-2'><DollarSign className='text-red-400 size-5' /> Rendimiento Financiero</h3>

                                        <div className='flex flex-col gap-2 text-paragraph w-full text-sm ml-7'>
                                            <p className='flex justify-between gap-2'>Ingresos Totales: <span className='font-semibold mr-5'>Bs {resumen?.data?.totalIncome}</span></p>
                                            <p className='flex justify-between gap-2'>Gastos Totales: <span className='font-semibold mr-5'>Bs {resumen?.data?.totalExpenses}</span></p>
                                            <p className='flex justify-between gap-2'>Ganancia Neta: <span className='text-green-500 font-semibold mr-5'>Bs {resumen?.data?.netProfit}</span></p>
                                            <p className='flex justify-between gap-2'>Margen de Ganancia: <span className='font-semibold mr-5'> {resumen?.data?.profitMargin}%</span></p>
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <h3 className='font-semibold mb-3 w-full flex items-center gap-2'><Users className='text-red-400 size-5'/> Clientes</h3>

                                        <div className='flex flex-col gap-2 text-paragraph w-full text-sm ml-7'>
                                            <p className='flex justify-between gap-2'>Clientes Totales: <span className='font-semibold mr-5'>{resumen?.data?.totalClients}</span></p>
                                            <p className='flex justify-between gap-2'>Nuevos Clientes: <span className='font-semibold mr-5'>{resumen?.data?.newClients}</span></p>
                                            <p className='flex justify-between gap-2'>Tasa de Retención: <span className='font-semibold mr-5'>{resumen?.data?.retentionRate}%</span></p>
                                            <p className='flex justify-between gap-2'>Clientes Recurrentes: <span className='font-semibold mr-5'>{resumen?.data?.recurringClients}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className='mt-5 flex flex-col w-full gap-5'>
                                    <div className='w-full'>
                                        <h3 className='font-semibold mb-3 w-full flex items-center gap-2'><Scissors className='text-red-400 size-5'/> Operaciones</h3>

                                        <div className='flex flex-col gap-2 text-paragraph w-full text-sm ml-7'>
                                            <p className='flex justify-between gap-2'>Total Citas: <span className='font-semibold mr-5'>{resumen?.data?.totalAppointments}</span></p>
                                            <p className='flex justify-between gap-2'>Ticket Promedio: <span className='font-semibold mr-5'>Bs {resumen?.data?.averageTicket}</span></p>
                                            <p className='flex justify-between gap-2'>Tasa de Ocupación: <span className='font-semibold mr-5'>{resumen?.data?.occupancyRate?.toFixed(2)}%</span></p>
                                            <p className='flex justify-between gap-2'>Citas Canceladas: <span className='font-semibold mr-5'> {resumen?.data?.canceledAppointments}</span></p>
                                        </div>
                                    </div>
                                    <div className='w-full'>
                                        <h3 className='font-semibold mb-3 w-full flex items-center gap-2'><Package className='text-red-400 size-5'/>Inventario</h3>

                                        <div className='flex flex-col gap-2 text-paragraph w-full text-sm ml-7'>
                                            <p className='flex justify-between gap-2'>Productos en Stock: <span className='font-semibold mr-5'>{resumen?.data?.totalProducts}</span></p>
                                            <p className='flex justify-between gap-2'>Valor Total: <span className='font-semibold mr-5'>Bs {resumen?.data?.totalProductsValue}</span></p>
                                            <p className='flex justify-between gap-2'>Stock Bajo: <span className='font-semibold text-red-500 mr-5'>{resumen?.data?.lowStock} productos</span></p>
                                            <p className='flex justify-between gap-2'>Movimientos: <span className='font-semibold mr-5'>{resumen?.data?.totalMovements}%</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            </div>
                    </>
            } 
        </PageComponent>
    )
}

export default ReportPage