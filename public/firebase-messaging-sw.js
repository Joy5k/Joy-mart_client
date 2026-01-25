importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDstooiACHbHK9CWFz5aomTKdni0VGanOM",
  authDomain: "joy-mart-client.firebaseapp.com",
  projectId: "joy-mart-client",
  storageBucket: "joy-mart-client.appspot.com",
  messagingSenderId: "463004595788",
  appId: "1:463004595788:web:623705dacf0d482c2e66e9",
};

firebase.initializeApp(firebaseConfig);
 const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  
  const notificationTitle = payload.notification?.title || 'New Message From Joy-Mart';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/favico.png',
    badge: '/favico.png'
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length) {
        clients[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});
