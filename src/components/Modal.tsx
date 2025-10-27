import { X } from "lucide-react"
import type { ReactNode } from "react";

interface modalProps {
    title?: string;
    description?: string;
    modalState: boolean;
    setModalState: (state: boolean) => void;
    children: ReactNode
}

const Modal = ({title, description, modalState, setModalState, children}: modalProps) => {
    return (
        <>
        {
            modalState && 
            <div className="w-full h-full fixed inset-0 z-50 select-none top-0 bottom-0 bg-[rgba(0,0,0,0.49)] flex items-center justify-center p-10">
                <div className="w-130 min-h-24 bg-white relative rounded-lg shadow-indigo-950 p-7">
                    <div className="flex justify-between items-center mb-5 pb-5 ">
                        <div>
                            <h3 className="font-semibold text-title text-xl">{title}</h3>
                            <p className="text-paragraph text-base">{description}</p>
                        </div>
                        <X className="absolute top-4 right-4 cursor-pointer hover:bg-gray-200" onClick={() => setModalState(false)}/>
                    </div>
                    {
                        children
                    }
                </div>
            </div>
        }
        </>
    )
}

export default Modal