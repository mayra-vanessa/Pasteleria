// sw.js
const CACHE_STATIC_NAME = 'pasteleria-static-v1';
const CACHE_DYNAMIC_NAME = 'pasteleria-dynamic-v1';
const CACHE_INMUTABLE_NAME = 'pasteleria-inmutable-v1';

const urlsToCacheStatic = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo_pasteleria.png',
  '/images/candado.png', 
  '/images/cocinero.png',
  '/images/pastel1.jpg',
  '/images/pastel2.jpg',
  '/images/pastel3.jpg',
  '/images/pastel4.jpg',
  '/images/pastel5.jpg',
  '/images/pastel6.jpg',
];

const urlsToCacheInmutable = [
  'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://code.jquery.com/jquery-3.5.1.min.js',
  'https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.3/dist/umd/popper.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
];

const offlinePageHtml = `
  <div style="max-width: 1200px; margin: auto;">
    <header style="background-color: #FF90BB; padding: 10px;">
      <!-- Puedes colocar aquí el logo o cualquier otro contenido del encabezado -->
    </header>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="images/pastel4.jpg" class="d-block w-100" alt="Deliciosos pasteles" />
          <div class="carousel-caption">
            <h3 class="carousel-title">Deliciosos pasteles</h3>
            <p class="carousel-description">Explora nuestra variedad de pasteles y encuentra tu favorito. Desde los clásicos hasta las creaciones más innovadoras.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="images/pastel5.jpg" class="d-block w-100" alt="Variedad de sabores" />
          <div class="carousel-caption">
            <h3 class="carousel-title">Variedad de sabores</h3>
            <p class="carousel-description">Sumérgete en una experiencia de sabores únicos. Desde lo tradicional hasta lo sorprendentemente delicioso.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="images/pastel6.jpg" class="d-block w-100" alt="Postres exquisitos" />
          <div class="carousel-caption">
            <h3 class="carousel-title">Postres exquisitos</h3>
            <p class="carousel-description">Cada bocado es una obra maestra. Descubre la excelencia en cada postre que creamos con amor y pasión.</p>
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Anterior</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Siguiente</span>
      </a>
    </div>
    <h1 style="font-size: 2em; margin-top: 50px; text-align: center; color: #FF90BB;">¡Bienvenido a la Pastelería!</h1>
    <p style="font-size: 1.2em; margin-bottom: 20px; text-align: center;">
      En Pastelería Mayra, no solo creamos pasteles; construimos experiencias dulces que se quedan contigo mucho después de que el último bocado desaparece. Desde los clásicos hasta creaciones innovadoras, cada pastel cuenta una historia de sabor y dedicación.
    </p>
    <div class="d-md-flex justify-content-around mb-4">
      <div class="text-center mb-4 mb-md-0">
        <i class="fa fa-thumbs-up" style="font-size: 2em; color: #3b5998;"></i>
        <p class="mt-2">¡Dale me gusta a tus pasteles favoritos!</p>
      </div>
      <div class="text-center mb-4 mb-md-0">
        <i class="fa fa-comment" style="font-size: 2em; color: #00aced;"></i>
        <p class="mt-2">Comenta y comparte tus opiniones.</p>
      </div>
      <div class="text-center">
        <i class="fa fa-eye" style="font-size: 2em; color: #dd4b39;"></i>
        <p class="mt-2">Explora las últimas publicaciones.</p>
      </div>
    </div>
    <footer style="background-color: #FF90BB; padding: 10px;">
      <div class="text-center">
        <span class="text-muted">© 2023 Pastelería Mayra</span>
      </div>
    </footer>
  </div>
`;


self.addEventListener('install', e => {
  console.log('Instalando SW!!');

  e.waitUntil(
    Promise.all([
      caches.open(CACHE_STATIC_NAME).then(cache => cache.addAll(urlsToCacheStatic)),
      caches.open(CACHE_INMUTABLE_NAME).then(cache => cache.addAll(urlsToCacheInmutable)),
    ])
  );
});

self.addEventListener('activate', e => {
  console.log('SW: Activo y Controlará toda la aplicación');
});

self.addEventListener('fetch', e => {
  const { request } = e;

  e.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response;
      }

      return fetch(request).then(res => {
        // Clonar la respuesta antes de consumir el cuerpo
        const clonedResponse = res.clone();

        if (request.method === 'GET' && request.url.indexOf('http') === 0) {
          caches.open(CACHE_DYNAMIC_NAME).then(cache => {
            cache.put(request, clonedResponse); // Usar el clon en lugar de la respuesta original
          });
        }

        return res;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return new Response(offlinePageHtml, { headers: { 'Content-Type': 'text/html' } });
        }
      });
    })
  );
});


self.addEventListener('sync', e => {
  console.log('Tenemos conexión');
  console.log(e);
  console.log(e.tag);
});

/* self.addEventListener('push', e => {
  const options = {
    body: e.data.text(), // El cuerpo de la notificación
  };

  e.waitUntil(
    self.registration.showNotification('¡Nueva notificación!', options)
  );
}); */