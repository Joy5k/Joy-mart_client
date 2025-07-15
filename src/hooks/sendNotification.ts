import { useEffect } from 'react';
import { useSendNotificationMutation } from "../redux/features/pushNotifications/pushNotificationApi";
import { toast } from "react-toastify";
import { onMessageListener, requestForToken } from '../app/firebase/firebaseInit';

export const usePushNotification = () => {
  const [sendNotification] = useSendNotificationMutation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializePush = async () => {
      try {
        // Request token and setup listener
        await requestForToken();
        
        onMessageListener().then((payload: any) => {
          if (!payload?.notification) return;
          
          // Show notification based on visibility
          if (document.visibilityState === 'visible') {
            toast.info(payload.notification.body, {
              position: "top-right",
              autoClose: 5000,
            });
          } else {
            new Notification(payload.notification.title, {
              body: payload.notification.body,
              icon: '/logo.png'
            });
          }
        });
      } catch (error) {
        console.error('Push notification error:', error);
      }
    };

    initializePush();
  }, []);

  const sendPush = async (message: { title: string; body: string }) => {
    try {
      const res = await sendNotification({ message }).unwrap();
      return res.success;
    } catch (error) {
      console.error("Failed to send notification:", error);
      return false;
    }
  };

  return { sendPush };
};