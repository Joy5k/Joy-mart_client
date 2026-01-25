import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDstooiACHbHK9CWFz5aomTKdni0VGanOM",
  authDomain: "joy-mart-client.firebaseapp.com",
  projectId: "joy-mart-client",
  storageBucket: "joy-mart-client.appspot.com",
  messagingSenderId: "463004595788",
  appId: "1:463004595788:web:623705dacf0d482c2e66e9",
};

let app:any;
let messaging:any;

if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  isSupported().then((supported) => {
    if (supported) messaging = getMessaging(app);
  });
}

export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Browser not supported for FCM');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(messaging, {
      vapidKey: "BEx6toXqEuPffFvZcc5kXmuTNXaiurwyp7QkHnlHeVZP4PB6ifYxsEpqHznRPc6F12kfcgK1-VIjuo2FyYUAIko",
      serviceWorkerRegistration: registration
    });
    if (token) {
      localStorage.setItem('fcmToken', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve,reject) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }else {
      reject(new Error('Messaging is not supported or not initialized'));
    }
    
  });