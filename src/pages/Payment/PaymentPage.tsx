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

    const { data: reportsToday } = getHook("/payment/reports_today");
    const { data: reportsMonth } = getHook("/payment/reports_month");

    const { data: paymentToday } = getHook("/payment/today");
    const { data: paymentMonth } = getHook("/payment/month");
    const { data: paymenthHistory } = getHook("/payment");

    const calculatePercentaje = (amountType: number, totalAmount:number ) => {
        return totalAmount ? (amountType / totalAmount) * 100 : 0;
    }

    const reportsTodayFiltered = [
        {
            title: "Total Hoy", 
            quantity: "Bs " + reportsToday?.data?.totalPaymentAmountToday, 
            detail: reportsToday?.data?.totalTransactionsToday + " transacciones"
        },
        {
            title: "Efectivo", 
            quantity: "Bs " + reportsToday?.data?.totalCashAmountToday, 
            detail: calculatePercentaje(reportsToday?.data?.totalCashAmountToday, reportsToday?.data?.totalPaymentAmountToday) + "% del total"
        },
        {
            title: "Tarjeta", 
            quantity: "Bs " + reportsToday?.data?.totalCardAmountToday, 
            detail: calculatePercentaje(reportsToday?.data?.totalCardAmountToday, reportsToday?.data?.totalPaymentAmountToday) + "% del total",
        },
        {
            title: "QR / Transfer", 
            quantity: "Bs " + reportsToday?.data?.totalQRAmountToday, 
            detail: calculatePercentaje(reportsToday?.data?.totalQRAmountToday, reportsToday?.data?.totalPaymentAmountToday) + "% del total"
        }
    ]

    const reportsMonthFiltered = [
        {
            title: "Total Mes", 
            quantity: "Bs " + reportsMonth?.data?.totalAmountMonth, 
            detail: reportsMonth?.data?.totalTransactionsMonth + " transacciones"
        },
        {
            title: "Promedio Diario", 
            quantity: "Bs " + reportsMonth?.data?.averageDaily?.toFixed(2), 
            detail: "De este mes"
        },
        {
            title: "Efectivo", 
            quantity: "Bs " + reportsMonth?.data?.totalCash, 
            detail: calculatePercentaje(reportsMonth?.data?.totalCash, reportsMonth?.data?.totalAmountMonth) + "% del total",
        },
        {
            title: "Digital", 
            quantity: "Bs " + reportsMonth?.data?.totalDigital, 
            detail: calculatePercentaje(reportsMonth?.data?.totalDigital, reportsMonth?.data?.totalAmountMonth) + "% del total"
        }
    ]

    const [selectedPayment, setSelectedPayment] = useState<Paymenttype | null>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef, // ✅ forma nueva para react-to-print v3+
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
                />
            </Modal>
            <div className='bg-[#f5f1ea] flex p-1 w-fit mt-5 rounded-xl'>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "hoy" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("hoy")}
                >
                    Hoy
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "mes" ? "font-semibold bg-white rounded-xl" : ""}`}
                    onClick={() => setSelectedView("mes")}
                >
                    Este Mes
                </button>
                <button
                    className={` text-black px-2 py-1 rounded cursor-pointer ${selectedView === "historial" ? "font-semibold bg-white rounded-xl" : ""}`}
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
                    selectedView === "hoy" ?
                        paymentToday?.data?.map((item: Paymenttype) => {

                            return (
                                <div>
                                    <h2 className='font-semibold text-xl -mt-3 mb-6'>Transacciones de Hoy</h2>
                                    <div key={item.id} className='flex p-3 border border-border-input rounded-xl justify-between'>            

                                        <div className='flex items-center gap-5'>
                                            <div className='bg-[#ef4b671a] p-3 rounded-xl'>
                                                <span className='text-red-500 font-semibold'>{getPaymentDate(item?.paymentDate)}</span>
                                            </div>

                                            <div className='flex flex-col'>
                                                <h3 className='font-semibold text-title text-lg'>{item?.client?.firstName + " " + item?.client.lastName}</h3>
                                                <span className='text-paragraph text-base'>{item?.service?.name}</span>
                                                <span className='text-paragraph text-base'>Recibo: REC-002</span>
                                            </div>

                                        </div>
                                            
                                        <div className='flex items-center gap-4'>
                                            <span className="">{item?.paymentMethod}</span>
                                            <div>
                                                <span>Bs {item?.amount}</span>
                                                <button><Receipt1 /> Ver Recibo</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )
                        }) : selectedView === "mes" ?
                            <div>
                                <h2 className='font-semibold text-xl -mt-3 mb-6'>Desglose por Método de Pago</h2>
                                <div className='flex flex-col gap-5 p-3 px-0 justify-between'>            
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center justify-between'>
                                            <p className='flex gap-2 text-base font-semibold items-center'><Wallet className='text-green-500'/> Efectivo</p>
                                            <p className='font-semibold'>Bs {paymentMonth?.data?.totalCashAmountMonth}</p>
                                        </div>
                                        
                                        <div className='w-full bg-[#f5f1ea] h-2 rounded-xl'>
                                            <div 
                                            className="bg-green-500 h-2 rounded-xl"
                                            style={{ width: `${calculatePercentaje(paymentMonth?.data?.totalCashAmountMonth, paymentMonth?.data?.totalAmountMonth)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-2' >
                                        <div className='flex items-center justify-between'>
                                            <p className='flex gap-2 text-base font-semibold items-center'><CreditCard className='text-blue-500'/> Tarjeta</p>
                                            <p className='font-semibold'>Bs {paymentMonth?.data?.totalCardAmountMonth}</p>
                                        </div>

                                        <div className='w-full bg-[#f5f1ea] h-2 rounded-xl'>
                                            <div 
                                            className="bg-blue-500 h-2 rounded-xl"
                                            style={{ width: `${calculatePercentaje(paymentMonth?.data?.totalCardAmountMonth, paymentMonth?.data?.totalAmountMonth)}%` }}
                                            ></div>
                                        </div>
                                        
                                    </div>

                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center justify-between'>
                                            <p className='flex gap-2 text-base font-semibold items-center'><Smartphone className='text-purple-500'/> QR / Transferencia</p>
                                            <p className='font-semibold'>Bs {paymentMonth?.data?.totalQRAmountMonth}</p>
                                        </div>

                                        <div className='w-full bg-[#f5f1ea] h-2 rounded-xl'>
                                            <div 
                                            className="bg-purple-500 h-2 rounded-xl"
                                            style={{ width: `${calculatePercentaje(paymentMonth?.data?.totalQRAmountMonth, paymentMonth?.data?.totalAmountMonth)}%` }}
                                            ></div>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div> : 
                            paymenthHistory?.data?.map((item: Paymenttype) => {

                                return (
                                    <div>
                                        <h2 className='font-semibold text-xl -mt-3 mb-6'>Historial de Pagos</h2>
                                        <div key={item.id} className='flex p-3 border border-border-input rounded-xl justify-between'>            

                                            <div className='flex items-center gap-5 justify-center'>
                                                <div className='bg-[#8b88891a] p-3 rounded-xl flex flex-col py-3'>
                                                    <span className='text-sm text-center'>{getPaymentDateYMD(item?.paymentDate)}</span>
                                                    <span className='font-semibold text-center'>{getPaymentDate(item?.paymentDate)}</span>
                                                </div>

                                                <div className='flex flex-col'>
                                                    <h3 className='font-semibold text-title text-lg'>{item?.client?.firstName + " " + item?.client.lastName}</h3>
                                                    <span className='text-paragraph text-base'>{item?.service?.name}</span>
                                                    <span className='text-paragraph text-base'>REcibo: REC-002</span>
                                                </div>

                                            </div>
                                                
                                            <div className='flex items-center gap-4'>
                                                <span className="">{item?.paymentMethod}</span>
                                                <div>
                                                    <span>Bs {item?.amount}</span>
                                                    <button
                                                        onClick={() => handleViewReceipt(item)}
                                                        className="flex items-center gap-1 text-blue-600 hover:underline"
                                                        >
                                                        <Receipt1 /> Ver Recibo
                                                        </button>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })
                }
            </ListPageComponent>
            {selectedPayment && (
            <Modal
                modalState={!!selectedPayment}
                setModalState={() => setSelectedPayment(null)}
            >
                <div className="flex flex-col items-center gap-4">
                {/* Ref debe ir en un div que siempre esté presente en el DOM */}
                <div ref={receiptRef}>
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
                    // Esperar un tick para que el div esté montado
                    setTimeout(() => handlePrint(), 50);
                    }}
                    className="bg-primary-bg flex gap-2 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                    <Printer /> Imprimir Recibo
                </button>
                </div>
            </Modal>
            )}


        </PageComponent>
    )
}

export default PaymentPage