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
import axiosApi from '../../utlis/axiosApi'
import toast from 'react-hot-toast'

interface CreatePaymentProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
}

const CreatePaymentModal = ({ modalState, setModalState }: CreatePaymentProps) => {

    const { data } = getHook("/client");
    const { data: services } = getHook("/service");
    
    const clientsfiltered = data?.data?.map((client: ClientDetailType) => ({value: client.id, name: client.firstName + " " + client.lastName}));
    const servicesfiltered = services?.data?.map((service: Service) => ({value: service.id, name: service.name}));

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

    const onSubmit = async (data: CreatePaymentType) => {
        try {
            await axiosApi.post("/payment", data);
            toast.success("Pago registrado correctamente");
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
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

            <div className='flex gap-2 items-center justify-end'>
                <ButtonComponent 
                    content='Cancelar'
                    modalState={modalState}
                    modalSetState={setModalState}
                    classNameButton='bg-white !text-black border px-5 border-border-input'
                    
                />
                <ButtonComponent 
                    content='Guardar Cliente'
                    modalSetState={setModalState}
                    modalState={modalState}
                    type="submit"
                />
            </div>

        </form>
    )
}

export default CreatePaymentModal