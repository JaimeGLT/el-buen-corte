import { ArrowUpDown } from "lucide-react";
import ButtonComponent from "./Button";
import Select from "./Select";
import { ScissorsLoader } from "./ScissorsLoader";
import type { ReactNode } from "react";

interface Report {
  title: string;
  quantity: string;
  detail: string;
}

interface SelectOpt {
  value: string;
  name: string;
}

interface PageComponentProps {
  title: string;
  description: string;
  reports?: Report[];
  contentButton: string;
  children: ReactNode;
  modalState: boolean;
  modalSetState: (state: boolean) => void;
  secondButton?: boolean;
  secondButtonState?: boolean;
  setSecondButtonState?: (state: boolean) => void;
  selectTrue?: boolean;
  selectOpts?: SelectOpt[];
  onFilterChange?: (value: "semanal" | "mensual" | "anual") => void;
  onClick?: () => void;
  loading?: boolean;
}

const PageComponent = ({
  title,
  description,
  reports,
  children,
  contentButton,
  modalState,
  modalSetState,
  secondButton,
  setSecondButtonState,
  selectTrue,
  selectOpts,
  onFilterChange,
  onClick,
  loading,
}: PageComponentProps) => {
  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-100px)] items-center justify-center">
        <ScissorsLoader />
      </div>
    );
  }

  return (
    <main className="w-full p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 md:gap-8">
        
        <section className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              {description}
            </p>
          </div>

          {/* Actions Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {secondButton && (
              <button
                className="flex items-center justify-center gap-2 border border-border-input rounded-xl p-2.5 px-4 text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                onClick={() => setSecondButtonState && setSecondButtonState(true)}
              >
                <ArrowUpDown className="size-4" />
                <span>Registrar Movimiento</span>
              </button>
            )}

            {selectTrue && (
              <div className="w-full sm:w-40">
                <Select
                  selectName="filtro"
                  opts={selectOpts || []}
                  onChange={(e) =>
                    onFilterChange && onFilterChange(e.target.value as any)
                  }
                />
              </div>
            )}

            <div className="w-full sm:w-auto">
                <ButtonComponent
                modalState={modalState}
                modalSetState={modalSetState}
                content={contentButton}
                onClick={onClick}
                />
            </div>
          </div>
        </section>

        {/* --- REPORTS GRID --- */}
        {/* CSS Grid es obligatorio aquí. Flexbox causará desastres en móvil. */}
        {reports && reports.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reports.map((report, index) => (
              <div
                key={index}
                className="border border-gray-200 bg-white shadow-sm rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <h3 className="text-sm font-medium text-gray-500 truncate">
                  {report.title}
                </h3>
                <div className="mt-2 flex flex-col items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {report.quantity}
                  </span>
                  {report.detail && (
                    <span className="text-xs text-gray-500 font-medium">
                      {report.detail}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* --- CONTENT --- */}
        <section className="w-full">
            {children}
        </section>
      </div>
    </main>
  );
};

export default PageComponent;