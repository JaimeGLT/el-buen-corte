import React from 'react'
import PageComponent from '../../components/PageComponent'
import type { Service } from '../../types/Service'
import { Clock, DollarSign, Scissors } from 'lucide-react'
import { getHook } from '../../hooks/getHook'

const ServicePage = () => {

    const clientReports = [
        {
            title: "Total Clientes",
            quantity: "248",
            detail: "+18 este mes"
        },
        {
            title: "Clientes VIP",
            quantity: "42",
            detail: "17% del total"
        },
        {
            title: "Nuevos (mes)",
            quantity: "18",
            detail: "+25% vs mes anterior"
        },
        {
            title: "Retención",
            quantity: "87%",
            detail: "Clientes recurrentes"
        }
    ]

    const { data, loading, error } = getHook("/service");
    console.log(data.data);
    
    const { data: reports } = getHook("/service/reports");
    console.log(reports?.data);
    
    const reportsChangedProps = [
        {
            title: "Total Servicios",
            quantity: reports?.data?.totalActiveServices,
            detail: "Servicios activos"
        },
        {
            title: "Servicios/Mes",
            quantity: reports?.data?.servicesThisMonth,
            detail: "Este mes"
        },
        {
            title: "Ingresos/Mes",
            quantity: "Bs " + reports?.data?.totalIncomeThisMonth,
            detail: "Por servicios"
        },
        {
            title: "Precio Promedio",
            quantity: "Bs " + reports?.data?.averagePricePerService,
            detail: "Por servicio"
        },
    ]
    
    return (
        <PageComponent 
            contentButton='+ Nuevo Servicio'
            title='Catálogo de Servicios' 
            description='Administra los servicios que ofreces'
            reports={reportsChangedProps}
        >
            <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 my-5">
                {
                    data?.data?.map((item: Service) => {

                        return <div key={item?.id} 
                            className='border border-gray-300 p-5 gap-5 flex flex-col rounded-xl text-[#68606a]'
                        >
                            <div className='flex justify-between'>
                                <div className='flex flex-col'>
                                    <h3 className='font-semibold text-xl'>{item?.name}</h3>
                                    <p className=''>{item?.description}</p>
                                </div>

                                <div>
                                    {item?.type}
                                </div>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className='flex justify-between'>
                                    <p className='flex gap-2 text-[#ef4b67] text-2xl items-center font-bold'>Bs {item?.price}</p>
                                    <p className='flex gap-2 text-base items-center'><Clock className='size-4'/>{item?.duration}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='flex justify-between'>Popularidad <span className='font-medium'>{item?.popularityPercentage}%</span></p>
                                    <div className='w-full h-2 rounded-full overflow-hidden relative'>
                                        {/* Fondo suave (siempre al 100%) */}
                                        <div className='absolute top-0 left-0 w-full h-full bg-[#ef4b6618]' /> 

                                        {/* Barra de progreso */}
                                        <div
                                            className='absolute top-0 left-0 h-full bg-[#ef4b67] transition-all duration-500'
                                            style={{ width: `${item?.popularityPercentage || 0}%` }}
                                        />
                                        </div>

                                </div>

                            </div>

                            <div>
                                <p className='flex justify-between items-center'>Este mes <span className='font-semibold'>{item?.servicesThisMonth ? item?.servicesThisMonth : 0} servicios</span></p>
                                <p className='flex justify-between items-center'>Ingresos <span className='font-semibold'>Bs {item?.incomeGenerated}</span></p>
                            </div>
                            <div className='flex gap-2 mt-2 font-medium'>
                                <button className='border border-gray-300 rounded-xl w-full py-1 hover:bg-[#d6ceff] cursor-pointer'>Editar</button>
                                <button className='border border-gray-300 rounded-xl w-full py-1 hover:bg-[#d6ceff] cursor-pointer'>Ver Detalles</button>
                            </div>
                        </div>
})
                }
            </section>

        </PageComponent>
    )
}

export default ServicePage