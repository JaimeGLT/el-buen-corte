import { Calendar, Mail, Phone, RotateCcw } from 'lucide-react'
import ListPageComponent from '../../components/ListPageComponent'
import PageComponent from '../../components/PageComponent'
import { getHook } from '../../hooks/getHook'
import type { ClientType } from '../../types/Client';

const ClientPage = () => {

    const { data, loading, error } = getHook("/client");
    
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

    return (
        <PageComponent 
            contentButton='+ Nuevo Cliente'
            title='Gestión de Clientes' 
            description='Administra la información de tus clientes' 
            reports={clientReports}
        >
            <ListPageComponent 
                searcher={true} 
                placeholder='Buscar por nombre, email o teléfono...'
                select={false}   
            >
                {
                    data?.data?.map((item: ClientType) => {
                        const extractInitials = item.firstName[0] + item.lastName[0];
                        const total = item.citas.reduce((acc, cita) => acc + cita.price, 0);

                        return <div className='flex justify-between items-center border border-gray-300 rounded-xl p-3 px-4 text-[#68606a]' key={item.id}>
                            <div className='flex gap-4'>
                                <div className='flex items-center p-2 rounded-full'>
                                    <p className='bg-[#f1ced494] text-center p-3 rounded-full text-[#ef4b67] font-semibold'>{extractInitials.toUpperCase()}</p>
                                </div>
                                <div className='flex gap-2 flex-col'>
                                    <p className='text-base font-semibold'>{item.firstName + " " + item.lastName}</p>
                                    <div className='flex gap-5'>
                                        <p className='flex gap-1 text-sm items-center'><Mail className='size-4'/> {!item.email ? "---" : item.email}</p>
                                        <p className='flex gap-1 text-sm items-center'><Phone className='size-4'/> {item.phoneNumber ? item.phoneNumber : "---"}</p>
                                    </div>
                                    <div className='flex gap-5'>
                                        <p className='flex gap-1 text-sm items-center'><Calendar className='size-4'/> Última visita: {item.lastVisit ? item.lastVisit : "---"} </p>
                                        <p className='flex gap-1 text-sm items-center'><RotateCcw className='size-4'/> {item.citas.length} {item.citas.length == 1 ? "visita" : "visitas"}</p>
                                        <p className='flex gap-1 text-sm items-center'>Bs {total.toFixed(2)} total</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-4'>
                                <p>Regular</p>
                                <button>Ver perfil</button>
                            </div>
                        </div>
                    })
                }
            </ListPageComponent>
        </PageComponent>
    )
}

export default ClientPage