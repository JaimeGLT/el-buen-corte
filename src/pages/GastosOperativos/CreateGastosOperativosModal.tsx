import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { usePost } from '../../hooks/postHook';
import { createGastosOperativos } from './GastosOperativosSchema';
import type { GastosOperativosCreateType } from './GastosOperativosType';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    refetch: () => void;
    refetchReports: () => void;
}

export const CreateGastosOperativosModal = ({ modalState, setModalState, refetch, refetchReports }: ModalServiceProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createGastosOperativos)
    });

    const { execute, loading } = usePost<GastosOperativosCreateType, GastosOperativosCreateType>("/gastos-operativos");

    const onSubmit = async (data: GastosOperativosCreateType) => {
        const dataToSend = {
            monto: data.monto,
            concepto: data.concepto || "",
            fecha: data.fecha || "",
        }
        
        try {
            await execute(dataToSend);
            await refetch();
            setModalState(false);
            toast.success("Gasto creado con exito");
            await refetchReports();
            
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <Input 
                inputName='concepto'
                labelContent='Concepto'
                placeholder='Ej: Pago de luz'
                error={errors.concepto}
                {...register("concepto")}
            />
            <Input 
                inputName='fecha'
                labelContent='Fecha'
                type='date'
                error={errors.fecha}
                {...register("fecha")}
            />

            <Input 
                inputName="monto"
                labelContent='Monto'
                type='number'
                placeholder='Bs 450'
                error={errors.monto}
                {...register("monto")}
            />

            <div className='flex flex-col sm:flex-row gap-2 items-center justify-end'>
                <ButtonComponent 
                    content='Cancelar'
                    modalState={modalState}
                    modalSetState={setModalState}
                    classNameButton='bg-white !text-black border px-5 border-border-input'
                    
                />
                <ButtonComponent 
                    content={loading ? 'Añadiendo...' : 'Añadir Gastos'}
                    modalSetState={setModalState}
                    modalState={modalState}
                    type="submit"
                />
            </div>
        </form>
    )
}
