importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');


const firebaseConfig = {
    apiKey: "AIzaSyCBx-mjBIk9TK2EAqoHsVNT-YE5zN56Qtk",
    authDomain: "pasteleria-a7b68.firebaseapp.com",
    projectId: "pasteleria-a7b68",
    storageBucket: "pasteleria-a7b68.appspot.com",
    messagingSenderId: "165904097594",
    appId: "1:165904097594:web:47636e887caeea12d63003",
    measurementId: "G-SFL0FSPGL9"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);



self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    // Puedes agregar tu lógica aquí, por ejemplo, abrir una URL
    const urlToOpen = new URL('https://pasteleria.proyectowebuni.com/');
    const promiseChain = clients.openWindow(urlToOpen);
  
    event.waitUntil(promiseChain);
  });
  


  self.addEventListener('push', (event) => {
    const payload = event.data.json(); // Parsea el contenido del mensaje como JSON
    const options = {
        body: payload.notification.body,
        icon: 'images/logo_pasteleria.png', // Puedes personalizar el icono
    };

    console.log(payload.notification.title, payload.notification.body);

    event.waitUntil(
        self.registration.showNotification(payload.notification.title, options)
    );
});

  
  messaging.onBackgroundMessage(payload => {
    console.log("Recibiste mensaje mientras estabas ausente");
    // previo a mostrar notificación
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "images/logo_pasteleria.png"
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});