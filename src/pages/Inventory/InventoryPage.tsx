import { useEffect, useState } from 'react'
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
import axiosApi from '../../utlis/axiosApi';
import type { createMovementType, MovementType } from './MovementType';

const InventoryPage = () => {

    const [ createProductState, setCreateProductState ] = useState<boolean>(false);
    const [ createMovementState, setCreateMovementState ] = useState<boolean>(false);
    const [ editProductState, setEditProductState ] = useState<boolean>(false);
    const [ selectedProductId, setSelectedProductId ] = useState<number>();
    const [ selectedProduct, setSelectedProduct ] = useState<inventoryType>();
    const [selectedView, setSelectedView] = useState<"product" | "movement" | "alert">("product");

    const { data, refetch } = getHook("/product")
    const { data: movements, refetch: refetchMovements } = getHook("/movement");
    const { data: alerts, refetch: refetchAlert} = getHook("/product/low_stock");
    console.log(alerts);
    
    // const { data: alerts, refetch: refetchAlerts } = getHook("/alerts");

    const { data: reports } = getHook("/product/reports");
    
    const reportsFormated = [
        {
            title: "Total Productos",
            quantity: reports?.data?.totalProducts,
            detail: "En inventario"
        },
        {
            title: "Stock Bajo",
            quantity: reports?.data?.totalLowStock,
            detail: "Requieren reposición"
        },
        {
            title: "Valor Total",
            quantity: "Bs " + reports?.data?.totalValue,
            detail: "En inventario"
        },
        {
            title: "Movimientos Hoy",
            quantity: reports?.data?.totalMovementsToday,
            detail: "Entradas y salidas"
        },
    ]

    useEffect(() => {

        const fetchProductById = async () => {
            if(!selectedProductId) return;
            try {
                const response = await axiosApi.get(`/product/${selectedProductId}`);
                setSelectedProduct(response?.data);
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchProductById();
    }, [selectedProductId])

    useEffect(() => {
        if (selectedView === "movement") refetchMovements();
    
    }, [selectedView])

    return (
        <PageComponent
            title='Gestión de Inventario'
            description='Controla el stock de productos y materiales'
            contentButton='+ Nuevo Producto'
            modalSetState={setCreateProductState}
            modalState={createProductState}
            secondButton={true}
            setSecondButtonState={setCreateMovementState}
            reports={reportsFormated}
        >
            <div className='bg-[#f5f1ea] flex p-1 w-min mt-5 rounded-xl'>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "product" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("product")}
                >
                    Productos
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "movement" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("movement")}
                >
                    Movimientos
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "alert" ? "font-semibold bg-white rounded-xl" : ""}`}
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
                        product={selectedProduct}
                        onSuccess={refetch}
                    />
                </Modal>
                {
                    selectedView === "product" ?
                        data?.data?.map((item: inventoryType) => {

                            const stockText = getStockName(item?.initialStock, item?.minimumStock);
                            const stockClassName = getStockColor(item?.initialStock, item?.minimumStock);

                            return (
                                <div key={item.id} className='flex p-3 border border-border-input rounded-xl justify-between'>
                                    <div className='flex items-center gap-5'>
                                        <div className='bg-[#ef4b671a] p-3 rounded-xl'>
                                            <Package className='text-red-500'/>
                                        </div>

                                        <div className='flex flex-col'>
                                            <h3 className='font-semibold text-title text-lg'>{item?.name}</h3>
                                            <div className='text-base text-paragraph flex gap-5'>
                                                <p>{item?.brand} • <span>{item?.category?.name}</span></p>
                                            </div>

                                            <div className='text-paragraph flex gap-4'>
                                                <span>Stock: {item?.initialStock} unidades</span>
                                                <span>Mínimo: {item?.minimumStock}</span>
                                                <span>Precio: Bs{item?.price}</span>
                                                <p>Proveedor: {item?.supplier}</p>
                                            </div>
                                        </div>

                                    </div>
                                        
                                    <div className='flex items-center gap-4'>
                                        <span className={stockClassName}>{stockText}</span>
                                        <button
                                            className='hover:bg-hover-bg border border-border-input px-4 py-1 rounded-xl cursor-pointer'
                                            onClick={() => {
                                                setSelectedProductId(item?.id)
                                                setEditProductState(true)
                                            }}
                                        >Editar</button>
                                    </div>
                                </div>
                            )
                        })
                        : selectedView === "movement" ?
                            movements?.data?.map((item: MovementType, i: number) => {
                                return (
                                    <div key={i} className='flex p-3 border border-border-input rounded-xl justify-between'>
                                        <div className='flex items-center gap-5'>
                                            <div className={`p-3 rounded-xl ${item?.movementType === "ENTRADA" ? "bg-[#ef4b671a]" : "bg-green-100"}`}>
                                                {
                                                    item?.movementType === "ENTRADA" ?
                                                        <TrendingDown className='text-red-500'/>
                                                    :   <TrendingUp className='text-green-500'/>

                                                }
                                            </div>

                                            <div className='flex flex-col'>
                                                <h3 className='font-semibold text-title text-lg'>{item?.product?.name}</h3>
                                                <div className='text-base text-paragraph flex gap-5'>
                                                    <p className='text-paragraph text-sm'>{item?.movementType === "ENTRADA" ? "Compra" : "Venta"}</p>
                                                </div>
                                            </div>

                                        </div>
                                            
                                         <div className='flex items-end gap-1 flex-col'>
                                            <span className='text-end font-semibold text-lg'>{item?.movementType === "ENTRADA" ? "+ " + item?.quantity : "- " + item?.quantity}</span>
                                            <span className='text-sm text-paragraph'>{item?.movementDate}</span>
                                        </div>
                                    </div>
                                )
                            }) : alerts?.data?.map((alert: any, i: number) => {
                                return (
                                    <div key={i} className='flex p-3 border border-amber-300 rounded-xl justify-between bg-amber-50'>
                                        <div className='flex items-center gap-5'>
                                            <div className='p-3 rounded-xl'>
                                                <TriangleAlert className='text-amber-600'/> 
                                            </div>

                                            <div className='flex flex-col'>
                                                <h3 className='font-semibold text-title text-lg'>{alert?.name}</h3>
                                                <p className='text-paragraph text-base'>Stock actual: {alert?.initialStock} • Mínimo requerido: {alert?.minimumStock}</p>
                                                <p className='text-paragraph text-base'>Proveedor: {alert?.supplier}</p>
                                                
                                            </div>

                                        </div>                                                                    
                                    </div>
                                )
                            })
                }           
            </ListPageComponent>

        </PageComponent>
    )
}

export default InventoryPage