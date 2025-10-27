import { useForm, type FieldError } from 'react-hook-form';
import Input from '../../components/Input'
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import { createProductSchema } from './productSchema';
import type { createProductType } from './InventoryType';
import Select from '../../components/Select';
import { getHook } from '../../hooks/getHook';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    onSuccess?: () => void;
}

export const CreateProductModal = ({ modalState, setModalState, onSuccess }: ModalServiceProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createProductSchema)
    });

    const {data: categories} = getHook("/category")
    
    const categoriesFiltered = categories?.data?.map((item: any) => ({value: item?.id, name: item?.name}))
    
    const onSubmit = async (data: createProductType) => {
        const dataToSend = {
            name: data.name || "",
            brand: data.brand || "",
            initialStock: data.initialStock,
            minimumStock: data.minimumStock,
            price: data.price,
            supplier: data.supplier || "",
            category: data.category,
        }     
        
        try {
            await axiosApi.post("/product", dataToSend);
            toast.success("Producto creado con exito")
            onSuccess?.();
            setModalState(false);
            
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                <Input 
                    inputName='name'
                    labelContent='Nombre del Producto'
                    placeholder='Ej: Shampoo Premium'
                    error={errors.name}
                    {...register("name")}
                />

            <div className='flex gap-5'>
                <Select 
                    selectName='category'
                    opts={categoriesFiltered}
                    labelContent='Categoría'
                    error={errors.category as FieldError | undefined}
                    {...register("category")}
                />
                <Input 
                    inputName="brand"
                    labelContent='Marca'
                    placeholder="Ej: L'Oréal"
                    error={errors.brand}
                    {...register("brand")}
                />
            </div>
            
            <div className='flex gap-4 w-full'>
                <Input 
                    inputName="initialStock"
                    labelContent='Stock Inicial'
                    placeholder="0"
                    type="number"
                    error={errors.initialStock}
                    {...register("initialStock")}
                />
                <Input 
                    inputName="minimumStock"
                    labelContent='Stock Mínimo'
                    placeholder="0"
                    type="number"
                    error={errors.minimumStock}
                    {...register("minimumStock")}
                />
                <Input 
                    inputName="price"
                    labelContent='Precio (Bs)'
                    step={0.01}
                    placeholder="0"
                    type="number"
                    error={errors.price}
                    {...register("price")}
                />
            </div>

            <Input 
                inputName="supplier"
                labelContent='Proveedor'
                placeholder="Nombre del proveedor"
                error={errors.supplier}
                {...register("supplier")}
            />

            <div className='flex gap-2 items-center justify-end'>
                <ButtonComponent 
                    content='Cancelar'
                    modalState={modalState}
                    modalSetState={setModalState}
                    classNameButton='bg-white !text-black border px-5 border-border-input'
                    
                />
                <ButtonComponent 
                    content='Guardar Producto'
                    modalSetState={setModalState}
                    modalState={modalState}
                    type="submit"
                />
            </div>
        </form>
    )
}
