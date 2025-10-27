import { useEffect, useState } from 'react'
import PageComponent from '../../components/PageComponent'
import ListPageComponent from '../../components/ListPageComponent';
import { getHook } from '../../hooks/getHook';
import type { AppointmentType } from './AppointmentType';
import { Clock, Scissors, User } from 'lucide-react';
import { convertDate, parseDurationToMinutes } from '../../utlis/parseDuration';
import { getStateColor, getStateName } from '../../utlis/getState';
import Modal from '../../components/Modal';
import { EditAppointmentModal } from './EditAppointmentModal';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import { CreateAppointmentModal } from './CreateAppointmentModal';

const AppointmentPage = () => {

    const [ createNewAppoint, setCreateNewAppoint ] = useState<boolean>(false);
    const [ editNewAppoint, setEditNewAppoint ] = useState<boolean>(false);
    const [ selectedAppointment, setSelectedAppointment ] = useState<AppointmentType>();
    const [ appointmentId, setAppointmentId ] = useState<number>();


    const selectOpts = [
        {
            value: "all",
            name: "Todas las citas"
        },
        {
            value: "CONFIRMADO",
            name: "Confirmadas"
        },
        {
            value: "PENDIENTE",
            name: "Pendientes"
        },
        {
            value: "CANCELADO",
            name: "Cancelados"
        },
        {
            value: "COMPLETADO",
            name: "Completadas"
        }
    ]

    const { data, loading, error } = getHook("/cita");
    console.log(data.data);


    useEffect(() => {
        if (!appointmentId) return;

        const fetchService = async () => {
            try {
                const response = await axiosApi(`/cita/${appointmentId}`);
                setSelectedAppointment(response.data);
            } catch (err) {
                console.error("Error al obtener la cita por ID:", err);
            }
        };

        fetchService();
    }, [appointmentId]);
    
    const cancelAppointment = async (id: number) => {
        try {
            await axiosApi.patch(`/cita/${id}/cancel`);
            toast.success("Cita cancelada correctamente.");
            
        } catch (error) {
            toast.error("No se pudo cancelar la cita.");
        }
    }

    return (
        <PageComponent
            title='Gestión de Citas'
            description='Administra y programa las citas de tus clientes'  
            contentButton='+ Nueva Cita' 
            modalSetState={setCreateNewAppoint}
            modalState={createNewAppoint}
        >

            <Modal
                title='Editar Cita'
                description='Modifica los datos de la cita existente'
                modalState={editNewAppoint}
                setModalState={setEditNewAppoint}
            >
                <EditAppointmentModal 
                    appointment={selectedAppointment}
                    modalState={editNewAppoint}
                    setModalState={setEditNewAppoint}
                />
            </Modal>

            <Modal
                title='Registrar Nueva Cita'
                description='Completa los datos para agendar una nueva cita'
                modalState={createNewAppoint}
                setModalState={setCreateNewAppoint}
            >
                <CreateAppointmentModal
                    modalState={createNewAppoint}
                    setModalState={setCreateNewAppoint}
                />
            </Modal>

            <ListPageComponent
                searcher={true}
                selectOpt={selectOpts}
                select={true}
                placeholder='Buscar por cliente, servicio o estilista...'
            >
                <div className='p-5 border-border-input border rounded-xl'>
                    {
                        data?.data?.map((cita: AppointmentType) => {

                            const getStatusName = getStateName(cita.status);
                            const getStatusColor = getStateColor(cita.status)

                            return <div key={cita?.id} className='flex items-center justify-between text-paragraph border border-border-input rounded-xl'>
                                <div className='flex p-4 gap-5'>
                                    <div className='bg-[#f5f1ea] px-5 flex flex-col p-3 py-7 rounded-xl items-center justify-center'>
                                        <span className='text-xs text-title'>{convertDate(cita.date)}</span>
                                        <span className='font-semibold'>{cita.time.slice(0,5)}</span>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-semibold text-base'>{cita.client.firstName + " " + cita.client.lastName}</h3>
                                        <span>{cita.client.phoneNumber}</span>
                                        <div className='flex gap-4 items-center'>
                                            <p className='flex text-sm items-center gap-1'><Scissors className='size-4'/> {cita.service.name}</p>
                                            <p className='flex text-sm items-center gap-1'><User className='size-4'/> {cita.stylist?.firstName + " " + cita.stylist?.lastName}</p>
                                            <p className='flex text-sm items-center gap-1'><Clock className='size-4'/> {parseDurationToMinutes(cita.service.duration)} min</p>
                                        </div>
                                        <p className='text-sm italic'>{cita.notes}</p>
                                    </div>

                                </div>

                                <div className='flex items-center justify-end gap-3 mr-3'>
                                    <span className={getStatusColor}>{getStatusName}</span>
                                    <button className='border border-border-input p-1 px-3 rounded-xl cursor-pointer hover:bg-hover-bg' 
                                    onClick={() => {
                                        setAppointmentId(cita.id)
                                        setEditNewAppoint(true)
                                    }}>Editar</button>
                                    <button 
                                        className='border border-border-input p-1 px-3 rounded-xl cursor-pointer hover:bg-hover-bg'
                                        onClick={() => cancelAppointment(cita.id)}
                                    >Cancelar</button>
                                </div>
                            </div>

                        })
                    }
                </div>
            </ListPageComponent>

        </PageComponent>
    )
}

export default AppointmentPage