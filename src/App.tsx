import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ClientPage from "./pages/Client/ClientPage";
import ServicePage from "./pages/Service/ServicePage";
import { Toaster } from "react-hot-toast";
import AppointmentPage from "./pages/Appointment/AppointmentPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import PaymentPage from "./pages/Payment/PaymentPage";
import ReportPage from "./pages/Report/ReportPage";
import PersonalPage from "./pages/Personal/PersonalPage";

function App() {

  const { pathname } = useLocation();
  const token = localStorage.getItem("token");

  return (
    <div className="flex">
      {pathname !== "/login" && <Sidebar />}

        <Routes>
          <Route path="/login" element={<Login />}/>

              <Route path="/clientes" element={
                
                  <ClientPage />

                }/>

            <Route path="/servicios" element={

                <ServicePage />              }/>

          <Route path="/citas" element={
 
              <AppointmentPage />

            }/>
          <Route path="/inventario" element={

              <InventoryPage />

            }/> 
          <Route path="/pagos" element={

              <PaymentPage />

            }/> 
              <Route path="/reportes" element={

                  <ReportPage />

                }/> 
              <Route path="/personal" element={

                  <PersonalPage />

                }/> 
        </Routes>
      <Toaster position="top-right"/>
    </div>
  )
}

export default App
