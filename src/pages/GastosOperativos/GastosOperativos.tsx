import { useState } from 'react'
import PageComponent from '../../components/PageComponent'
import { getHook } from '../../hooks/getHook'
import ListPageComponent from '../../components/ListPageComponent';
import { Calendar, DollarSign, Pencil, Trash2, Receipt } from 'lucide-react';
import Modal from '../../components/Modal';
import type { GastosOperativosType } from './GastosOperativosType';
import { CreateGastosOperativosModal } from './CreateGastosOperativosModal';
import { EditarGastosOperativosModal } from './EditarGastosOperativosModal';
import DeleteGastosOperativosModal from './DeleteGastosOperativosModal';


interface Reports {
    totalExpenses: number,
    totalRecords: number,
    averageExpense: number,
    majorExpense: number
}

const GastosOperativos = () => {

    const [ createExpense, setCreateExpense ] = useState<boolean>(false);
    const [ editExpense, setEditExpense ] = useState<boolean>(false);
    const [ deleteExpense, setDeleteExpense ] = useState<boolean>(false);
    const [ selectedId, setSelectedId ] = useState<number | null>(null);

    const { data: reports, refetch: refetchReports, loading: loadingReports } = getHook<Reports>("/gastos-operativos/reports");

    const gastosReports = [
        {
            title: "Total Gastos",
            quantity: `Bs ${reports?.totalExpenses || 0}`,
            detail: `${reports?.totalRecords || 0} registros`
        },
        {
            title: "Gasto Promedio",
            quantity: "Bs " + (reports?.averageExpense || 0),
            detail: "Por gasto registrado"
        },
        {
            title: "Gasto Mayor",
            quantity: `Bs ${reports?.majorExpense || 0}`,
            detail: "Monto más alto"
        }

    ]

    const { data: gastosOperativos, refetch, loading } = getHook<GastosOperativosType[]>("/gastos-operativos")
    
    return (
        <PageComponent
            title='Gastos Operativos'
            description='Administra los gastos operativos de tu peluquería'
            reports={gastosReports}
            contentButton='+ Nuevo Gasto'
            modalSetState={setCreateExpense}
            loading={loading || loadingReports}
            modalState={createExpense}
        >

            <Modal
                modalState={createExpense}
                setModalState={setCreateExpense}
                title='Agregar Nuevo Gasto'
                description='Añada un nuevo gasto operativo'
            >
                {/* Self-closing tag: Más limpio */}
                <CreateGastosOperativosModal
                    modalState={createExpense}
                    setModalState={setCreateExpense}
                    refetch={refetch}
                    refetchReports={refetchReports}
                />
            </Modal>

            <Modal
                modalState={editExpense}
                setModalState={setEditExpense}
                title='Modifica un Gasto'
                description='Edita un gasto operativo'
            >
                <EditarGastosOperativosModal
                    modalState={editExpense}
                    id={selectedId}
                    setModalState={setEditExpense}
                    refetch={refetch}
                    refetchReports={refetchReports}
                />
            </Modal>

            <Modal
                modalState={deleteExpense}
                setModalState={setDeleteExpense}
            >
                <DeleteGastosOperativosModal
                    modalState={deleteExpense}
                    id={selectedId}
                    setModalState={setDeleteExpense}
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
                        !gastosOperativos?.length ? (
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/resultsNotFound.png" alt="" className="w-1/2 mx-auto" />
                            </div> 
                        ) : (
                            gastosOperativos?.map((item: GastosOperativosType) => {
                                // KEY FIX: Usar item.id, nunca index si es posible
                                return (
                                    <div key={item.id} className='bg-white flex flex-col sm:flex-row p-4 border border-border-input rounded-xl justify-between gap-4 sm:gap-0 shadow-sm hover:shadow-md transition-all'>
                                        
                                        {/* Left Side: Icon & Info */}
                                        <div className='flex items-start gap-4 w-full'>
                                            <div className='bg-gray-100 p-3 rounded-xl shrink-0 text-gray-600'>
                                                <Receipt className='size-6'/>
                                            </div>
                                            
                                            {/* min-w-0 evita que el texto largo rompa el flexbox */}
                                            <div className='flex flex-col w-full min-w-0'>
                                                <h3 className='font-bold text-gray-800 text-base sm:text-lg leading-tight truncate'>{item?.concepto}</h3>
                                                
                                                <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1'>
                                                    <span className='flex gap-1.5 items-center'>
                                                        <Calendar className='size-3.5'/> {item?.fecha}
                                                    </span>
                                                    <span className='flex gap-1.5 items-center font-medium text-gray-900 bg-gray-50 px-2 rounded'>
                                                        <DollarSign className='size-3.5 text-green-600'/> {item?.monto}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Actions */}
                                        {/* Mobile: Row at bottom (full width). Desktop: Row at right */}
                                        <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0'>
                                            
                                            {/* Botones expandibles en móvil (flex-1) */}
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <button 
                                                    className='flex-1 sm:flex-none flex gap-2 items-center justify-center border border-gray-300 rounded-lg text-sm text-gray-700 px-3 py-1.5 font-medium hover:bg-gray-50 transition-colors'
                                                    onClick={() => {
                                                        setSelectedId(item?.id) // IMPORTANTE: Seteamos ID primero
                                                        setEditExpense(true);
                                                    }}
                                                >
                                                    <Pencil className='size-4 text-gray-500'/> 
                                                    <span>Editar</span>
                                                </button>
                                                
                                                <button 
                                                    className='flex-1 sm:flex-none flex gap-2 items-center justify-center border border-red-200 bg-red-50 rounded-lg text-sm px-3 py-1.5 font-medium text-red-600 hover:bg-red-100 transition-colors'
                                                    onClick={() => {
                                                        setSelectedId(item?.id);
                                                        setDeleteExpense(true)
                                                    }}
                                                >
                                                    <Trash2 className='size-4'/> 
                                                    <span>Eliminar</span>
                                                </button>
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

export default GastosOperativos