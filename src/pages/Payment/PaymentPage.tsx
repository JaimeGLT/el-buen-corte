import { useRef, useState } from 'react'
import PageComponent from '../../components/PageComponent'
import ListPageComponent from '../../components/ListPageComponent';
import CreatePaymentModal from './CreatePaymentModal';
import Modal from '../../components/Modal';
import { getHook } from '../../hooks/getHook';
import type { Paymenttype } from './PaymentType';
import { getPaymentDate, getPaymentDateYMD } from '../../utlis/parseDuration';
import { CreditCard, Printer, Receipt as Receipt1, Smartphone, Wallet } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Receipt } from "./Receipt";


const PaymentPage = () => {

    const [ createPayment, setCreatePayment ] = useState<boolean>(false);
    const [ selectedView, setSelectedView ] = useState<"hoy" | "mes" | "historial">("hoy");

    const { data: reportsToday, refetch: refetchToday } = getHook<any>("/payment/reports_today");
    
    const { data: reportsMonth, refetch: refetchMonth } = getHook<any>("/payment/reports_month");

    const { data: paymentToday, refetch: refetchPaymentToday, loading: loadingToday } = getHook<any>("/payment/today");
    const { data: paymentMonth, refetch: refetchPaymentMonth, loading: loadingMonth } = getHook<any>("/payment/month");
    const { data: paymenthHistory, refetch: refetchHistory, loading: loading } = getHook<Paymenttype[]>("/payment");

    const calculatePercentaje = (amountType: number, totalAmount:number ) => {
        return totalAmount ? (amountType / totalAmount) * 100 : 0;
    }

    const reportsTodayFiltered = [
        {
            title: "Total Hoy", 
            quantity: "Bs " + (reportsToday?.totalPaymentAmountToday || 0), 
            detail: reportsToday?.totalTransactionsToday + " transacciones"
        },
        {
            title: "Efectivo", 
            quantity: "Bs " + (reportsToday?.totalCashAmountToday || 0), 
            detail: calculatePercentaje(reportsToday?.totalCashAmountToday, reportsToday?.totalPaymentAmountToday).toFixed(2) + "% del total"
        },
        {
            title: "Tarjeta", 
            quantity: "Bs " + (reportsToday?.totalCardAmountToday || 0), 
            detail: calculatePercentaje(reportsToday?.totalCardAmountToday, reportsToday?.totalPaymentAmountToday).toFixed(2) + "% del total",
        },
        {
            title: "QR / Transfer", 
            quantity: "Bs " + (reportsToday?.totalQRAmountToday || 0), 
            detail: calculatePercentaje(reportsToday?.totalQRAmountToday, reportsToday?.totalPaymentAmountToday).toFixed(2) + "% del total"
        }
    ]

    const reportsMonthFiltered = [
        {
            title: "Total Mes", 
            quantity: "Bs " + reportsMonth?.totalAmountMonth, 
            detail: reportsMonth?.totalTransactionsMonth + " transacciones"
        },
        {
            title: "Promedio Diario", 
            quantity: "Bs " + reportsMonth?.averageDaily?.toFixed(2), 
            detail: "De este mes"
        },
        {
            title: "Efectivo", 
            quantity: "Bs " + reportsMonth?.totalCash, 
            detail: calculatePercentaje(reportsMonth?.totalCash, reportsMonth?.totalAmountMonth).toFixed(2) + "% del total",
        },
        {
            title: "Digital", 
            quantity: "Bs " + reportsMonth?.totalDigital, 
            detail: calculatePercentaje(reportsMonth?.totalDigital, reportsMonth?.totalAmountMonth).toFixed(2) + "% del total"
        }
    ]

    const [selectedPayment, setSelectedPayment] = useState<Paymenttype | null>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: receiptRef,
        documentTitle: "Recibo de Pago",
    });

    const handleViewReceipt = (payment: Paymenttype) => {
        setSelectedPayment(payment);
    };


    return (
        <PageComponent
            title='Gestión de Pagos'
            description='Controla los ingresos y transacciones'
            contentButton='+ Registrar Pago'
            modalState={createPayment}
            modalSetState={setCreatePayment}
            loading={loading || loadingMonth || loadingToday}
            reports={selectedView === "hoy" ? reportsTodayFiltered : selectedView === "mes" ? reportsMonthFiltered : []}
        >
            <Modal
                title='Registrar Nuevo Pago'
                description='Registra un pago recibido'
                modalState={createPayment}
                setModalState={setCreatePayment}
            >
                <CreatePaymentModal 
                    modalState={createPayment}
                    setModalState={setCreatePayment}
                    refetchReportToday={refetchToday}
                    refetchReportMonth={refetchMonth}
                    refetchPaymentMonth={refetchPaymentMonth}
                    refetchPaymentToday={refetchPaymentToday}
                    refetchHistoty={refetchHistory}
                />
            </Modal>

            {/* TABS: Grid en móvil, Flex en desktop */}
            <div className='bg-[#f5f1ea] grid grid-cols-3 sm:flex p-1 w-full sm:w-fit mt-5 rounded-xl gap-1'>
                <button
                    className={`text-black px-2 py-1.5 rounded-lg cursor-pointer text-xs sm:text-base ${selectedView === "hoy" ? "font-semibold bg-white shadow-sm" : ""}`}
                    onClick={() => setSelectedView("hoy")}
                >
                    Hoy
                </button>
                <button
                    className={`text-black px-2 py-1.5 rounded-lg cursor-pointer text-xs sm:text-base ${selectedView === "mes" ? "font-semibold bg-white shadow-sm" : ""}`}
                    onClick={() => setSelectedView("mes")}
                >
                    Este Mes
                </button>
                <button
                    className={`text-black px-2 py-1.5 rounded-lg cursor-pointer text-xs sm:text-base ${selectedView === "historial" ? "font-semibold bg-white shadow-sm" : ""}`}
                    onClick={() => setSelectedView("historial")}
                >
                    Historial
                </button>
            </div>

            <ListPageComponent
                searcher={false}
                select={false}
            >
                {
                    selectedView === "hoy" ? (
                    <div className='flex flex-col gap-3'>
                        <h2 className='font-semibold text-xl -mt-3 mb-4'>Transacciones de Hoy</h2>
                        {
                        !paymentToday?.length ? 
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/paymentNotFound.png" alt="" className="w-1/2 mx-auto" />
                            </div> 
                        :
                        paymentToday?.map((item: Paymenttype) => {
                            return (
                                // CARD RESPONSIVE
                                <div key={item.id} className='flex flex-col sm:flex-row p-4 border border-border-input rounded-xl justify-between gap-4 sm:gap-0 bg-white shadow-sm'>            
                                    <div className='flex items-start gap-4 w-full'>
                                        <div className='bg-[#ef4b671a] p-3 rounded-xl shrink-0 text-center min-w-[60px]'>
                                            <span className='text-red-500 font-bold text-sm block'>{getPaymentDate(item?.paymentDate)}</span>
                                        </div>

                                        <div className='flex flex-col w-full min-w-0'>
                                            <h3 className='font-semibold text-title text-base sm:text-lg truncate'>{item?.client?.firstName + " " + item?.client.lastName}</h3>
                                            <span className='text-paragraph text-sm'>{item?.service?.name}</span>
                                            <span className='text-gray-400 text-xs mt-1'>Recibo: REC-002</span>
                                        </div>
                                    </div>
                                        
                                    <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0'>
                                        <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item?.paymentMethod}</span>
                                        <div className="flex flex-col items-end">
                                            <span className='font-bold text-lg text-gray-900'>Bs {item?.amount}</span>
                                            <button 
                                                onClick={() => handleViewReceipt(item)}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-1"
                                            >
                                                <Receipt1 className="size-3"/> Ver Recibo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) }
                    </div>
                    )
                    
                    : selectedView === "mes" ? (
                        <div>
                            <h2 className='font-semibold text-xl -mt-3 mb-6'>Desglose por Método de Pago</h2>
                            <div className='flex flex-col gap-6 p-3 px-0 justify-between'>            
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center justify-between'>
                                        <p className='flex gap-2 text-base font-semibold items-center text-gray-700'><Wallet className='text-green-500 size-5'/> Efectivo</p>
                                        <p className='font-bold text-lg'>Bs {paymentMonth?.totalCashAmountMonth}</p>
                                    </div>
                                    
                                    <div className='w-full bg-[#f5f1ea] h-3 rounded-full overflow-hidden'>
                                        <div 
                                            className="bg-green-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${calculatePercentaje(paymentMonth?.totalCashAmountMonth, paymentMonth?.totalAmountMonth)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2' >
                                    <div className='flex items-center justify-between'>
                                        <p className='flex gap-2 text-base font-semibold items-center text-gray-700'><CreditCard className='text-blue-500 size-5'/> Tarjeta</p>
                                        <p className='font-bold text-lg'>Bs {paymentMonth?.totalCardAmountMonth}</p>
                                    </div>

                                    <div className='w-full bg-[#f5f1ea] h-3 rounded-full overflow-hidden'>
                                        <div 
                                            className="bg-blue-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${calculatePercentaje(paymentMonth?.totalCardAmountMonth, paymentMonth?.totalAmountMonth)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center justify-between'>
                                        <p className='flex gap-2 text-base font-semibold items-center text-gray-700'><Smartphone className='text-purple-500 size-5'/> QR / Transferencia</p>
                                        <p className='font-bold text-lg'>Bs {paymentMonth?.totalQRAmountMonth}</p>
                                    </div>

                                    <div className='w-full bg-[#f5f1ea] h-3 rounded-full overflow-hidden'>
                                        <div 
                                            className="bg-purple-500 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${calculatePercentaje(paymentMonth?.totalQRAmountMonth, paymentMonth?.totalAmountMonth)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    ) : (
                        // VISTA HISTORIAL
                        !paymenthHistory?.length ?
                            <div className='w-full h-full max-w-[500px] mx-auto items-center justify-center py-10 opacity-60'>
                                <img src="/paymentNotFound.png" alt="" className="w-1/2 mx-auto" />
                            </div> 
                        :
                        <div className='flex flex-col gap-3'>
                            <h2 className='font-semibold text-xl -mt-3 mb-4'>Historial de Pagos</h2>
                            {
                                paymenthHistory?.map((item: Paymenttype) => {
                                    return (
                                        // CARD RESPONSIVE
                                        <div key={item.id} className='flex flex-col sm:flex-row p-4 border border-border-input rounded-xl justify-between gap-4 sm:gap-0 bg-white shadow-sm'>            
                                            <div className='flex items-start gap-4 w-full'>
                                                <div className='bg-[#8b88891a] p-2 rounded-xl flex flex-col items-center justify-center min-w-[70px] shrink-0'>
                                                    <span className='text-xs text-gray-500'>{getPaymentDateYMD(item?.paymentDate)}</span>
                                                    <span className='font-bold text-gray-800 text-lg'>{getPaymentDate(item?.paymentDate)}</span>
                                                </div>

                                                <div className='flex flex-col w-full min-w-0'>
                                                    <h3 className='font-semibold text-title text-base sm:text-lg truncate'>{item?.client?.firstName + " " + item?.client.lastName}</h3>
                                                    <span className='text-paragraph text-sm'>{item?.service?.name}</span>
                                                    <span className='text-gray-400 text-xs mt-1'>Recibo: REC-002</span>
                                                </div>
                                            </div>
                                                
                                            <div className='flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-2 sm:mt-0'>
                                                <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-600">{item?.paymentMethod}</span>
                                                <div className="flex flex-col items-end">
                                                    <span className='font-bold text-lg text-gray-900'>Bs {item?.amount}</span>
                                                    <button 
                                                        onClick={() => handleViewReceipt(item)}
                                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-1"
                                                    >
                                                        <Receipt1 className="size-3"/> Ver Recibo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </ListPageComponent>

            {/* MODAL DE IMPRESIÓN */}
            {selectedPayment && (
            <Modal
                modalState={!!selectedPayment}
                setModalState={() => setSelectedPayment(null)}
                title="Imprimir Comprobante"
                description="Vista previa del recibo"
            >
                <div className="flex flex-col items-center gap-6 p-2">
                    <div ref={receiptRef} className="border shadow-sm p-4 rounded-lg bg-white">
                        <Receipt
                            customerName={`${selectedPayment.client.firstName} ${selectedPayment.client.lastName}`}
                            amount={selectedPayment?.amount}
                            date={getPaymentDateYMD(selectedPayment?.paymentDate)}
                            time={getPaymentDate(selectedPayment?.paymentDate)}
                            service={selectedPayment?.service?.name}
                            paymentMethod={selectedPayment?.paymentMethod}
                        />
                    </div>

                    <button
                        onClick={() => {
                            setTimeout(() => handlePrint(), 100);
                        }}
                        className="bg-[#ef4b67] hover:bg-[#d83a54] transition-colors flex items-center justify-center gap-2 text-white px-6 py-3 rounded-xl font-semibold w-full sm:w-auto shadow-lg shadow-red-200"
                    >
                        <Printer className="size-5" /> Imprimir Recibo
                    </button>
                </div>
            </Modal>
            )}
        </PageComponent>
    )
}

export default PaymentPage