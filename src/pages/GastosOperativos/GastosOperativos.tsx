import { useState } from 'react'
import PageComponent from '../../components/PageComponent'
import { getHook } from '../../hooks/getHook'
import ListPageComponent from '../../components/ListPageComponent';
import { Calendar, DollarSign, Pencil, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import type { GastosOperativosType } from './GastosOperativosType';
import { CreateGastosOperativosModal } from './CreateGastosOperativosModal';
import { EditarGastosOperativosModal } from './EditarGastosOperativosModal';


interface Reports {
    totalExpenses: number,
    totalRecords: number,
    averageExpense: number,
    majorExpense: number
}

const GastosOperativos = () => {

    const [ createExpense, setCreateExpense ] = useState<boolean>(false);
    const [ editExpense, setEditExpense ] = useState<boolean>(false);
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
                <CreateGastosOperativosModal
                    modalState={createExpense}
                    setModalState={setCreateExpense}
                    refetch={refetch}
                    refetchReports={refetchReports}
                >

                </CreateGastosOperativosModal>
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
                >

                </EditarGastosOperativosModal>
            </Modal>

            <ListPageComponent
                searcher={false}
                select={false}
            >
                <div className='flex flex-col gap-3'>
                    {
                        !gastosOperativos?.length ?
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center'>
                                <img src="/resultsNotFound.png" alt="" />
                            </div> 
                            :
                        gastosOperativos?.map((item: GastosOperativosType, index) => {
                            
                            return <div key={index} className='p-4 border border-border-input rounded-xl flex gap-3 items-center justify-between'>
                                <div className='flex flex-col gap-1'>
                                    <h3 className='font-semibold'>{item?.concepto}</h3>
                                    <div className='text-sm text-paragraph flex gap-5'>
                                        <p className='flex gap-1 items-center'><Calendar className='size-3'/> {item?.fecha}</p>
                                        <span className='flex gap-1 items-center'><DollarSign className='size-3'/> {item?.monto}</span>
                                    </div>
                                </div>

                                <div className='flex gap-2'>
                                    <button className='flex gap-1 items-center justify-center border-border-input border rounded-xl text-sm text-paragraph px-2 py-1 font-semibold hover:cursor-pointer h-fit'
                                    onClick={() => {
                                        setEditExpense(true);
                                        setSelectedId(item?.id)
                                    }}
                                    ><Pencil className='size-4'
                                    /> Editar</button>
                                    <button className='flex gap-1 items-center justify-center border-border-input border rounded-xl text-sm px-2 py-1 font-semibold bg-red-500 text-white hover:cursor-pointer h-fit'><Trash2 className='size-4'/> Eliminar</button>
                                </div>
                            </div>
                        })
                    }
                </div>
            </ListPageComponent>
        </PageComponent>
    )
}

export default GastosOperativos