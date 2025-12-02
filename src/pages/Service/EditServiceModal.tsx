import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditServiceSchema } from './createServiceSchema';
import type { EditServiceType } from './CreateServiceType';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { getHook } from '../../hooks/getHook';
import type { Service } from '../../types/Service';
import { ScissorsLoader } from '../../components/ScissorsLoader';
import { usePut } from '../../hooks/putHook';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    refetch: () => void;
    refetchReports: () => void;
    id: number | undefined;
}

export const EditServiceModal = ({ modalState, setModalState, refetch, refetchReports, id }: ModalServiceProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(EditServiceSchema),
        defaultValues: {
            category: "",
            description: "",
            duration: 0,
            name: "",
            active: "",
            price: 0
        }
    });
    
    const { data: service, loading } = getHook<Service>(`/service/${id}`);
    const { execute, loading: loadingPut } = usePut(`/service/${id}`);
    

  useEffect(() => {
    if (service) {
      reset({
        name: service.name ?? '',   
        description: service.description ?? '',
        category: service.type?.toLowerCase() ?? '',
        price: Number(service.price ?? 0),
        active: service.active ? "true" : "false",
        duration: service.duration,
      });
    }
    
  }, [service, reset]);

    
    const onSubmit = async (data: EditServiceType) => {

        const dataToSend = {
            name: data.name,
            description: data.description,
            active: data.active === "true",
            type: data.category,
            price: Number(data.price.toFixed(2)),
            duration: `PT${data.duration}M`
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

    const categories = [
        {value: "corte", name: "Corte"},
        {value: "color", name: "Color"},
        {value: "tratamiento", name: "Tratamiento"},
        {value: "peinado", name: "Peinado"},
        {value: "combo", name: "Combo"},
    ]

    return (
        <>
        {
            loading ?
                <div className='flex w-full h-full items-center justify-center'>
                    <ScissorsLoader />
                </div> 
            :
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                <Input 
                    inputName='name'
                    labelContent='Nombre del Servicio'
                    placeholder='Ej: Corte Caballero'
                    error={errors.name}
                    {...register("name")}
                />

                <div className='flex flex-col sm:flex-row gap-2 w-full'>
                    <Select
                        selectName='category' 
                        labelContent='Categoría'
                        opts={categories}
                        error={errors.category}
                        {...register("category")}
                    />
                    <Select
                        selectName='active' 
                        labelContent='Estado'
                        opts={[{value: "true", name: "Activo"}, {value: "false", name: "Inactivo"}]}
                        error={errors.active}
                        {...register("active")}
                    />
                </div>

                <div className='flex flex-col sm:flex-row gap-5'>
                    <Input 
                        inputName="price"
                        labelContent='Precio (Bs)'
                        type='number'
                        placeholder='0'
                        step="0.01"
                        error={errors.price}
                        {...register("price", { valueAsNumber: true })}
                    />
                    <Input 
                        inputName='duration'
                        labelContent='Duración (min)'
                        placeholder='30'
                        type='number'
                        error={errors.duration}
                        {...register("duration", { valueAsNumber: true })}
                    />
                </div>
                
                <TextArea
                    labelContent='Descripción'
                    textAreaName='description'
                    placeholder='Descripción del servicio...'
                    error={errors.description}
                    {...register("description")}
                />

                <div className='flex flex-col sm:flex-row gap-2 items-center justify-end'>
                    <ButtonComponent 
                        content='Cancelar'
                        modalState={modalState}
                        modalSetState={setModalState}
                        classNameButton='bg-white !text-black border px-5 border-border-input'
                        
                    />
                    <ButtonComponent 
                        content={loadingPut ? 'Guardando...' :'Guadar Cambios'}
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
