import { useState } from 'react';
import PageComponent from '../../components/PageComponent';
import ListPageComponent from '../../components/ListPageComponent';
import { getHook } from '../../hooks/getHook';
import type { AppointmentType } from './AppointmentType';
import { Clock, Scissors, User } from 'lucide-react'; // Iconos extra para UI limpia
import { convertDate, parseDurationToMinutes } from '../../utlis/parseDuration';
import { getStateColor, getStateName } from '../../utlis/getState';
import Modal from '../../components/Modal';
import { EditAppointmentModal } from './EditAppointmentModal';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import { CreateAppointmentModal } from './CreateAppointmentModal';

const AppointmentPage = () => {
    // ESTADO: Centralizado y limpio. Nada de variables sueltas.
    const [modals, setModals] = useState({
        create: false,
        edit: false
    });
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const selectOpts = [
        { value: "all", name: "Todas las citas" },
        { value: "CONFIRMADO", name: "Confirmadas" },
        { value: "PENDIENTE", name: "Pendientes" },
        { value: "CANCELADO", name: "Cancelados" },
        { value: "COMPLETADO", name: "Completadas" }
    ];

    const { data, refetch, loading } = getHook<AppointmentType[]>("/cita");
    
    // Función helper para abrir modales
    const openModal = (type: 'create' | 'edit', id?: number) => {
        if (id) setSelectedId(id);
        setModals(prev => ({ ...prev, [type]: true }));
    };

    const cancelAppointment = async (id: number) => {
        if (!window.confirm("¿Estás seguro de cancelar esta cita?")) return;
        
        try {
            await axiosApi.patch(`/cita/${id}/cancel`);
            refetch();
            toast.success("Cita cancelada correctamente.");
        } catch (error) {
            toast.error("No se pudo cancelar la cita.");
        }
    };

    return (
        <PageComponent
            title='Gestión de Citas'
            description='Administra y programa las citas de tus clientes'  
            contentButton='+ Nueva Cita' 
            modalSetState={(state) => setModals(prev => ({ ...prev, create: state }))}
            modalState={modals.create}
            loading={loading}
        >
            {/* --- MODALES --- */}
            {modals.edit && selectedId && (
                <Modal
                    title='Editar Cita'
                    description='Modifica los datos de la cita existente'
                    modalState={modals.edit}
                    setModalState={(state) => setModals(prev => ({ ...prev, edit: state }))}
                >
                    <EditAppointmentModal 
                        id={selectedId}
                        refetch={refetch}
                        modalState={modals.edit}
                        setModalState={(state) => setModals(prev => ({ ...prev, edit: state }))}
                    />
                </Modal>
            )}

            {modals.create && (
                <Modal
                    title='Registrar Nueva Cita'
                    description='Completa los datos para agendar una nueva cita'
                    modalState={modals.create}
                    setModalState={(state) => setModals(prev => ({ ...prev, create: state }))}
                >
                    <CreateAppointmentModal
                        refetch={refetch}
                        modalState={modals.create}
                        setModalState={(state) => setModals(prev => ({ ...prev, create: state }))}
                    />
                </Modal>
            )}

            {/* --- LISTA --- */}
            <ListPageComponent
                searcher={true}
                selectOpt={selectOpts}
                select={true}
                placeholder='Buscar por cliente, servicio o estilista...'
            >
                <div className='flex flex-col gap-4'>
                    {
    data?.map((cita: AppointmentType) => {
        const getStatusName = getStateName(cita.status);
        const getStatusColor = getStateColor(cita.status)

        return (
            <div key={cita?.id} className='flex flex-col md:flex-row items-start md:items-center justify-between text-paragraph border border-border-input rounded-xl p-4 md:p-0 gap-4 md:gap-0 bg-white'>
                
                {/* Contenedor Info */}
                <div className='flex flex-col sm:flex-row p-0 md:p-4 gap-4 md:gap-5 w-full md:w-auto'>
                    
                    {/* Caja de Fecha */}
                    <div className='bg-[#f5f1ea] px-5 flex flex-row sm:flex-col p-3 py-4 sm:py-7 rounded-xl items-center justify-between sm:justify-center gap-4 sm:gap-0 shrink-0 border border-[#eaddcf]'>
                        <span className='text-xs text-title uppercase font-bold tracking-wider'>{convertDate(cita.date)}</span>
                        <span className='font-semibold text-xs sm:text-lg'>{cita.time.slice(0,5)}</span>
                    </div>

                    {/* Textos */}
                    <div className='flex flex-col gap-1 w-full justify-center'>
                        <div className="flex justify-between items-start">
                            <h3 className='font-bold text-lg text-gray-800'>{cita.client.firstName + " " + cita.client.lastName}</h3>
                            {/* Status Móvil */}
                            <span className={`md:hidden text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor} bg-opacity-10`}>{getStatusName}</span>
                        </div>
                        
                        <span className="text-gray-500 text-sm">{cita.client.phoneNumber}</span>
                        
                        {/* Grid Iconos */}
                        <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center mt-2'>
                            <p className='flex text-sm items-center gap-1.5 text-gray-600 font-medium'><Scissors className='size-4 text-[#ef4b67]'/> {cita.service.name}</p>
                            <p className='flex text-sm items-center gap-1.5 text-gray-500'><User className='size-4'/> {cita.stylist?.firstName || "Sin estilista"}</p>
                            <p className='flex text-sm items-center gap-1.5 text-gray-500'><Clock className='size-4'/> {parseDurationToMinutes(cita.service.duration)} min</p>
                        </div>
                        
                        {cita.notes && <p className='text-xs italic mt-2 text-gray-400 border-l-2 border-gray-200 pl-2'>{cita.notes}</p>}
                    </div>

                </div>

                {/* Acciones */}
                <div className='flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 md:mr-4 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0'>
                    {/* Status Desktop */}
                    <span className={`hidden md:inline-block text-xs font-bold uppercase tracking-wider mb-1 ${getStatusColor}`}>{getStatusName}</span>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <button 
                            className='flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-300 text-gray-700 p-1.5 px-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors font-medium text-sm' 
                            // ERROR CORREGIDO AQUI:
                            onClick={() => openModal('edit', cita.id)} 
                        >
                            Editar
                        </button>
                        
                        <button 
                            className='flex-1 md:flex-none flex items-center justify-center gap-2 border border-red-200 text-red-600 p-1.5 px-4 rounded-lg cursor-pointer hover:bg-red-50 transition-colors font-medium text-sm'
                            onClick={() => cancelAppointment(cita.id)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    })
}
                </div>
            </ListPageComponent>
        </PageComponent>
    );
};

export default AppointmentPage;