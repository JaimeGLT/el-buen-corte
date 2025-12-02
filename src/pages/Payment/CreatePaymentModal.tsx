import Input from '../../components/Input'
import Select from '../../components/Select'
import { getHook } from '../../hooks/getHook'
import type { ClientDetailType } from '../Client/ClientType'
import type { Service } from '../../types/Service'
import ButtonComponent from '../../components/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CreatePaymentType } from './PaymentType'
import { createPaymentSchema } from './paymentSchema'
import toast from 'react-hot-toast'
import { usePost } from '../../hooks/postHook'
import { ScissorsLoader } from '../../components/ScissorsLoader'

interface CreatePaymentProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    refetchReportToday: () => void;
    refetchReportMonth: () => void;
    refetchPaymentMonth: () => void;
    refetchPaymentToday: () => void;
    refetchHistoty: () => void;
}

const CreatePaymentModal = ({ modalState, setModalState, refetchReportToday, refetchReportMonth, refetchHistoty, refetchPaymentMonth, refetchPaymentToday }: CreatePaymentProps) => {

    const { data, loading: loadingClients } = getHook<any>("/client");
    const { data: services, loading: loadingServices } = getHook<any>("/service");
    
    const clientsfiltered = data?.map((client: ClientDetailType) => ({value: client.id, name: client.firstName + " " + client.lastName}));
    const servicesfiltered = services?.map((service: Service) => ({value: service.id, name: service.name}));

    const optsPaymentMethod = [
        {name: "Efectivo", value: "EFECTIVO"},
        {name: "Tarjeta", value: "TARJETA"},
        {name: "QR / Transferencia", value: "QR"},
    ]

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createPaymentSchema)
    });

    const { execute, loading: loadingPost } = usePost("/payment");

    const onSubmit = async (data: CreatePaymentType) => {
        try {
            await execute(data);
            await refetchHistoty();
            await refetchReportToday();
            await refetchPaymentMonth();
            await refetchReportMonth();
            await refetchPaymentToday();
            setModalState(false);
            toast.success("Pago registrado correctamente");
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
        <>
            {
                loadingClients || loadingServices ?
                    <div className='w-full h-full flex items-center justify-center'>
                        <ScissorsLoader />
                    </div> 
                    :
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
                        <Select 
                            selectName='clientId'
                            labelContent='Cliente'
                            placeholder='Selecciona un cliente'
                            opts={clientsfiltered}
                            {...register("clientId")}
                            error={errors.clientId}
                        />

                        <Select 
                            selectName='serviceId'
                            labelContent='Servicio'
                            placeholder='Selecciona un servicio'
                            opts={servicesfiltered}
                            {...register("serviceId")}
                            error={errors.serviceId}
                        />

                        <Input 
                            labelContent='Monto (Bs)'
                            inputName='amount'
                            type='number'
                            placeholder='0'
                            step={0.01}
                            {...register("amount")}
                            error={errors.amount}
                        />

                        <Select
                            labelContent='Método de Pago'
                            selectName='paymentMethod'
                            opts={optsPaymentMethod}    
                            {...register("paymentMethod")}
                            error={errors.paymentMethod}
                        />

                        <div className='flex flex-col sm:flex-row gap-2 items-center justify-end'>
                            <ButtonComponent 
                                content='Cancelar'
                                modalState={modalState}
                                modalSetState={setModalState}
                                classNameButton='bg-white !text-black border px-5 border-border-input'
                                
                            />
                            <ButtonComponent 
                                content={loadingPost ? 'Registrando...' : 'Registrar Pago'}
                                modalSetState={setModalState}
                                modalState={modalState}
                                type="submit"
                            />
                        </div>

                    </form>
            }
        </>
    )
}

export default CreatePaymentModal