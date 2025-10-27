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
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { getDecodedToken } from "./utlis/auth";

function App() {

  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const decoded = getDecodedToken(token);

  return (
    <div className="flex">
      {pathname !== "/login" && <Sidebar />}
      <AuthProvider>

        <Routes>
          <Route path="/login" element={<Login />}/>

              <Route path="/clientes" element={
                <ProtectedRoute>
                  <ClientPage />
                </ProtectedRoute>
                }/>

            <Route path="/servicios" element={
              <ProtectedRoute>
                <ServicePage />
              </ProtectedRoute>
              }/>

          <Route path="/citas" element={
            <ProtectedRoute>
              <AppointmentPage />
            </ProtectedRoute>
            }/>
          <Route path="/inventario" element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
            }/> 
          <Route path="/pagos" element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
            }/> 
              <Route path="/reportes" element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
                }/> 
        </Routes>

      </AuthProvider>

      <Toaster position="top-right"/>
    </div>
  )
}

export default App
