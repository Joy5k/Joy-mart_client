'use client'


import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};



const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register SW
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    return await navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }
  return null;
};

// Request Token
export const requestForToken = async () => {
  try {
    const registration = await registerServiceWorker();
    if (!registration) return;

    const currentToken = await getToken(messaging, {
      vapidKey:process.env.VITE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (currentToken) {
        localStorage.setItem('fcmToken',currentToken)
      await fetch('http://localhost:5000/api/v1/push-notifications/submit-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: currentToken }),
        credentials: 'include'
      });
    } else {
      console.warn('⚠️ No token found');
    }
  } catch (err) {
    console.error('Token Error:', err);
  }
};

// Listen for notifications while site is open
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
