// Custom Service Worker for Push Notifications
// This file extends the default Vite PWA service worker

// Listen for push events
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');

    let data = {
        title: 'Dra. Paula Satoo',
        body: 'Nova promoção disponível!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'promotion',
        data: {
            url: '/'
        }
    };

    // Try to parse push data
    if (event.data) {
        try {
            data = { ...data, ...event.data.json() };
        } catch (e) {
            console.log('[Service Worker] Could not parse push data:', e);
            data.body = event.data.text() || data.body;
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-192.png',
        badge: data.badge || '/icons/icon-192.png',
        image: data.image,
        tag: data.tag || 'default',
        vibrate: [100, 50, 100],
        data: data.data || { url: '/' },
        actions: [
            {
                action: 'view',
                title: 'Ver Promoção',
                icon: '/icons/icon-192.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/icon-192.png'
            }
        ],
        requireInteraction: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification click:', event.action);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }
            // Open a new window if none exists
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('[Service Worker] Notification closed');
});

// Handle push subscription change
self.addEventListener('pushsubscriptionchange', (event) => {
    console.log('[Service Worker] Push subscription changed');

    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: event.oldSubscription?.options?.applicationServerKey
        }).then((subscription) => {
            console.log('[Service Worker] New subscription:', subscription);
            // Here you would send the new subscription to your server
        })
    );
});
