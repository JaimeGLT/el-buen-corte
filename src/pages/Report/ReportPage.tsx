import React, { useState } from 'react'
import PageComponent from '../../components/PageComponent'
import MyChart from '../../components/MyChart';
import ListPageComponent from '../../components/ListPageComponent';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import PieChart from '../../components/PieChart';
import IncomeExpensesChart from '../../components/IncomeExpensesChart';

const ReportPage = () => {

    const [ selectedView, setSelectedView ] = useState<"financiero" | "servicios" | "clientes" | "resumen">("financiero");

    return (
        <PageComponent
            title='Reportes y Análisis'
            description='Visualiza el rendimiento de tu negocio'
            contentButton='Exportar'
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

            <ListPageComponent>
                <div className='flex w-[400px]'>
                    <IncomeExpensesChart/>
                    <MyChart />
                </div>
            </ListPageComponent>
        </PageComponent>
    )
}

export default ReportPage