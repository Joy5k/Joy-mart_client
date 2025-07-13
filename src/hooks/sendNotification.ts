import { useCallback, useEffect } from 'react';
import { useSendNotificationMutation } from "../redux/features/pushNotifications/pushNotificationApi";
import { toast } from "react-toastify";
import { onMessageListener, requestForToken } from '../app/firebase/firebaseInit';

export const usePushNotification = () => {
  const [sendNotification] = useSendNotificationMutation();

  useEffect(() => {
    // Initialize push notifications when component mounts
    const initializePush = async () => {
      try {
        // Request notification permission and get token
        await requestForToken();
        
        // Set up message listener
        onMessageListener().then((payload: any) => {
          if (!payload?.notification) return;
          
          // Check if window is in foreground or background
          const isForeground = document.visibilityState === 'visible';
          
          if (isForeground) {
            // Show toast notification when app is in foreground
            toast.info(payload.notification.body, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            // Show native browser notification when app is in background
            if (Notification.permission === 'granted') {
              new Notification(payload.notification.title || 'New Notification', {
                body: payload.notification.body,
                icon: '/logo.png', // Path to your notification icon
                badge: '/badge.png', // Small icon for mobile devices
                data: {
                  url: window.location.href // For handling clicks
                }
              });
            }
          }
        });
      } catch (error) {
        console.error('Push notification initialization error:', error);
      }
    };

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initializePush();
    }
  }, []);

  // Memoized function to send push notifications
  const sendPush = useCallback(async (message: { title: string; body: string }) => {
    try {
      const res = await sendNotification({ message }).unwrap();
      return res.success;
    } catch (error) {
      console.error("Failed to send push notification:", error);
      return false;
    }
  }, [sendNotification]);

  return { sendPush };
};