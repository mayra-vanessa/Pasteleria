import React from 'react';

const Inicio = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
          <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
        </ol>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="images/pastel4.jpg" className="d-block w-100" alt="Deliciosos pasteles" />
            <div className="carousel-caption">
              <h3 className="carousel-title">Deliciosos pasteles</h3>
              <p className="carousel-description">Explora nuestra variedad de pasteles y encuentra tu favorito. Desde los clásicos hasta las creaciones más innovadoras.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="images/pastel5.jpg" className="d-block w-100" alt="Variedad de sabores" />
            <div className="carousel-caption">
              <h3 className="carousel-title">Variedad de sabores</h3>
              <p className="carousel-description">Sumérgete en una experiencia de sabores únicos. Desde lo tradicional hasta lo sorprendentemente delicioso.</p>
              </div>
          </div>
          <div className="carousel-item">
            <img src="images/pastel6.jpg" className="d-block w-100" alt="Postres exquisitos" />
            <div className="carousel-caption">
              <h3 className="carousel-title">Postres exquisitos</h3>
              <p className="carousel-description">Cada bocado es una obra maestra. Descubre la excelencia en cada postre que creamos con amor y pasión.</p>
            </div>
          </div>
        </div>
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Anterior</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Siguiente</span>
        </a>
      </div>
      <h1 style={{ fontSize: '2em', marginTop: '50px', textAlign: 'center', color: '#FF90BB' }}>¡Bienvenido a la Pastelería!</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '20px', textAlign: 'center' }}>
        En Pastelería Mayra, no solo creamos pasteles; construimos experiencias dulces que se quedan contigo mucho después de que el último bocado desaparece. Desde los clásicos hasta creaciones innovadoras, cada pastel cuenta una historia de sabor y dedicación.
      </p>

      <div className="d-md-flex justify-content-around mb-4">
        <div className="text-center mb-4 mb-md-0">
          <i className="fa fa-thumbs-up" style={{ fontSize: '2em', color: '#3b5998' }}></i>
          <p className="mt-2">¡Dale me gusta a tus pasteles favoritos!</p>
        </div>
        <div className="text-center mb-4 mb-md-0">
          <i className="fa fa-comment" style={{ fontSize: '2em', color: '#00aced' }}></i>
          <p className="mt-2">Comenta y comparte tus opiniones.</p>
        </div>
        <div className="text-center">
          <i className="fa fa-eye" style={{ fontSize: '2em', color: '#dd4b39' }}></i>
          <p className="mt-2">Explora las últimas publicaciones.</p>
        </div>
      </div>
     
    </div>
  );
};

export default Inicio;
