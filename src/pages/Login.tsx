import { useState } from "react";
import { Mail, Lock, Scissors, AlertCircle } from "lucide-react"; // íconos
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(""); // nuevo estado
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Validar email
    if (!dataForm.email) {
      newErrors.email = "El correo electrónico es obligatorio.";
      valid = false;
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(dataForm.email)
    ) {
      newErrors.email = "El correo electrónico no es válido.";
      valid = false;
    }

    // Validar password
    if (!dataForm.password) {
      newErrors.password = "La contraseña es obligatoria.";
      valid = false;
    } else if (dataForm.password.length < 6) {
      newErrors.password = "Debe tener al menos 6 caracteres.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDataForm((prev) => ({
        ...prev,
        [name]: value,
        }));
        // Limpiar errores al escribir
        setErrors((prev) => ({
        ...prev,
        [name]: "",
        }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log("Datos enviados ✅:", dataForm);
      try {
        const response = await axios.post("http://localhost:8080/api/v1/auth/authenticate", dataForm);
        setLoginError("");
        localStorage.setItem("token", response?.data?.token);
        navigate("/")
      } catch (error: any) {
          if (error.response && error.response.status === 403) {
            setLoginError("Credenciales incorrectas");
        } else {
            setLoginError("Ocurrió un error. Intenta nuevamente");
        }
      }
    } else {
      console.warn("Formulario con errores ❌");
    }
  };

  return (
    <div className="flex items-center justify-center bg-linear-to-r from-[#f7e5e8] via-[#faeaed] to-[#fcfcfc] w-screen h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-140"
      >
        <div className="flex flex-col gap-3 mb-8 items-center justify-center">
          <div className="bg-[#ef4b67] rounded-xl p-3">
            <Scissors className="text-white" />
          </div>
          <h3 className="text-center font-bold text-4xl text-gray-800">
            Iniciar Sesión
          </h3>
          <p className="text-center text-base text-gray-600">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1 mb-5">
          <label
            htmlFor="email"
            className="text-base font-semibold text-gray-700"
          >
            Correo electrónico
          </label>
          <div
            className={`flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors duration-200 focus-within:border-pink-400 focus-within:bg-[#fc9faf]/10 ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          >
            <Mail
              className={`${
                errors.email ? "text-red-500" : "text-gray-500"
              } transition-colors duration-200`}
              size={20}
            />
            <input
              type="email"
              id="email"
              name="email"
              value={dataForm.email}
              onChange={onChange}
              placeholder="ejemplo@correo.com"
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1 mb-8">
          <label
            htmlFor="password"
            className="text-base font-semibold text-gray-700"
          >
            Contraseña
          </label>
          <div
            className={`flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors duration-200 focus-within:border-pink-400 focus-within:bg-[#fc9faf]/10 ${
              errors.password ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          >
            <Lock
              className={`${
                errors.password ? "text-red-500" : "text-gray-500"
              } transition-colors duration-200`}
              size={20}
            />
            <input
              type="password"
              id="password"
              name="password"
              value={dataForm.password}
              onChange={onChange}
              placeholder="••••••••"
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.password}
            </p>
          )}
        </div>
        {loginError && (
            <p className="text-red-500 text-center mt-3 flex items-center justify-center gap-1 mb-5">
                <AlertCircle size={16} /> {loginError}
            </p>
            )}

        <button
          type="submit"
          className="bg-[#ef4b67] w-full text-white text-lg font-semibold py-2 rounded-xl hover:bg-[#fc9faf] transition-all duration-200"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
