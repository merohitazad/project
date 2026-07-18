// frontend/services/pushNotificationService.js

// Helper utility to convert your VAPID key string into an array format the browser expects
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function enablePushNotifications() {
  // 1. Verify if the user's browser supports service workers and push
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications are not supported by this browser.");
    return false;
  }

  try {
    // 2. Register the sw.js script sitting in your public folder
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered successfully.");

    // 3. Request permission from the user
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("User denied notification permissions.");
      return false;
    }

    // 4. Generate the browser token mapping using your PUBLIC VAPID key
    // Replace this string with your actual backend public key
    const PUBLIC_VAPID_KEY = "BDXEpgy2x4dovSmTNIUNEGO5W8l4nKuMM3rKQ1BNAmsnlTfT4sX3vPtVm4L3gvh1RikDzr2wEoTP76x9WNGxmuM"; 
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

    // 5. Fire a POST request to your updated Render backend endpoint
    // Make sure your fetch call includes credentials to send session cookies!
    const response = await fetch("https://YOUR-RENDER-BACKEND-URL.com/api/todo/save-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription }),
    });

    if (response.ok) {
      console.log("Subscription synced successfully with backend database!");
      return true;
    } else {
      console.error("Backend failed to store the subscription.");
      return false;
    }
  } catch (error) {
    console.error("Error setting up web push tracking pipeline:", error);
    return false;
  }
}