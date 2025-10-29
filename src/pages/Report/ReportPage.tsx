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

const ReportPage = () => {

    const [ selectedView, setSelectedView ] = useState<"financiero" | "servicios" | "clientes" | "resumen">("financiero");

    const { data: monthReport } = getHook("/report/financiero/month");
    const { data: servciveTotalReport } = getHook("/report/service/total_services");
    
    const date = new Date();
    const month = date.toLocaleString('es-ES', {month: 'long'})
    const year = date.getFullYear()
    
    // useEffect(() => {
    //     if() {
            
    //     }
    // }, [selectedView])

    return (
        <PageComponent
            title='Reportes y Análisis'
            description='Visualiza el rendimiento de tu negocio'
            contentButton='Exportar'
            modalSetState={() => {}}
            modalState={true}

        >
            <div className='bg-[#f5f1ea] flex p-1 w-min mt-5 rounded-xl'>
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

            <ListPageComponent
                searcher={false}
                select={false}
            >
                a
            </ListPageComponent>
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
                </> : <>
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
                    </>
            } 
        </PageComponent>
    )
}

export default ReportPage