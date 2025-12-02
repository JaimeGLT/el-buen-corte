import { Calendar, Mail, Phone, RotateCcw, User, Edit, FileText } from 'lucide-react';
import ListPageComponent from '../../components/ListPageComponent';
import PageComponent from '../../components/PageComponent';
import { getHook } from '../../hooks/getHook';
import type { ClientType } from '../../types/Client';
import Modal from '../../components/Modal';
import { useState } from 'react';
import { CreateClientModal } from './CreateClientModal';
import { DetailClientModal } from './DetailClientModal';
import { ClientEditModal } from './ClientEditModal';

interface ClientMetrics {
    totalClients: number;
    newClientsThisMonth: number;
    vipClients: number;
    vipPercentage: number;
    newClientsCurrentMonth: number;
    growthPercentage: number;
    retentionRate: number;
}

const ClientPage = () => {
    const { data: clientes, refetch, loading } = getHook<ClientType[]>("/client");
    
    // Agrupa tus estados para no tener un spaghetti de hooks
    const [modals, setModals] = useState({
        create: false,
        edit: false,
        detail: false
    });
    const [clientId, setClientId] = useState<number | undefined>();
    
    const { data: clientReports, loading: loadingReports, refetch: refetchReports } = getHook<ClientMetrics>("/client/reports");

    // Helper para manejar el toggle de modales de forma limpia
    const toggleModal = (modalName: keyof typeof modals, state: boolean, id?: number) => {
        if (id) setClientId(id);
        setModals(prev => ({ ...prev, [modalName]: state }));
    };

    const reports = [
        {
            title: "Total Clientes",
            quantity: `${clientReports?.totalClients || 0}`,
            detail: `+${clientReports?.newClientsThisMonth || 0} este mes`
        },
        {
            title: "Clientes VIP",
            quantity: `${clientReports?.vipClients || 0}`,
            detail: `${clientReports?.vipPercentage || 0}% del total`
        },
        {
            title: "Nuevos (mes)",
            quantity: `${clientReports?.newClientsThisMonth || 0}`,
            detail: `+${clientReports?.newClientsCurrentMonth || 0} vs mes anterior`
        },
        {
            title: "Retención",
            quantity: `${clientReports?.retentionRate || 0}%`,
            detail: "Clientes recurrentes"
        }
    ];

    return (
        <PageComponent 
            contentButton='+ Nuevo Cliente'
            title='Gestión de Clientes' 
            description='Administra la información de tus clientes' 
            reports={reports}
            loading={loadingReports || loading}
            modalSetState={(state) => toggleModal('create', state)}
            modalState={modals.create}
        >
            {/* --- MODALES --- */}
            {/* Renderizado condicional para evitar montar componentes pesados si no se usan */}
            {modals.create && (
                <Modal
                    title='Registrar Nuevo Cliente'
                    description='Completa los datos del nuevo cliente'
                    modalState={modals.create}
                    setModalState={(s) => toggleModal('create', s)}
                >
                    <CreateClientModal 
                        refetch={refetch}
                        modalState={modals.create}
                        setModalState={(s) => toggleModal('create', s)}
                        refetchReports={refetchReports}
                    />
                </Modal>
            )}

            {modals.detail && clientId && (
                <Modal
                    title="Perfil del cliente"
                    description='Información completa del cliente'
                    modalState={modals.detail}
                    setModalState={(s) => toggleModal('detail', s)}
                >
                    <DetailClientModal 
                        id={clientId}
                        modalState={modals.detail}
                        setModalState={(s) => toggleModal('detail', s)}
                    />
                </Modal>
            )}

            {modals.edit && clientId && (
                <Modal
                    title="Editar Cliente"
                    description='Cambia la información del cliente'
                    modalState={modals.edit}
                    setModalState={(s) => toggleModal('edit', s)}
                >
                    <ClientEditModal 
                        refetch={refetch}
                        id={clientId}
                        modalState={modals.edit}
                        setModalState={(s) => toggleModal('edit', s)}
                        refetchReports={refetchReports}
                    />
                </Modal>
            )}

            {/* --- LISTA DE CLIENTES --- */}
            <ListPageComponent 
                searcher={true} 
                placeholder='Buscar por nombre, email o teléfono...'
                select={false}   
            >
                {!clientes?.length ? (
                    <div className='flex flex-col items-center justify-center py-10 opacity-70'>
                        <img src="/resultsNotFound.png" alt="No results" className="w-48 h-auto mb-4 grayscale" />
                        <p className="text-gray-500 font-medium">No se encontraron clientes</p>
                    </div> 
                ) : (
                    <div className="flex flex-col gap-3">
                        {clientes.map((item: ClientType) => {
                            // Safety first: valida que existan strings antes de acceder a índices
                            const extractInitials = (item.firstName?.[0] || "") + (item.lastName?.[0] || "");
                            const total = item.citas?.reduce((acc, cita) => acc + cita.price, 0) || 0;

                            return (
                                <div 
                                    className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4' 
                                    key={item.id}
                                >
                                    {/* INFO PRINCIPAL */}
                                    <div className='flex items-start md:items-center gap-4 w-full md:w-auto'>
                                        <div className='shrink-0 size-12 rounded-full bg-[#f1ced4] flex items-center justify-center text-[#ef4b67] font-bold text-lg'>
                                            {extractInitials.toUpperCase() || <User size={20}/>}
                                        </div>
                                        
                                        <div className='flex flex-col gap-1 w-full'>
                                            <h3 className='text-base font-bold text-gray-900 leading-tight'>
                                                {item.firstName} {item.lastName}
                                            </h3>
                                            
                                            {/* Detalles de contacto - Grid en móvil para ahorrar espacio vertical */}
                                            <div className='grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col lg:flex-row gap-x-4 gap-y-1 text-xs text-gray-500 mt-1'>
                                                <div className='flex items-center gap-1.5 min-w-0'>
                                                    <Mail className='size-3.5 shrink-0'/> 
                                                    <span className="truncate">{item.email || "Sin email"}</span>
                                                </div>
                                                <div className='flex items-center gap-1.5'>
                                                    <Phone className='size-3.5 shrink-0'/> 
                                                    <span>{item.phoneNumber || "Sin telf"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ESTADÍSTICAS - Ocultas en móvil muy pequeño, visibles en tablet+ */}
                                    <div className='flex flex-row md:flex-col lg:flex-row gap-4 md:gap-2 lg:gap-6 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 text-sm text-gray-600 w-full md:w-auto justify-between md:justify-start'>
                                        <div className="flex flex-col lg:items-end">
                                            <span className="text-xs text-gray-400">Última visita</span>
                                            <div className='flex items-center gap-1 font-medium'>
                                                <Calendar className='size-3.5'/> 
                                                {item.lastVisit || "N/A"}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col lg:items-end">
                                            <span className="text-xs text-gray-400">Frecuencia</span>
                                            <div className='flex items-center gap-1 font-medium'>
                                                <RotateCcw className='size-3.5'/> 
                                                {item.citas?.length || 0} visitas
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:items-end">
                                            <span className="text-xs text-gray-400">LTV (Total)</span>
                                            <span className='font-bold text-[#ef4b67]'>Bs {total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* ACCIONES */}
                                    <div className='flex md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0'>
                                        <button 
                                            className='flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-1.5 px-3 text-sm font-medium hover:bg-gray-50 hover:text-[#ef4b67] transition-colors'
                                            onClick={() => toggleModal('edit', true, item.id)}
                                        >
                                            <Edit className="size-4" />
                                            <span className="md:hidden lg:inline">Editar</span>
                                        </button>
                                        <button 
                                            className='flex-1 md:flex-none flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-1.5 px-3 text-sm font-medium hover:bg-gray-50 hover:text-[#ef4b67] transition-colors'
                                            onClick={() => toggleModal('detail', true, item.id)}
                                        >
                                            <FileText className="size-4" />
                                            <span className="md:hidden lg:inline">Perfil</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ListPageComponent>
        </PageComponent>
    );
};

export default ClientPage;