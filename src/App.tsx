import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import PrivateLayout from "./layouts/PrivateLayout";
import ClientPage from "./pages/Client/ClientPage";
import ServicePage from "./pages/Service/ServicePage";
import AppointmentPage from "./pages/Appointment/AppointmentPage";
import ReportPage from "./pages/Report/ReportPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import PersonalPage from "./pages/Personal/PersonalPage";
import GastosOperativos from "./pages/GastosOperativos/GastosOperativos";
import { getHook } from "./hooks/getHook";
import type { UserType } from "./types/User";
import { useEffect } from "react";

function App() {
  const location = useLocation();
    const { data: user, loading, error, refetch } = getHook<UserType>("/me");   

    useEffect(() => {
      refetch();
    }, [location.pathname])

  return (
    <Routes>
      <Route path="/login" element={<Login onLoginSuccess={refetch}/>} />

      {/* Rutas privadas bajo el layout */}
      {/* <Route element={<ProtectedRoute />}> */}
        <Route element={<PrivateLayout user={user} loading={loading} error={error}/>}>
        {

          user?.role === "ESTILISTA" ? (
            <>
              <Route path="/" element={<ClientPage />} />
              <Route path="/clientes" element={<ClientPage />} />
              <Route path="/servicios" element={<ServicePage />} />
              <Route path="/citas" element={<AppointmentPage />} />
              <Route path="/inventario" element={<InventoryPage />} />
              <Route path="/pagos" element={<PaymentPage />} />
              <Route path="/personal" element={<PersonalPage />} />
            </>
          ):
          user?.role === "ADMINISTRADOR" ? (
            <>
              <Route path="/" element={<ClientPage />} />
              <Route path="/clientes" element={<ClientPage />} />
              <Route path="/servicios" element={<ServicePage />} />
              <Route path="/citas" element={<AppointmentPage />} />
              <Route path="/reportes" element={<ReportPage />} />
              <Route path="/inventario" element={<InventoryPage />} />
              <Route path="/pagos" element={<PaymentPage />} />
              <Route path="/personal" element={<PersonalPage />} />
              <Route path="/gastos" element={<GastosOperativos />} />
            </>
          ) : <>
              <Route path="/" element={<ClientPage />} />
              <Route path="/clientes" element={<ClientPage />} />
              <Route path="/servicios" element={<ServicePage />} />
              <Route path="/citas" element={<AppointmentPage />} />
              <Route path="/personal" element={<PersonalPage />} />
          </>
        }
        </Route>
      {/* </Route> */}
    </Routes>
  );
}

export default App;
