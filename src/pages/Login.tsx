import React from 'react'

const Login = () => {
    return (
        <div>
            <form action="">
                <div>
                    <label htmlFor="email">Correo electrónico</label>
                    <input type="email" id="email"/>
                </div>
                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input type="password" id="password"/>
                </div>
            </form>
        </div>
    )
}

export default Login