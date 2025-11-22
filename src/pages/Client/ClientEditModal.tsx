import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import type { ClientType } from './ClientType';
import { createClientSchema } from './ClientSchema';
import { useEffect } from 'react';
import { ScissorsLoader } from '../../components/ScissorsLoader';
import { getHook } from '../../hooks/getHook';
import { usePut } from '../../hooks/putHook';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    id?: number;
    refetch: () => void;
    refetchReports: () => void;
}

export const ClientEditModal = ({ modalState, setModalState, id, refetch, refetchReports }: ModalServiceProps) => {

    const { data: client, loading } = getHook<ClientType>(`/client/${id}`);
    const { execute, loading: loadingPut } = usePut(`/client/${id}`);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(createClientSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            observations: "",
            phoneNumber: ""
        }
    });

    useEffect(() => {
        if (client) {
          reset({
            firstName: client.firstName ?? '',   
            lastName: client.lastName ?? '',
            email: client.email ?? '',
            observations: client.observations ?? '',
            phoneNumber: client.phoneNumber ?? '',
          });
        }
      }, [client, reset]);

    const onSubmit = async (data: ClientType) => {
        const dataToSend = {
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            observations: data.observations || ""
        }
        
        try {
            await execute(dataToSend);
            await refetch();
            await refetchReports();
            setModalState(false);
            toast.success("Se guardaron los cambios.")
            
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
        <>
        {
            loading ?
            <div className='flex w-full h-full items-center justify-center'>
                <ScissorsLoader />
            </div> 
        :
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <div className='flex gap-5'>
                <Input 
                    inputName='firstName'
                    labelContent='Nombre'
                    placeholder='Ej: Juan'
                    error={errors.firstName}
                    {...register("firstName")}
                />
                <Input 
                    inputName='lastName'
                    labelContent='Apellido'
                    placeholder='Ej: Sanchez'
                    error={errors.lastName}
                    {...register("lastName")}
                />
            </div>

            <div className='flex gap-5'>
                <Input 
                    inputName="email"
                    labelContent='Email'
                    placeholder='cliente@gmail.com'
                    error={errors.email}
                    {...register("email")}
                />
                <Input 
                    inputName='phoneNumber'
                    labelContent='Teléfono'
                    placeholder='555-0000'
                    error={errors.phoneNumber}
                    {...register("phoneNumber")}
                />
            </div>
            
            <TextArea
                labelContent='Preferencias (opcional)'
                textAreaName='observations'
                placeholder='Preferencias de servicios, alergias, observaciones...'
                error={errors.observations}
                {...register("observations")}
            />

            <div className='flex gap-2 items-center justify-end'>
                <ButtonComponent 
                    content='Cancelar'
                    modalState={modalState}
                    modalSetState={setModalState}
                    classNameButton='bg-white !text-black border px-5 border-border-input'
                    
                />
                <ButtonComponent 
                    content={loadingPut ? 'Guardando...' : 'Guardar Cambios'}
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
