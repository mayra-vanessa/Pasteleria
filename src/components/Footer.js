import React from 'react';

const Footer = ({ setPaginaactual }) => {
  return (
    <footer className="footer mt-auto py-3" style={{ backgroundColor: '#FF90BB' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h4>Menú</h4>
            <ul>
              <li><a href="#" onClick={() => setPaginaactual('inicio')}>Inicio</a></li>
              <li><a href="#" onClick={() => setPaginaactual('acerca')}>Acercad de</a></li>
              <li><a href="#" onClick={() => setPaginaactual('politicas')}>Politica de Privacidad</a></li>
              <li><a href="#" onClick={() => setPaginaactual('terminos')}>Terminos y Condiciones</a></li>
              <li><a href="#" onClick={() => setPaginaactual('contacto')}>Contacto</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Redes Sociales</h4>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Instagram</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h4>Contacto</h4>
            <p>Dirección: Hujeutla de Reyes, Hgo, Mexico 43000</p>
            <p>Email: info@pasteleriamayra.com</p>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <span className="text-muted">© 2023 Pastelería Mayra</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
