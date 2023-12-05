import React from 'react';
import { useAuth } from "../AuthContext";
import Global from "../Global";

const Menu = ({ setPaginaactual }) => {
  const { usuarioAutenticado, cerrarSesion } = useAuth();

  const cerrarSesionYRedirigir = () => {
    cerrarSesion();
    setPaginaactual('login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#FF90BB', padding: '5px' }}>
      <img
        src="images/logo_pasteleria.png"
        alt="Logo de Pastelería Mayra"
        onClick={() => setPaginaactual('inicio')}
        style={{ cursor: 'pointer', width: '100px' }}
      />
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={() => setPaginaactual('inicio')}
              style={{ cursor: 'pointer', color: '#333' }}
            >
              <i className="fa fa-home"></i> Inicio
            </span>
          </li>
          {usuarioAutenticado &&
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={() => setPaginaactual('publicaciones')}
              style={{ cursor: 'pointer', color: '#333' }}
            >
              <i className="fa fa-birthday-cake"></i> Publicaciones
            </span>
          </li>
          }
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="publicacionesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fa fa-info-circle"></i> Información
            </a>
            <div className="dropdown-menu" aria-labelledby="publicacionesDropdown">
              <button className="dropdown-item" onClick={() => setPaginaactual('acerca')}>
                <i className="fa fa-info"></i> Acerca de
              </button>
              <button className="dropdown-item" onClick={() => setPaginaactual('politicas')}>
                <i className="fa fa-shield"></i> Política de privacidad
              </button>
              <button className="dropdown-item" onClick={() => setPaginaactual('terminos')}>
                <i className="fa fa-file"></i> Términos y Condiciones
              </button>
              <button className="dropdown-item" onClick={() => setPaginaactual('contacto')}>
                <i className="fa fa-envelope"></i> Contáctanos
              </button>
            </div>
          </li>
          {usuarioAutenticado ? (
            <div className="d-flex align-items-center">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="usuarioDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {usuarioAutenticado.nombre_completo.split(' ')[0]}
                  {usuarioAutenticado.imagen_perfil != null ? (
                    <img src={Global.IMAGES + 'usuarios/' + usuarioAutenticado.imagen_perfil} alt="Foto de Usuario" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} />
                  ) : (
                    <img src="images/cocinero.png" alt="Foto de Usuario" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} />
                  )}
                </a>
                <div className="dropdown-menu" aria-labelledby="usuarioDropdown">
                  <button className="dropdown-item" onClick={() => setPaginaactual('perfil')}>
                  {usuarioAutenticado.imagen_perfil != null ? (
                    <img src={Global.IMAGES + 'usuarios/' + usuarioAutenticado.imagen_perfil} alt="Foto de Usuario" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} />
                  ) : (
                    <img src="images/cocinero.png" alt="Foto de Usuario" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} />
                  )} Mi Perfil
                  </button>
                  <button className="dropdown-item" onClick={cerrarSesionYRedirigir}>
                    <i className="fa fa-sign-out"></i> Cerrar Sesión
                  </button>
                </div>
              </li>
            </div>
          ) : (
            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => setPaginaactual('login')}
                style={{ cursor: 'pointer', color: '#333' }}
              >
                <i className="fa fa-sign-in"></i> Iniciar Sesión
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Menu;
