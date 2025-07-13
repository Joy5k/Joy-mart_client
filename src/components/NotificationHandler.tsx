// components/NotificationComponent.tsx
'use client';
import { useFCMToken } from "../useFCMToken";

 // Add this directive at the top


export default function NotificationComponent() {
  const { token, isLoading } = useFCMToken();

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div>
      {token ? (
        <p>Notifications ready! Token: {token.substring(0, 10)}...</p>
      ) : (
        <p>Notifications not available</p>
      )}
    </div>
  );
}