import { useState } from 'react'
import PageComponent from '../../components/PageComponent'
import ListPageComponent from '../../components/ListPageComponent';
import { getHook } from '../../hooks/getHook';
import { Package, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react';
import type { inventoryType } from './InventoryType';
import { getStockColor, getStockName } from '../../utlis/getState';
import Modal from '../../components/Modal';
import { CreateProductModal } from './CreateProductModal';
import { CreateMovementModal } from './CreateMovementModa';
import { EditProductModal } from './EditProductModal';
import type { MovementType } from './MovementType';

interface Reports {
    totalLowStock: number;
    totalMovementsToday: number;
    totalProducts: number;
    totalValue:number;
}

const InventoryPage = () => {

    const [ createProductState, setCreateProductState ] = useState<boolean>(false);
    const [ createMovementState, setCreateMovementState ] = useState<boolean>(false);
    const [ editProductState, setEditProductState ] = useState<boolean>(false);
    const [ selectedProductId, setSelectedProductId ] = useState<number>();
    
    const [selectedView, setSelectedView] = useState<"product" | "movement" | "alert">("product");

    const { data: products, loading ,refetch } = getHook<inventoryType[]>("/product")
    const { data: movements, refetch: refetchMovements, loading: loadingMovement } = getHook<MovementType[]>("/movement");
    const { data: alerts } = getHook<inventoryType[]>("/product/low_stock");
    const { data: reports, refetch: refetchReports, loading: loadingReports } = getHook<Reports>("/product/reports");
    
    const reportsFormated = [
        {
            title: "Total Productos",
            quantity: `${reports?.totalProducts || 0}`,
            detail: "En inventario"
        },
        {
            title: "Stock Bajo",
            quantity: `${reports?.totalLowStock || 0}`,
            detail: "Requieren reposición"
        },
        {
            title: "Valor Total",
            quantity: "Bs " + (reports?.totalValue || 0),
            detail: "En inventario"
        },
        {
            title: "Movimientos Hoy",
            quantity: `${reports?.totalMovementsToday || 0}`,
            detail: "Entradas y salidas"
        },
    ]

    return (
        <PageComponent
            title='Gestión de Inventario'
            description='Controla el stock de productos y materiales'
            contentButton='+ Nuevo Producto'
            modalSetState={setCreateProductState}
            modalState={createProductState}
            secondButton={true}
            setSecondButtonState={setCreateMovementState}
            loading={loading || loadingMovement || loadingReports}
            reports={reportsFormated}
        >
            {/* CORRECCIÓN TABS:
                - Móvil: grid grid-cols-3 (3 columnas iguales, ocupan todo el ancho, sin scroll feo).
                - Desktop (sm): flex w-min (tu estilo original compactado).
            */}
            <div className='bg-[#f5f1ea] grid grid-cols-3 sm:flex p-1 w-full sm:w-min mt-5 rounded-xl gap-1'>
                <button
                    className={`text-center text-xs sm:text-base px-2 py-1.5 rounded-lg transition-all ${selectedView === "product" ? "font-semibold bg-white shadow-sm" : "text-gray-600 hover:bg-black/5"}`}
                    onClick={() => setSelectedView("product")}
                >
                    Productos
                </button>
                <button
                    className={`text-center text-xs sm:text-base px-2 py-1.5 rounded-lg transition-all ${selectedView === "movement" ? "font-semibold bg-white shadow-sm" : "text-gray-600 hover:bg-black/5"}`}
                    onClick={() => setSelectedView("movement")}
                >
                    Movimientos
                </button>
                <button
                    className={`text-center text-xs sm:text-base px-2 py-1.5 rounded-lg transition-all ${selectedView === "alert" ? "font-semibold bg-white shadow-sm" : "text-gray-600 hover:bg-black/5"}`}
                    onClick={() => setSelectedView("alert")}
                >
                    Alertas
                </button>
            </div>

            <ListPageComponent
                searcher={selectedView === "product" ? true : false}
                placeholder='Buscar productos...'
                select={selectedView === "product" ? true : false}
            >
                {/* MODALES */}
                <Modal
                    modalState={createProductState}
                    setModalState={setCreateProductState}
                    title='Registrar Nuevo Producto'
                    description='Agrega un nuevo producto al inventario'
                >
                    <CreateProductModal 
                        modalState={createProductState}
                        setModalState={setCreateProductState}
                        onSuccess={refetch}
                        refetchReports={refetchReports}
                    />
                </Modal>
                <Modal
                    modalState={createMovementState}
                    setModalState={setCreateMovementState}
                    title='Registrar Movimiento'
                    description='Registra entrada o salida de productos'
                >
                    <CreateMovementModal
                        modalState={createMovementState}
                        setModalState={setCreateMovementState}
                        onSuccess={refetchMovements} 
                        refetchReports={refetchReports}
                    />
                </Modal>
                <Modal
                    modalState={editProductState}
                    setModalState={setEditProductState}
                    title='Editar Producto'
                    description='Modifica los datos del producto'
                >
                    <EditProductModal
                        modalState={editProductState}
                        setModalState={setEditProductState}
                        onSuccess={refetch}
                        refetchReports={refetchReports}
                        id={selectedProductId}
                    />
                </Modal>

                {/* CONTENIDO */}
                <div className="flex flex-col gap-3">
                {
                    selectedView === "product" ? (
                        !products?.length ? (
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/resultsNotFound.png" alt="" className="w-1/2 mx-auto"/>
                            </div> 
                        ) : (
                            products?.map((item: inventoryType) => {
                                const stockText = getStockName(item?.initialStock, item?.minimumStock);
                                const stockClassName = getStockColor(item?.initialStock, item?.minimumStock);

                                return (
                                    <div key={item.id} className='bg-white flex flex-col sm:flex-row p-4 border border-border-input rounded-xl justify-between gap-4 sm:gap-0 shadow-sm'>
                                        <div className='flex items-start gap-4 w-full'>
                                            <div className='bg-[#ef4b671a] p-3 rounded-xl shrink-0 mt-1'>
                                                <Package className='text-red-500 size-5 sm:size-6'/>
                                            </div>
                                            
                                            {/* min-w-0 es CRUCIAL para que el texto no empuje el ancho del contenedor en móvil */}
                                            <div className='flex flex-col w-full min-w-0'>
                                                <h3 className='font-bold text-gray-800 text-base sm:text-lg leading-tight truncate'>{item?.name}</h3>
                                                <div className='text-sm text-gray-500 flex flex-wrap gap-x-2 mt-0.5'>
                                                    <span className="font-medium">{item?.brand}</span>
                                                    <span>•</span>
                                                    <span>{item?.category?.name}</span>
                                                </div>
                                                
                                                <div className='grid grid-cols-2 sm:flex sm:flex-wrap gap-x-4 gap-y-1 text-sm mt-2 text-gray-600'>
                                                    <span className="whitespace-nowrap">Stock: <b className="text-gray-900">{item?.initialStock}</b></span>
                                                    <span className="whitespace-nowrap">Min: {item?.minimumStock}</span>
                                                    <span className="whitespace-nowrap font-medium text-green-600">Bs {item?.price}</span>
                                                    {/* truncate permite que el proveedor largo se corte con '...' */}
                                                    <span className="truncate col-span-2 sm:col-span-1" title={item?.supplier}>Prov: {item?.supplier}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0'>
                                            <span className={`${stockClassName} text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide`}>{stockText}</span>
                                            <button
                                                className='hover:bg-gray-50 border border-gray-300 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors'
                                                onClick={() => {
                                                    setSelectedProductId(item?.id)
                                                    setEditProductState(true)
                                                }}
                                            >Editar</button>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    ) : selectedView === "movement" ? (
                        !movements?.length ? (
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/resultsNotFound.png" alt="" className="w-1/2 mx-auto"/>
                            </div> 
                        ) : (
                            movements?.map((item: MovementType, i: number) => {
                                return (
                                    <div key={i} className='bg-white flex flex-col sm:flex-row p-3 border border-border-input rounded-xl justify-between gap-3 sm:gap-0 shadow-sm'>
                                        <div className='flex items-center gap-4 w-full min-w-0'>
                                            <div className={`p-2.5 rounded-xl shrink-0 ${item?.movementType === "ENTRADA" ? "bg-[#ef4b671a]" : "bg-green-100"}`}>
                                                {item?.movementType === "ENTRADA" ? <TrendingDown className='text-red-500 size-5'/> : <TrendingUp className='text-green-500 size-5'/>}
                                            </div>
                                            <div className='flex flex-col min-w-0'>
                                                <h3 className='font-semibold text-gray-800 text-sm sm:text-base truncate'>{item?.product?.name}</h3>
                                                <span className='text-xs text-gray-500 uppercase tracking-wide font-medium'>{item?.movementType === "ENTRADA" ? "Compra" : "Venta"}</span>
                                            </div>
                                        </div>
                                        <div className='flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end gap-1 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0 mt-2 sm:mt-0'>
                                            <span className={`font-bold text-lg ${item?.movementType === "ENTRADA" ? "text-red-500" : "text-green-600"}`}>
                                                {item?.movementType === "ENTRADA" ? "+ " : "- "}{item?.quantity}
                                            </span>
                                            <span className='text-xs text-gray-400'>{item?.movementDate}</span>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    ) : (
                        // ALERTAS
                        !alerts?.length ? (
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/resultsNotFound.png" alt="" className="w-1/2 mx-auto"/>
                            </div> 
                        ) : (
                            alerts?.map((alert: any, i: number) => {
                                return (
                                    <div key={i} className='bg-amber-50 flex flex-col sm:flex-row p-4 border border-amber-200 rounded-xl justify-between gap-3 sm:gap-0'>
                                        <div className='flex items-start gap-4'>
                                            <div className='bg-amber-100 p-2 rounded-lg shrink-0 mt-0.5'>
                                                <TriangleAlert className='text-amber-600 size-5'/> 
                                            </div>
                                            <div className='flex flex-col'>
                                                <h3 className='font-bold text-amber-900 text-base'>{alert?.name}</h3>
                                                <p className='text-amber-800 text-sm mt-1'>
                                                    Stock actual: <b className="text-amber-950">{alert?.initialStock}</b> / Mínimo: {alert?.minimumStock}
                                                </p>
                                                <p className='text-amber-700 text-xs mt-1 truncate max-w-[250px]'>Prov: {alert?.supplier}</p>
                                            </div>
                                        </div>                                                                        
                                    </div>
                                )
                            })
                        )
                    )
                }
                </div>           
            </ListPageComponent>
        </PageComponent>
    )
}

export default InventoryPage