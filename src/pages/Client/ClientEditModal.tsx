import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import type { ClientType } from './ClientType';
import { createClientSchema } from './ClientSchema';
import { useEffect } from 'react';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    client?: ClientType;
    id?: number;
}

export const ClientEditModal = ({ modalState, setModalState, client, id }: ModalServiceProps) => {

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
        console.log(dataToSend);
        
        try {
            await axiosApi.put("/client/"+ id, dataToSend);
            toast.success("Se guardaron los cambios.")
            
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
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
                    content='Guardar Cliente'
                    modalSetState={setModalState}
                    modalState={modalState}
                    type="submit"
                />
            </div>
        </form>
    )
}
