import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Package,
  CreditCard,
  UserCog,
  BarChart3,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const Sidebar = () => {

    const {pathname} = useLocation();

    const navigation = [
        // { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Citas", href: "/citas", icon: Calendar },
        { name: "Clientes", href: "/clientes", icon: Users },
        { name: "Servicios", href: "/servicios", icon: Scissors },
        { name: "Inventario", href: "/inventario", icon: Package },
        { name: "Pagos", href: "/pagos", icon: CreditCard },
        { name: "Personal", href: "/personal", icon: UserCog },
        { name: "Reportes", href: "/reportes", icon: BarChart3 },
    ]

  return (
    <section className="w-[18%] min-w-[280px] sticky flex flex-col justify-between h-screen py-5 border-r-gray-300 border-r">
        <nav className="text-sm">
            <div className="flex items-center justify-center pb-5 border-b-gray-300 border-b gap-4">
                <div className="bg-[#ef4b67] p-2 rounded-xl">
                    <Scissors className="size-auto text-white"/>
                </div>
                <div>
                    <h1 className="font-bold text-lg">El Buen Corte</h1>
                    <p>Sistema ERP</p>
                </div>
            </div>
            <div className="py-5 flex flex-col justify-center px-4">
                {
                    navigation.map(item => 
                        {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    to={item.href}
                                    key={item.name}
                                    className={`hover:bg-[#d6ceff] flex gap-4 my-1 p-2 rounded-xl   ${isActive ? "bg-[#ef4b67] text-white hover:bg-[#ef4b67]" : "bg-white"}`}

                                >
                                    {<item.icon className="text-red size-5"/>}
                                    {item.name}
                                </Link>
                            )}
                    )
                }

            </div>
        </nav>
        <div className="border-t-gray-300 border-t pt-5 text-xs flex items-center flex-col">
            <p>Admin</p>
            <p>admin@elbuencorte.com</p>
        </div>
    </section>
  )
}

export default Sidebar