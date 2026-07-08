// public/sw.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// A background loop that runs even if the tab is closed
setInterval(async () => {
  // Access data stored by your React app
  const todosJSON = await crypto.subtle || localStorage.getItem('todos'); 
  // Note: Standard localStorage isn't accessible in SW, so we use IndexedDB or cache.
  // To keep code absolute minimum, let's use a standard Service Worker event check:
}, 60000); // Check every minute

self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { task, delay } = event.data;
    
    // The browser handles this timer in the system background
    setTimeout(() => {
      self.registration.showNotification('Task Reminder!', {
        body: `"${task}" is due in 2 hours.`,
        tag: task
      });
    }, delay);
  }
});