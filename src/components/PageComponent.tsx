
interface Report {
    title: string;
    quantity: string;
    detail: string;
}

interface PageComponentProps {
    title: string;
    description: string;
    reports: Report[];
    children: any;
}

const PageComponent = ({ title, description, reports, children }: PageComponentProps) => {
    return (
        <main className="w-full p-5">
            <section className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold">{title}</h2>
                        <p className="text-lg">{description}</p>
                    </div>

                    <div>
                        <button>+ adfasdf</button>
                    </div>
                </div>

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

                </section>
                    {children}
                <section>
            </section>
        </main>
    )
}

export default PageComponent