import React, { useEffect, useState } from 'react';
import Inicio from './components/Inicio';
import AcercaDe from './components/AcercaDe';
import Contactanos from './components/Contactanos';
import Registro from './components/Registro';
import Login from './components/Login';
import Publicaciones from './components/Publicaciones';
import Perfil from './components/Perfil';
import Politicas from './components/Politicas';
import Terminos from './components/Terminos';
import Menu from './components/Menu';
import Footer from './components/Footer';
import Splash from './Splash';
/* import { useAuth } from './AuthContext'; */

const App = () => {
  /* const { setUsuarioAutenticado } = useAuth(); */
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [paginaactual, setPaginaactual] = useState('inicio');

  const handleSplashComplete = () => {
    setMostrarSplash(false);
  };

  /* useEffect(() => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('publicaciones');
    localStorage.removeItem('mispublicaciones');
    setUsuarioAutenticado(null);
  }, []); */

  return (
    <div>
      {mostrarSplash ? (
        <Splash onSplashComplete={handleSplashComplete} />
      ) : (
        <>
      <Menu setPaginaactual={setPaginaactual} />

      {paginaactual === 'inicio' && <Inicio />}
      {paginaactual === 'acerca' && <AcercaDe />}
      {paginaactual === 'contacto' && <Contactanos />}
      {paginaactual === 'login' && <Login setPaginaactual={setPaginaactual}/>}
      {paginaactual === 'registro' && <Registro setPaginaactual={setPaginaactual}/>}
      {paginaactual === 'publicaciones' && <Publicaciones />}
      {paginaactual === 'perfil' && <Perfil />}
      {paginaactual === 'politicas' && <Politicas />}
      {paginaactual === 'terminos' && <Terminos />}

      <Footer setPaginaactual={setPaginaactual}/>
      </>
      )}
    </div>
  );
};

export default App;