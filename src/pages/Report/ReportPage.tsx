import React, { useEffect, useState } from 'react'
import PageComponent from '../../components/PageComponent'
import MyChart from '../../components/MyChart';
import ListPageComponent from '../../components/ListPageComponent';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import PieChart from '../../components/PieChart';
import IncomeExpensesChart from '../../components/IncomeExpensesChart';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { getHook } from '../../hooks/getHook';
import DaysChart from '../../components/DaysChart';
import axiosApi from '../../utlis/axiosApi';

const ReportPage = () => {

    const [ selectedView, setSelectedView ] = useState<"financiero" | "servicios" | "clientes" | "resumen">("financiero");
    const [ selectedFilter, setSelectedFilter ] = useState<"semanal" | "mensual" | "anual">("mensual");
    const [ filterData, setFilterData ] = useState<any>([]);
    const [ reportsClients, setReportsClients ] = useState<any>([]);

    const { data: monthReport } = getHook("/report/financiero/month");
    const { data: allClients } = getHook("/report/client/all");
    const { data: servciveTotalReport } = getHook("/report/service/total_services");
    
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

    return (
        <PageComponent
            title='Reportes y Análisis'
            description='Visualiza el rendimiento de tu negocio'
            contentButton='Exportar'
            modalSetState={() => {}}
            modalState={true}
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
                    ) :<></>
            } 
        </PageComponent>
    )
}

export default ReportPage