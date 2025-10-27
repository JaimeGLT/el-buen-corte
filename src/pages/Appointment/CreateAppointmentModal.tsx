import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import type { CreateAppointment } from './AppointmentType';
import { createAppointmentSchema } from './AppointmentSchema';
import { useEffect, useState } from 'react';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
}

export const CreateAppointmentModal = ({ modalState, setModalState }: ModalServiceProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(createAppointmentSchema)
    });

    
    const onSubmit = async (data: CreateAppointment) => {
        const dataToSend = {
            date: data.date,
            time: data.time + ":00",
            client: data.client,
            service: data.service,
            stylist: data.stylist,
            notes: data.notes,
            status: "PENDIENTE"
        }
        console.log(dataToSend);
        
        try {
            await axiosApi.post("/cita", dataToSend);
            toast.success("Cita creado con exito")
            
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

    const [clients, setClients] = useState<{ value: string; name: string }[]>([]);
    const [stylists, setStylists] = useState<{ value: string; name: string }[]>([]);
    const [services, setServices] = useState<{ value: string; name: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const [clientsRes, stylistsRes, servicesRes] = await Promise.all([
                axiosApi.get('/client'),
                axiosApi.get('/hairdresser'),
                axiosApi.get('/service')
            ]);

            setClients(
                clientsRes.data.map((c: any) => ({
                value: String(c.id),
                name: `${c.firstName} ${c.lastName}`
                }))
            );

            setStylists(
                stylistsRes.data.map((s: any) => ({
                value: String(s.id),
                name: `${s.firstName} ${s.lastName}`
                }))
            );

            setServices(
                servicesRes.data.map((s: any) => ({
                value: String(s.id),
                name: s.name
                }))
            );
            } catch (error) {
            toast.error('Error al cargar datos');
            }
        };

        fetchData(); 
    }, []);

    return (
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>

            <div className='flex gap-2 w-full'>
                <Input 
                    inputName='date'
                    labelContent='Fecha'
                    type='date'
                    placeholder='Ej: Corte Caballero'
                    error={errors.date}
                    {...register("date")}
                />
                <Select
                    selectName='time' 
                    labelContent='Hora'
                    opts={hours}
                    error={errors.time}
                    {...register("time")}
                />
            </div>

            <div className='flex gap-5'>
                <Select 
                    selectName="client"
                    labelContent='Cliente'
                    opts={clients}
                    error={errors.client}
                    {...register("client")}
                />
            </div>
            
            <Select 
                selectName="stylist"
                opts={stylists}
                labelContent='Estilista'
                error={errors.stylist}
                {...register("stylist")}
            />
            <Select 
                selectName="service"
                opts={services}
                labelContent='Servicio'
                error={errors.service}
                {...register("service")}
            />

            <TextArea
                labelContent='Notas (opcional)'
                textAreaName='notes'
                placeholder='Preferencias del cliente, observaciones especiales...'
                error={errors.notes}
                {...register("notes")}
            />

            <div className='flex gap-2 items-center justify-end'>
                <ButtonComponent 
                    content='Cerrar'
                    modalState={modalState}
                    modalSetState={setModalState}
                    classNameButton='bg-white !text-black border px-5 border-border-input'
                    
                />
                <ButtonComponent 
                    content='Guardar Cita'
                    modalSetState={setModalState}
                    modalState={modalState}
                    type="submit"
                />
            </div>
        </form>
    )
}
