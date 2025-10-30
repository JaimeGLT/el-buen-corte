import React, { useState } from 'react'
import PageComponent from '../../components/PageComponent'
import { getHook } from '../../hooks/getHook'
import ListPageComponent from '../../components/ListPageComponent';
import { Clock, User } from 'lucide-react';

const PersonalPage = () => {

    const [ createPersonal, setCreatePersonal ] = useState<boolean>(false);

    const { data: reports } = getHook("/hairdresser/reports");

    const personalReports = [
        {
            title: "Total Personal",
            quantity: reports?.data?.totalPersonal,
            detail: "Activos"
        },
        {
            title: "Ingresos Totales",
            quantity: "Bs " +reports?.data?.totalIncome,
            detail: "Este mes"
        },
        {
            title: "Citas Totales",
            quantity: reports?.data?.totalAppointments,
            detail: "Este mes"
        }

    ]

    const { data } = getHook("/hairdresser")
    console.log(data?.data);
    

    return (
        <PageComponent
            title='Gestión de Personal'
            description='Administra tu equipo de trabajo'
            reports={personalReports}
            contentButton='+ Agregar Personal'
            modalSetState={setCreatePersonal}
            modalState={createPersonal}
        >
            <ListPageComponent
                searcher={false}
                select={false}
            >
                <div>
                    {
                        data?.data?.map((item: any) => {
                            return <div key={item?.id} className='p-3 border border-border-input rounded-xl flex gap-3'>
                                <div className='flex gap-3'>
                                    <div className='size-12 bg-gray-100 rounded-full flex items-center justify-center'>
                                        <User className='text-paragraph'/>
                                    </div>

                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-semibold'>{item?.firstName + " " + item?.lastName}</h3>
                                        <span className='text-sm text-paragraph'>{item?.hairdresserRole?.toLowerCase()}</span>
                                        <div className='text-sm text-paragraph flex gap-4'>
                                            <p>{item?.email}</p>
                                            <span>+{item?.phoneNumber}</span>
                                        </div>

                                        <div>
                                            {
                                                item?.specialties?.map((sp: any) => (
                                                    <span className='border border-border-input p-1 px-2 rounded-xl text-xs gap-2'>{sp}</span>
                                                ))
                                            }
                                        </div>

                                        <p className='flex gap-1 items-center text-sm text-paragraph items-center'><Clock className='size-3'/> Lun-Sab {item?.workingHoursStart}-{item?.workingHoursFinish}</p>
                                    </div>

                                </div>
                            </div>
                        })
                    }
                </div>
            </ListPageComponent>
        </PageComponent>
    )
}

export default PersonalPage