import { useForm, type FieldError } from 'react-hook-form';
import Input from '../../components/Input'
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import Select from '../../components/Select';
import { getHook } from '../../hooks/getHook';
import type { createMovementType } from './MovementType';
import { createMovementSchema } from './movementSchema';
import { useEffect, useState } from 'react';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    onSuccess?: () => void;
}

export const CreateMovementModal = ({ modalState, setModalState, onSuccess }: ModalServiceProps) => {

    const [ selectedProduct, setSelectedProduct ] = useState<any>();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        resolver: zodResolver(createMovementSchema)
    });

    const {data: products, refetch} = getHook("/product")

    const watchedProduct = watch('product');

    useEffect(() => {
           if (!watchedProduct) return;

        const fetchProduct = async () => {
            try {
            const response = await axiosApi.get(`/product/${watchedProduct}`);
            setSelectedProduct(response.data);
            } catch (err) {
            console.error("Error al obtener el producto:", err);
            }
        };

        fetchProduct();
    }, [watchedProduct]);

    
    const productsFiltered = products?.data?.map((item: any) => ({value: item?.id, name: item?.name}));
    
    const movementType = [
        {name: "Entrada (compra)", value: "ENTRADA"},
        {name: "Salida (venta)", value: "SALIDA"}
    ]

    const onSubmit = async (data: createMovementType) => {
        
        if (
        data.movementType === "SALIDA" && 
        selectedProduct && 
        data.quantity > selectedProduct.initialStock
        ) {
        toast.error(`No puedes retirar más de ${selectedProduct.initialStock} unidades disponibles.`);
        return;
        }

        const dataToSend = {
            movementType: data.movementType || "",
            quantity: data.quantity,
            product: data.product,
            reason: data.reason
        }
        
        try {
            await axiosApi.post("/movement", dataToSend);
            toast.success("Movimiento realizado con exito");
            await refetch();
            await onSuccess?.();
            setModalState(false);
            
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <Select 
                selectName='movementType'
                labelContent='Tipo de Movimiento'
                opts={movementType}
                error={errors.movementType}
                {...register("movementType")}
            />

            <Select 
                selectName='product'
                labelContent='Producto'
                placeholder='Seleccionar producto'
                opts={productsFiltered}
                error={errors.product as FieldError | undefined}
                {...register("product")}
            />

            <Input 
                inputName="quantity"
                labelContent='Cantidad'
                placeholder="0"
                type="number"
                error={errors.quantity}
                {...register("quantity")}
            />

            <Input 
                inputName="reason"
                labelContent='Movimiento'
                placeholder="Ej: Compra, venta..."
                error={errors.reason}
                {...register("reason")}
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
