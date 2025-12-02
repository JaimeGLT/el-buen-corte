import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createGastosOperativos } from './GastosOperativosSchema';
import type { GastosOperativosCreateType, GastosOperativosType } from './GastosOperativosType';
import { useEffect } from 'react';
import { getHook } from '../../hooks/getHook';
import { usePut } from '../../hooks/putHook';
import { ScissorsLoader } from '../../components/ScissorsLoader';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    refetch: () => void;
    refetchReports: () => void;
    id: number | null
}

export const EditarGastosOperativosModal = ({ modalState, id, setModalState, refetch, refetchReports }: ModalServiceProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(createGastosOperativos),
        defaultValues: {
            concepto: "",
            monto: 0,
            fecha: ""
        }
    });

    const { data: gasto, loading: loadingGasto } = getHook<GastosOperativosType>(`/gastos-operativos/${id}`);

    useEffect(() => {
        if(gasto) {
            reset({
                concepto: gasto?.concepto ?? "",
                monto: gasto?.monto ?? 0,
                fecha: gasto?.fecha ?? ""
            })

        }
    }, [gasto, reset])

    const { execute, loading } = usePut<GastosOperativosCreateType, GastosOperativosCreateType>("/gastos-operativos/"+id);

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
        <>
            {
                loadingGasto ?             
                <div className='flex w-full h-full items-center justify-center'>
                    <ScissorsLoader />
                </div>  :

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
                        step="0.01"
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
                            content={loading ? 'Guardando...' : 'Guardar Cambios'}
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
