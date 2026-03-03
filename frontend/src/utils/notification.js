// utils/notifications.js
export function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((result) => {
      console.log('Notification permission:', result);
    });
  }
}
