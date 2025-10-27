import { ArrowUpDown } from "lucide-react";
import ButtonComponent from "./Button";


interface Report {
    title: string;
    quantity: string;
    detail: string;
}

interface PageComponentProps {
    title: string;
    description: string;
    reports?: Report[];
    contentButton: string;
    children: any;
    modalState: boolean;
    modalSetState: (state: boolean) => void;
    secondButton?: boolean;
    secondButtonState?: boolean;
    setSecondButtonState?: (state: boolean) => void;
}

const PageComponent = ({ title, description, reports, children, contentButton,modalState, modalSetState, secondButton, setSecondButtonState }: PageComponentProps) => {
    return (
        <>

            <main className="w-full p-5">
                <section className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold">{title}</h2>
                            <p className="text-lg">{description}</p>
                        </div>

                        <div className="flex gap-5 items-center">
                            {
                                secondButton && (
                                    <button 
                                        className="flex items-center gap-2 border border-border-input rounded-xl p-2 px-3 text-base hover:bg-hover-bg cursor-pointer"
                                        onClick={() => setSecondButtonState && setSecondButtonState(true)}
                                    >
                                        <ArrowUpDown className="size-4"/> Registrar Movimiento</button>
                                )
                            }
                            <ButtonComponent modalState={modalState} modalSetState={() => modalSetState(true)} content={contentButton}/>
                        </div>

                    </div>

                    {
                        reports && 
                            <div className="flex items-center justify-between gap-3">
                                {
                                    reports?.map((report, index) => (
                                        <div key={index} className="border-gray-300 border rounded-xl p-4 gap-3 flex flex-col w-full">
                                            <h3 className="text-base">{report.title}</h3>
                                            <div className="mt-3 flex flex-col gap-1">
                                                <span className="text-2xl font-bold">{report.quantity}</span>
                                                <span className="text-sm">{report.detail}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                    }

                    </section>
                        {children}
                    <section>
                </section>
            </main>
        </>
    )
}

export default PageComponent