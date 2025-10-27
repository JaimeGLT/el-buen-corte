import { useForm } from 'react-hook-form';
import Input from '../../components/Input'
import TextArea from '../../components/TextArea';
import Select from '../../components/Select';
import ButtonComponent from '../../components/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { AppointmentType, EditAppointment } from './AppointmentType';
import { EditAppointmentSchema } from './AppointmentSchema';

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    appointment?: AppointmentType | null;
}

export const EditAppointmentModal = ({ modalState, setModalState, appointment }: ModalServiceProps) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(EditAppointmentSchema),
        defaultValues: {
            date: "",
            time: "",
            client: "",
            service: "",
            notes: "",
            phoneNumber: "",
            status: ""
        }
    });

  useEffect(() => {
    if (appointment) {
      reset({
            date: appointment.date,
            time: appointment.time.slice(0, 5),
            client: String(appointment.client.id),
            service: String(appointment.service.id),
            stylist: String(appointment.stylist.id),
            notes: appointment.notes,   
            status: appointment.status
      });
    }
  }, [appointment, reset]);

    
    const status = [
        {value: "PENDIENTE", name: "Pendiente"},
        {value: "CANCELADO", name: "Cancelada"},
        {value: "CONFIRMADO", name: "Confirmada"},
        {value: "COMPLETADO", name: "Completada"},
    ]

    const onSubmit = async (data: EditAppointment) => {


        const dataToSend = {
            date: data.date,
            time: data.time + ":00",
            client: data.client,
            service: data.service,
            stylist: data.stylist,
            notes: data.notes,
            status: data.status
        }
        console.log(dataToSend);
        
        try {
            await axiosApi.put("/cita/"+ appointment?.id, dataToSend);
            toast.success("Se guardaron los cambios.")
            
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
        <div className='max-h-[70vh] overflow-y-auto'>

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
                    <Input 
                        inputName='phoneNumber'
                        labelContent='Teléfono'
                        value={appointment?.client?.phoneNumber}
                        readOnly
                        error={errors.phoneNumber}
                        {...register("phoneNumber")}
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
                <Select 
                    selectName="status"
                    opts={status}
                    labelContent='Estado'
                    error={errors.status}
                    {...register("status")}
                />


                <TextArea
                    labelContent='notes'
                    textAreaName='Notas'
                    placeholder='Preferencias del cliente, observaciones especiales...'
                    error={errors.notes}
                    {...register("notes")}
                />

                <div className='flex gap-2 items-center justify-end'>
                    <ButtonComponent 
                        content='Cerrar'
                        modalState={modalState}
                        modalSetState={setModalState}
                        classNameButton='bg-white !text-black border px-5 border-border-input hover:bg-hover-bg'
                        
                    />
                    <ButtonComponent 
                        content='Guardar Cita'
                        modalSetState={setModalState}
                        modalState={modalState}
                        type="submit"
                    />
                </div>
            </form>
        </div>
    )
}
