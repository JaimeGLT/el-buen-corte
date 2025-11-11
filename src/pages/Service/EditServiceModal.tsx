import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditServiceSchema } from './createServiceSchema';
import type { EditServiceType } from './CreateServiceType';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import type { Service } from '../../types/Service';
import { useEffect } from 'react';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    service: Service | null;
}

export const EditServiceModal = ({ modalState, setModalState, service }: ModalServiceProps) => {

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
            active: true,
            price: 0
        }
    });

  useEffect(() => {
    if (service) {
      reset({
        name: service.name ?? '',   
        description: service.description ?? '',
        category: service.type?.toLowerCase() ?? '',
        price: Number(service.price ?? 0),
        active: service.active,
        duration: service.duration,
      });
    }
  }, [service, reset]);

    
    const onSubmit = async (data: EditServiceType) => {

        const dataToSend = {
            name: data.name,
            description: data.description,
            active: data.active,
            type: data.category,
            price: Number(data.price.toFixed(2)),
            duration: `PT${data.duration}M`
        }
        
        try {
            await axiosApi.put("/service/"+service?.id, dataToSend);
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
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <Input 
                inputName='name'
                labelContent='Nombre del Servicio'
                placeholder='Ej: Corte Caballero'
                error={errors.name}
                {...register("name")}
            />

            <div className='flex gap-2 w-full'>
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
                    {...register("active", {
                        setValueAs: (v) => v === "true"
                    })}
                />
            </div>

            <div className='flex gap-5'>
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

            <div className='flex gap-2 items-center justify-end'>
                <ButtonComponent 
                    content='Cancelar'
                    modalState={modalState}
                    modalSetState={setModalState}
                    classNameButton='bg-white !text-black border px-5 border-border-input'
                    
                />
                <ButtonComponent 
                    content='Guardar Servicio'
                    modalSetState={setModalState}
                    modalState={modalState}
                    type="submit"
                />
            </div>
        </form>
    )
}
