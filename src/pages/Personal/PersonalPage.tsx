import { useState } from 'react'
import PageComponent from '../../components/PageComponent'
import { getHook } from '../../hooks/getHook'
import ListPageComponent from '../../components/ListPageComponent';
import { Clock, User, Mail, Phone } from 'lucide-react'; // Agregados iconos faltantes
import Modal from '../../components/Modal';
import PersonalCreateModal from './PersonalCreateModal';
import type { PersonalType } from './PersonalType';

interface Reports {
    totalPersonal: number;
    totalIncome: number;
    totalAppointments: number;
}

const PersonalPage = () => {

    const [ createPersonal, setCreatePersonal ] = useState<boolean>(false);

    const { data: reports, refetch: refetchReports, loading: loadingReports } = getHook<Reports>("/hairdresser/reports");

    const personalReports = [
        {
            title: "Total Personal",
            quantity: `${reports?.totalPersonal || 0}`,
            detail: "Activos"
        },
        {
            title: "Ingresos Totales",
            quantity: "Bs " + (reports?.totalIncome || 0),
            detail: "Este mes"
        },
        {
            title: "Citas Totales",
            quantity: `${reports?.totalAppointments || 0}`,
            detail: "Este mes"
        }

    ]

    const { data: personal, refetch, loading } = getHook<PersonalType[]>("/hairdresser")
    
    return (
        <PageComponent
            title='Gestión de Personal'
            description='Administra tu equipo de trabajo'
            reports={personalReports}
            contentButton='+ Agregar Personal'
            modalSetState={setCreatePersonal}
            loading={loading || loadingReports}
            modalState={createPersonal}
        >

            <Modal
                modalState={createPersonal}
                setModalState={setCreatePersonal}
                title='Agregar Nuevo Personal'
                description='Registra un nuevo miembro del equipo'
            >
                <PersonalCreateModal
                    modalState={createPersonal}
                    setModalState={setCreatePersonal}
                    refetch={refetch}
                    refetchReports={refetchReports}
                />
            </Modal>
            
            <ListPageComponent
                searcher={false}
                select={false}
            >
                <div className='flex flex-col gap-3'>
                    {
                        !personal?.length ? (
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/resultsNotFound.png" alt="" className="w-1/2 mx-auto"/>
                            </div> 
                        ) : (
                            personal?.map((item: any) => {
                                return (
                                    // CARD CONTAINER
                                    <div key={item?.id} className='bg-white p-4 border border-border-input rounded-xl flex flex-col sm:flex-row gap-4 shadow-sm hover:shadow-md transition-all'>
                                        
                                        <div className="flex items-start gap-4 w-full">
                                            {/* AVATAR: shrink-0 evita que se aplaste */}
                                            <div className='size-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-gray-500'>
                                                <User className='size-6'/>
                                            </div>

                                            {/* INFO CONTAINER: min-w-0 permite que el truncate funcione */}
                                            <div className='flex flex-col gap-1 w-full min-w-0'>
                                                
                                                {/* HEADER */}
                                                <div>
                                                    <h3 className='font-bold text-gray-900 text-lg leading-tight truncate'>
                                                        {item?.firstName} {item?.lastName}
                                                    </h3>
                                                    <span className='text-sm text-gray-500 font-medium capitalize'>
                                                        {item?.hairdresserRole?.toLowerCase()}
                                                    </span>
                                                </div>

                                                {/* CONTACTO: Flex wrap para que baje de línea en móvil */}
                                                <div className='text-sm text-gray-600 flex flex-wrap gap-x-5 gap-y-1 mt-1'>
                                                    <p className="flex items-center gap-1.5 truncate">
                                                        <Mail className="size-3.5"/> {item?.email}
                                                    </p>
                                                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                                                        <Phone className="size-3.5"/> +{item?.phoneNumber}
                                                    </span>
                                                </div>

                                                {/* ESPECIALIDADES: Flex wrap y gap controlado */}
                                                {item?.specialties && item.specialties.length > 0 && (
                                                    <div className='flex flex-wrap gap-2 mt-2'>
                                                        {item.specialties.map((sp: any, idx: number) => (
                                                            <span 
                                                                key={`${item?.id}-spec-${idx}`} 
                                                                className='border border-gray-200 bg-gray-50 px-2 py-0.5 rounded-lg text-xs font-medium text-gray-600'
                                                            >
                                                                {sp}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* HORARIO */}
                                                <p className='flex gap-1.5 items-center text-xs text-gray-500 font-medium mt-2 bg-gray-50 w-fit px-2 py-1 rounded'>
                                                    <Clock className='size-3.5'/> Lun-Sab {item?.workingHoursStart} - {item?.workingHoursFinish}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </ListPageComponent>
        </PageComponent>
    )
}

export default PersonalPage