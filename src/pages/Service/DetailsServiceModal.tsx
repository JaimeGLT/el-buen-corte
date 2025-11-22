import { getHook } from '../../hooks/getHook';
import type { Service } from '../../types/Service';
import { ScissorsLoader } from '../../components/ScissorsLoader';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    id: number | undefined;
}

export const DetailsServiceModal = ({ setModalState, id }: ModalServiceProps) => {

    const { data: service, loading } = getHook<Service>(`/service/${id}`);
    console.log(service);
    
    return (
        <>
        {
            loading ?
                <div className='flex w-full h-full items-center justify-center'>
                    <ScissorsLoader />
                </div> 
            : <div className='flex flex-col gap-3 w-full'>
                <div className='flex flex-col gap-2 rounded-2xl border border-border-input p-2'>
                    <h3 className='font-semibold text-title'>Nombre del Servicio</h3>
                    <span className='text-paragraph'>{service?.name}</span>
                </div>

                <div className='flex flex-col gap-2 rounded-2xl border border-border-input p-2'>
                    <p className='font-semibold text-title'>Descripción</p>
                    <p className='text-paragraph'>{service?.description}</p>
                </div>

                <div className='flex gap-2 '>
                    <div className='w-1/2 rounded-2xl border border-border-input p-2'>
                        <p className='font-semibold text-title'>Tipo de Servicio</p>
                        <span className='text-paragraph'>{service?.type}</span>
                    </div>
                    <div className='w-1/2 rounded-2xl border border-border-input p-2'>
                        <p className='font-semibold text-title'>Precio</p>
                        <span className='text-paragraph'>{service?.price} Bs</span>
                    </div>

                </div>
                <div className='flex gap-2 '>
                    <div className='w-1/2 rounded-2xl border border-border-input p-2'>
                        <p className='font-semibold text-title'>Dinero generado</p>
                        <span>{service?.incomeGenerated} Bs</span>
                    </div>
                    <div className='w-1/2 rounded-2xl border border-border-input p-2'>
                        <p className='font-semibold text-title'>Estado</p>
                        <span className='text-paragraph'>{service?.active ? "Activo" : "Inactivo"}</span>
                    </div>

                </div>

                <div className='flex gap-2'>
                    <div className='w-1/2 rounded-2xl border border-border-input p-2'>
                        <p className='font-semibold text-title'>Servicios este Mes</p>
                        <span className='text-paragraph'>{service?.servicesThisMonth}</span>
                    </div>

                    <div className='w-1/2 rounded-2xl border border-border-input p-2'>
                        <p className='font-semibold text-title'>Duración</p>
                        <span className='text-paragraph'>{service?.duration} min</span>
                    </div>
                </div>
                <div className='flex text-end items-end justify-end '>
                    <button className='w-fit border border-gray-300 rounded-xl  py-1 hover:bg-[#d6ceff] px-3 py-1 cursor-pointer'
                        onClick={() => setModalState(false)}
                    >Cerrar</button>
                </div>
            </div>
        
        }
        </>
    )
}
