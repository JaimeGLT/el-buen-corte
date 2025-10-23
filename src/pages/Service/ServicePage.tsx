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
            quantity: "$" + reports?.data?.totalIncomeThisMonth,
            detail: "Por servicios"
        },
        {
            title: "Precio Promedio",
            quantity: "$" + reports?.data?.averagePricePerService,
            detail: "Por servicio"
        },
    ]
    
    return (
        <PageComponent 
            title='Catálogo de Servicios' 
            description='Administra los servicios que ofreces'
            reports={reportsChangedProps}
        >
            <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
                {
                    data?.data?.map((item: Service) => {

                        // const popularity = 

                        return <div key={item?.id} 
                            className='border border-gray-300 p-5 gap-5 flex flex-col'
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
                                    <p className='flex gap-2'><DollarSign /> {item?.price}</p>
                                    <p className='flex gap-2'><Clock />{item?.duration}</p>
                                </div>
                                <div className='flex flex-col'>
                                    <p className='flex justify-between'>Popularidad <span>{item?.popularityPercentage}%</span></p>
                                    <div className='bg-muted'>

                                    </div>
                                </div>

                            </div>

                            <div>
                                <p>Este mes <span>{}</span></p>
                            </div>
                        </div>
})
                }
            </section>

        </PageComponent>
    )
}

export default ServicePage