import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { usePost } from '../../hooks/postHook';
import GastosOperativos from './GastosOperativos';
import { createGastosOperativos } from './GastosOperativosSchema';
import type { GastosOperativosType } from './GastosOperativosType';

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

    const { execute, loading } = usePost<GastosOperativosType, GastosOperativosType>("/gastos-operativos");

    const onSubmit = async (data: GastosOperativosType) => {
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

            <div className='flex gap-2 items-center justify-end'>
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
