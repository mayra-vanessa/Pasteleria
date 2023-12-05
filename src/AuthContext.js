import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(JSON.parse(localStorage.getItem('usuario')));

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('publicaciones');
    localStorage.removeItem('mispublicaciones');
    setUsuarioAutenticado(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioAutenticado, setUsuarioAutenticado, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
