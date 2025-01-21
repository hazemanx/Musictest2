export const registerServiceWorker = async () => {
  // Only register service worker in production and when supported
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              if (confirm('A new version is available! Would you like to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });

      console.log('Service Worker registered successfully');
    } catch (error) {
      // Log error but don't break the app
      console.warn('Service Worker registration failed:', error);
    }
  }
};