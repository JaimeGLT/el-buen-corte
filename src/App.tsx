import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ClientPage from "./pages/Client/ClientPage";
import ServicePage from "./pages/Service/ServicePage";

function App() {

  const { pathname } = useLocation();

  return (
    <div className="flex">
      {pathname !== "/login" && <Sidebar />}
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/clientes" element={<ClientPage />}/>
        <Route path="/servicios" element={<ServicePage />}/>
      </Routes>
    </div>
  )
}

export default App
