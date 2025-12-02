import { useState } from 'react';
import { TriangleAlert, Trash2 } from 'lucide-react';
import axiosApi from '../../utlis/axiosApi';
import toast from 'react-hot-toast';

interface DeleteGastosOperativosModalProps {
    modalState: boolean;
    setModalState: (state: boolean) => void;
    id: number | null;
    refetch: () => void;
    refetchReports?: () => void;
}

const DeleteGastosOperativosModal = ({ 
    setModalState, 
    id, 
    refetch, 
    refetchReports 
}: DeleteGastosOperativosModalProps) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!id) {
            toast.error("Error: No se ha seleccionado ningún gasto.");
            return;
        }

        setLoading(true);
        try {
            await axiosApi.delete(`/gastos-operativos/${id}`);
            toast.success("Gasto eliminado correctamente");
            refetch();
            if (refetchReports) refetchReports();
            
            setModalState(false);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo eliminar el gasto. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center text-center p-2">
            
            {/* ICONO DE ADVERTENCIA */}
            <div className="bg-red-100 p-4 rounded-full mb-4 animate-in zoom-in duration-300">
                <TriangleAlert className="size-10 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Estás seguro?
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 max-w-[280px]">
                Esta acción eliminará el registro del gasto permanentemente y afectará los reportes financieros. No se puede deshacer.
            </p>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
                <button
                    disabled={loading}
                    onClick={() => setModalState(false)}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancelar
                </button>
                
                <button
                    disabled={loading}
                    onClick={handleDelete}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    ) : (
                        <>
                            <Trash2 className="size-4" /> Eliminar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default DeleteGastosOperativosModal;