import {
  Calendar,
  Users,
  Scissors,
  Package,
  CreditCard,
  UserCog,
  BarChart3,
  DollarSign,
  Menu, // Nuevo icono para abrir
  X,    // Nuevo icono para cerrar
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { UserType } from "../types/User";
import { ScissorsLoader } from "./ScissorsLoader";

interface SidebarProps {
  user: UserType | null;
  loading: boolean;
}

const Sidebar = ({ user, loading }: SidebarProps) => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Hook implacable: Si cambias de ruta en móvil, cierra el menú. 
  // Si no haces esto, el usuario se frustra.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navigation = [
    { name: "Citas", href: "/citas", icon: Calendar, permited: ["ESTILISTA", "ADMINISTRADOR", "RECEPCIONISTA"] },
    { name: "Clientes", href: "/clientes", icon: Users, permited: ["ESTILISTA", "ADMINISTRADOR", "RECEPCIONISTA"] },
    { name: "Servicios", href: "/servicios", icon: Scissors, permited: ["ESTILISTA", "ADMINISTRADOR", "RECEPCIONISTA"] },
    { name: "Inventario", href: "/inventario", icon: Package, permited: ["ESTILISTA", "ADMINISTRADOR"] },
    { name: "Pagos", href: "/pagos", icon: CreditCard, permited: ["ADMINISTRADOR"] },
    { name: "Gastos", href: "/gastos", icon: DollarSign, permited: ["ADMINISTRADOR"] },
    { name: "Personal", href: "/personal", icon: UserCog, permited: ["ESTILISTA", "ADMINISTRADOR", "RECEPCIONISTA"] },
    { name: "Reportes", href: "/reportes", icon: BarChart3, permited: ["ADMINISTRADOR"] },
  ];

  const navigationFiltered = navigation.filter(item => item.permited.includes(user?.role || ""));

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="sticky top-4 left-0 h-fit z-40 p-2 rounded-md shadow-md lg:hidden text-gray-700"
        aria-label="Abrir menú"
      >
        <Menu className="size-5 sm:size-6" />
      </button>

      {/* --- OVERLAY (Fondo oscuro) --- */}
      {/* Solo visible en móvil cuando el menú está abierto */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)} 
        aria-hidden="true"
      />

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[280px] bg-white border-r border-r-gray-300 flex flex-col justify-between py-5 transition-transform duration-300 ease-in-out
          lg:sticky lg:translate-x-0 lg:shadow-none
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <nav className="text-sm px-4">

          <div className="flex items-center justify-between pb-5 border-b border-b-gray-300 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#ef4b67] p-2 rounded-xl shrink-0">
                <Scissors className="size-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">El Buen Corte</h1>
                <p className="text-xs text-gray-500">Sistema ERP</p>
              </div>
            </div>

            <button 
                onClick={() => setIsOpen(false)} 
                className="lg:hidden p-1 text-gray-500 hover:text-[#ef4b67]"
            >
                <X className="size-6" />
            </button>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {loading ? <div><ScissorsLoader /></div> : navigationFiltered.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  to={item.href}
                  key={item.name}
                  className={`
                    flex items-center gap-4 p-3 rounded-xl transition-colors font-medium
                    ${
                      isActive
                        ? "bg-[#ef4b67] text-white shadow-md shadow-red-200"
                        : "text-gray-600 hover:bg-[#d6ceff] hover:text-[#ef4b67]"
                    }
                  `}
                >
                  <item.icon className={`size-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer de Usuario */}
        <div className="border-t border-t-gray-300 pt-5 mx-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
                <p className="text-sm font-semibold truncate text-gray-800">
                    {user?.firstName || "Invitado"} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate" title={user?.email}>
                    {user?.email || "Sin email"}
                </p>
            </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;