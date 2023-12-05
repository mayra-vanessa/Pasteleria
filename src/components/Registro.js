// Registro.js
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import Global from "../Global";

const Registro = ({ setPaginaactual }) => {
  const { setUsuarioAutenticado } = useAuth();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const registro = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nombre || !email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Hacer la solicitud a la API
    try {
      fetch(Global.API, {          
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 1,
          correo:email,
          contra: password, 
          x1: nombre, 
        })
        //se recoje una respuesta en formato json
        }).then((response) => response.json())
        .then((responseJson) => {

          if (responseJson !== null && responseJson.respuesta === "ok") {
           /*  let idusario = responseJson.usuario.idusuario; */
            // Guardar el usuario en el contexto de autenticación
            setUsuarioAutenticado(responseJson.usuario);
            // Guardar el usuario en el localStorage
            localStorage.setItem('usuario', JSON.stringify(responseJson.usuario));
            console.log("Usuario guardado en el localStorage:", responseJson.usuario);

            setPaginaactual('publicaciones');
          }		
        }).catch((error) => {
          console.log(error);
        });        
      
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setError('Error al realizar la solicitud al servidor.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto" style={{ maxWidth: '500px', marginBottom: '50px' }}>
        <div className="card-body">
          <div style={{ maxWidth: '100%', backgroundColor: '#FF90BB' }}>
            <img src="images/logo_pasteleria.png" alt="Logo" className="mx-auto d-block mb-4" style={{ maxWidth: '150px' }} />
          </div>
          <h1 className="mb-4 text-center">Registro</h1>
          <form onSubmit={registro}>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                placeholder="Tu Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Tu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Tu Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            <button type="submit" className="btn btn-primary btn-block">Registrarse</button>
          </form>
          <p className="mt-3 text-center">
            ¿Ya tienes una cuenta?{' '}
            <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => setPaginaactual('login')}>Inicia sesión aquí</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
