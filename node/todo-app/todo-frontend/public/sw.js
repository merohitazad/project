// public/sw.js

// 1. Listen for the push event fired from your Render backend
self.addEventListener("push", (event) => {
  let data = { title: "Task Reminder", body: "You have a deadline coming up!" };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/logo192.png", // Replace with a valid path to your app icon
    badge: "/badge.png", // Replace with a monochrome icon for mobile status bars (optional)
    vibrate: [200, 100, 200],
    data: {
      openUrl: "/", // Where to redirect the user when clicked
    },
  };

  // Keep the service worker active until the banner displays
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 2. Handle what happens when the user clicks the notification banner
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open, focus it
      for (let client of windowClients) {
        if (client.url === event.notification.data.openUrl && "focus" in client) {
          return client.focus();
        }
      }
      // If no tab is open, open a brand new one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.openUrl);
      }
    })
  );
});