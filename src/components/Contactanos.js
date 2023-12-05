import React from 'react';

const Contactanos = () => {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', textAlign: 'justify', padding: '20px' }}>
      <h1 style={{ fontSize: '2em', marginTop: '50px', color: '#FF90BB' }}>Contacta con Nosotros</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
        Estamos encantados de saber de ti. Si tienes alguna pregunta, comentario o simplemente quieres compartir tus experiencias con nosotros, no dudes en ponerte en contacto. Hay varias formas de hacerlo.
      </p>

      <h2 style={{ fontSize: '1.5em', marginTop: '30px', color: '#FF90BB' }}>Información de Contacto</h2>
      <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
        <strong>Dirección:</strong> Hujeutla de Reyes, Hgo, Mexico 43000<br />
        <strong>Email:</strong> info@pasteleriamayra.com<br />
        <strong>Teléfono:</strong> +123 456 789
      </p>

      <h2 style={{ fontSize: '1.5em', marginTop: '30px', color: '#FF90BB' }}>Formulario de Contacto</h2>
      <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
        Si prefieres, también puedes llenar nuestro formulario de contacto a continuación y nos pondremos en contacto contigo lo antes posible.
      </p>

      <form>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input type="text" className="form-control" id="nombre" placeholder="Tu Nombre" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" className="form-control" id="email" placeholder="tucorreo@ejemplo.com" />
        </div>
        <div className="form-group">
          <label htmlFor="mensaje">Mensaje:</label>
          <textarea className="form-control" id="mensaje" rows="4" placeholder="Escribe tu mensaje aquí"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Enviar Mensaje</button>
      </form>
    </div>
  );
};

export default Contactanos;
