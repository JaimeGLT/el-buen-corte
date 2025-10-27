import { Mail, Phone } from "lucide-react";
import type { ClientDetailType } from "./ClientType";

interface ModalServiceProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    client?: ClientDetailType;
}

export const DetailClientModal = ({ setModalState, client }: ModalServiceProps) => {
    const clientWithCitas = {
        citas: client?.citas || []
    };

    
    let total = 0;

    client?.citas?.forEach(cita => {
        total += cita.price;
    })

    return (
        <div className="max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col text-paragraph">
                
                <div className="flex flex-col gap-1">
                    <p className="flex text-sm items-center gap-2"><Mail size={15}/> {client?.email}</p>
                    <p className="flex text-sm items-center gap-2"><Phone size={15}/> {client?.phoneNumber}</p>
                </div>

                <div className="flex gap-3 w-full justify-between mt-6">
                    <div className="border border-border-input flex flex-col p-4 items-center justify-center w-full rounded-xl pt-6 gap-3">
                        <span className="text-center text-lg font-bold">{client?.citas?.length}</span>
                        <p className="text-center text-xs "> Visitas Totales</p>
                    </div>
                    <div className="border border-border-input flex flex-col p-4 items-center justify-center w-full rounded-xl pt-6 gap-3">
                        <span className="text-center text-lg font-bold">Bs {total?.toFixed(2)}</span>
                        <p className="text-center text-xs">Gasto Total</p>
                    </div>
                    <div className="border border-border-input flex flex-col p-4 items-center justify-center w-full rounded-xl pt-6 gap-3">
                        <span className="text-center text-lg font-bold">Bs {clientWithCitas.citas?.length > 0 ? (total / clientWithCitas?.citas?.length).toFixed(2) : 0}</span>
                        <p className="text-center text-xs">Promedio/Visita</p>
                    </div>
                </div>
            </div>

            <div className="border border-border-input rounded-xl p-5 flex flex-col gap-5 mt-5">
                <h3 className="text-base font-semibold text-title">Preferencias y Observaciones</h3>
                <p className="text-sm">{client?.observations}</p>
            </div>

            <div className="mt-5 border border-border-input rounded-xl p-5">
                <h3 className="text-base font-semibold text-title mb-4">Historial de Servicios</h3>

                {
                    client?.citas?.map(item => (
                        <div key={item.id} className="p-3 bg-pink-50 rounded-xl flex gap-2 justify-between items-center my-2">
                            <div className="flex gap-1 flex-col">
                                <h4 className="font-semibold text-sm">{item?.service}</h4>
                                <p className="text-paragraph text-xs">{item?.date}   • {item?.stylist}</p>
                            </div>

                            <span className="font-semibold text-base">Bs {item?.price}</span>
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-end">
                <button className="hover:bg-[#d6ceff]  border-border-input border rounded-xl p-2 px-5 cursor-pointer mt-5" onClick={() => setModalState(false)}>Cerrar</button>
            </div>
        </div>
    )
}
