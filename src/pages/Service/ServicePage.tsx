import { useEffect, useState } from 'react'
import PageComponent from '../../components/PageComponent'
import type { Service } from '../../types/Service'
import { Clock } from 'lucide-react'
import { getHook } from '../../hooks/getHook'
import Modal from '../../components/Modal'
import { CreateServiceModal } from './CreateServiceModal'
import { EditServiceModal } from './EditServiceModal'
import axiosApi from '../../utlis/axiosApi'

const ServicePage = () => {

    const [ modalState, setModalState ] = useState<boolean>(false);
    const [ editModalState, setEditModalState ] = useState<boolean>(false);
    const [ serviceId, setServiceId ] = useState<number>();
    const [ selectedService, setSelectedService ] = useState<Service | null>(null);

    // trae todos los servicios
    const { data, loading } = getHook("/service");
    
    // reportes de los servicios
    const { data: reports } = getHook("/service/reports");
    
    const reportsChangedProps = [
        {
            title: "Total Servicios",
            quantity: reports?.data?.totalActiveServices || 0,
            detail: "Servicios activos"
        },
        {
            title: "Servicios/Mes",
            quantity: reports?.data?.servicesThisMonth || 0,
            detail: "Este mes"
        },
        {
            title: "Ingresos/Mes",
            quantity: "Bs " + (reports?.data?.totalIncomeThisMonth || 0),
            detail: "Por servicios"
        },
        {
            title: "Precio Promedio",
            quantity: "Bs " + (reports?.data?.averagePricePerService || 0),
            detail: "Por servicio"
        },
    ]

        useEffect(() => {
        if (!serviceId) return;

        const fetchService = async () => {
            try {
                const response = await axiosApi(`/service/${serviceId}`);
                setSelectedService(response.data);
            } catch (err) {
                console.error("Error al obtener servicio por ID:", err);
            }
        };

        fetchService();
    }, [serviceId]);

    return (
        <PageComponent 
            contentButton='+ Nuevo Servicio'
            title='Catálogo de Servicios' 
            description='Administra los servicios que ofreces'
            reports={reportsChangedProps}
            modalSetState={setModalState}
            modalState={modalState}
        >
            {/* modal formulario */}
            <Modal 
                title="Registrar Nuevo Servicio" 
                description="Completa los datos del nuevo servicio" 
                modalState={modalState} 
                setModalState={setModalState} 
            >
                <CreateServiceModal 
                    modalState={modalState}
                    setModalState={setModalState}
                />
            </Modal>

            <Modal
                key={serviceId}
                title="Editar Servicio" 
                description="Modifica los datos del servicio" 
                modalState={editModalState} 
                setModalState={setEditModalState} 
            >
                <EditServiceModal   
                    service={selectedService}
                    modalState={editModalState}
                    setModalState={setEditModalState}
                />
            </Modal>

            <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 my-5">
                {
                    data?.data?.map((item: Service) => {

                        return <div key={item?.id} 
                            className='border border-border-input p-5 gap-5 flex flex-col rounded-xl text-[#68606a] relative'
                        >
                            {
                                !item?.active ? <p className='w-full top-0 left-0 h-1 rounded-xl absolute bg-red-500'></p> : ""
                            }
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
                                    <p className='flex gap-2 text-primary-bg text-2xl items-center font-bold'>Bs {item?.price}</p>
                                    <p className='flex gap-2 text-base items-center'><Clock className='size-4'/>{item?.duration} min</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='flex justify-between'>Popularidad <span className='font-medium'>{item?.popularityPercentage}%</span></p>
                                    <div className='w-full h-2 rounded-full overflow-hidden relative'>
                                        {/* Fondo suave (siempre al 100%) */}
                                        <div className='absolute top-0 left-0 w-full h-full bg-[#ef4b6618]' /> 

                                        {/* Barra de progreso */}
                                        <div
                                            className='absolute top-0 left-0 h-full bg-primary-bg transition-all duration-500'
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
                                <button className='border border-gray-300 rounded-xl w-full py-1 hover:bg-[#d6ceff] cursor-pointer'
                                    onClick={() => {
                                        setServiceId(item?.id)   
                                        setEditModalState(true)
                                    }}
                                >Editar</button>
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