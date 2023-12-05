if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')  // Mantén esta línea para tu Service Worker existente
    .then(reg => {
      console.log('Service Worker registrado con éxito:', reg);
      // Puedes seguir con las demás lógicas aquí si es necesario
    })
    .catch(error => {
      console.log('Error al registrar el Service Worker:', error);
    });

  navigator.serviceWorker.register('firebase-messaging-sw.js') // Nueva línea para el Service Worker de Firebase
    .then(reg => {
      console.log('Service Worker de Firebase registrado con éxito:', reg);
    })
    .catch(error => {
      console.log('Error al registrar el Service Worker de Firebase:', error);
    });
}
