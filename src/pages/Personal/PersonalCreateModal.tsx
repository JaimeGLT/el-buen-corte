import Input from '../../components/Input'
import Select from '../../components/Select'
import ButtonComponent from '../../components/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import axiosApi from '../../utlis/axiosApi'
import toast from 'react-hot-toast'
import type { PersonalType } from './PersonalType'
import { personalCreateSchema } from './personalSchema'

interface CreatePaymentProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
}

const PersonalCreateModal = ({ modalState, setModalState }: CreatePaymentProps) => {
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
       resolver: zodResolver(personalCreateSchema),
       defaultValues: {
        workingHoursStart: "09:00",
        workingHoursFinish: "18:00",
        firstName: "",
        lastName: "",
        hairdresserRole: "",
        email: "",
        phoneNumber: "",
        specialties: ""
    },
    });

    const roles = [
        {value: "BARBERO", name: "Barbero"},
        {value: "ESTILISTA", name: "Estilista"},
        {value: "COLORISTA", name: "Colorista"},
        {value: "TRATAMIENTO", name: "Tratamiento"},
    ]

    const onSubmit = async (data: PersonalType) => {
        const normalizeTime = (t: string) => (t.length === 5 ? `${t}:00` : t);

        const dataToSend = {        
            email: data.email,
            firstName: data.firstName,
            hairdresserRole: data.hairdresserRole,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            specialties: [data.specialties],
            workingHoursStart: normalizeTime(data.workingHoursStart),
            workingHoursFinish: normalizeTime(data.workingHoursFinish),
            password: String(Math.random() * 23647374),
            role: "ADMINISTRADOR"
        }
        
        console.log(dataToSend);
        try {
            await axiosApi.post("/hairdresser", dataToSend);
            
            toast.success("Personal registrado correctamente");
        } catch (error) {
            toast.error("Ocurrió un error")
        }
    }

    const hours = [
        { value: "09:00", name: "9:00" },
        { value: "09:30", name: "9:30" },
        { value: "10:00", name: "10:00" },
        { value: "10:30", name: "10:30" },
        { value: "11:00", name: "11:00" },
        { value: "11:30", name: "11:30" },
        { value: "12:00", name: "12:00" },
        { value: "12:30", name: "12:30" },
        { value: "13:00", name: "13:00" },
        { value: "13:30", name: "13:30" },
        { value: "14:00", name: "14:00" },
        { value: "14:30", name: "14:30" },
        { value: "15:00", name: "15:00" },
        { value: "15:30", name: "15:30" },
        { value: "16:00", name: "16:00" },
        { value: "16:30", name: "16:30" },
        { value: "17:00", name: "17:00" },
        { value: "17:30", name: "17:30" },
        { value: "18:00", name: "18:00" },
        { value: "18:30", name: "18:30" },
    ];

    return (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <Input 
                inputName='firstName'
                labelContent='Primer Nombre'
                placeholder='Ana'
                {...register("firstName")}
                error={errors.firstName}
            />

            <Input 
                inputName='lastName'
                labelContent='Primer apellido'
                placeholder='Pérez'
                {...register("lastName")}
                error={errors.lastName}
            />

            <div className='flex gap-2'>
                <Input 
                    labelContent='Correo Electrónico'
                    inputName='email'
                    placeholder='Ej: ejemplo@ejemplo.com'
                    {...register("email")}
                    error={errors.email}
                />

                <Input
                    labelContent='Número de Teléfono'
                    placeholder='Ej: +591 849388443'
                    inputName='phoneNumber'   
                    {...register("phoneNumber")}
                    error={errors.phoneNumber}
                />
            </div>

            <div className='flex gap-2 mb-3'>
                <Select
                    labelContent='Horas de Inicio'
                    selectName='workingHoursStart'  
                    opts={hours} 
                    {...register("workingHoursStart")}
                    error={errors.workingHoursStart}
                />

                <Select
                    labelContent='Horas de Fin'
                    selectName='workingHoursFinish'   
                    {...register("workingHoursFinish")}
                    opts={hours}
                    error={errors.workingHoursFinish}
                />
            </div>

            <Select 
                selectName='hairdresserRole'
                labelContent='Rol'
                opts={roles}
                {...register("hairdresserRole")}
                error={errors.hairdresserRole}

            />

            <Input
                labelContent='Especialidades'
                placeholder='Ej: Teñido de pelo'
                inputName='specialties'   
                {...register("specialties")}
                error={errors.specialties}
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

export default PersonalCreateModal