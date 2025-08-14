// Service Worker for Church Management System PWA

const CACHE_NAME = 'grace-church-v1.0.0';
const STATIC_CACHE = 'grace-church-static-v1.0.0';
const DYNAMIC_CACHE = 'grace-church-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/js/components.js',
    '/assets/js/admin.js',
    '/manifest.json',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Handle different types of requests
    if (request.method === 'GET') {
        if (STATIC_FILES.includes(request.url) || STATIC_FILES.includes(url.pathname)) {
            // Cache first strategy for static files
            event.respondWith(cacheFirst(request));
        } else if (request.url.includes('/api/')) {
            // Network first strategy for API calls
            event.respondWith(networkFirst(request));
        } else {
            // Stale while revalidate for other resources
            event.respondWith(staleWhileRevalidate(request));
        }
    }
});

// Cache strategies
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.log('Network request failed:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response(JSON.stringify({ error: 'Offline - data not available' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle offline actions when back online
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
        try {
            await processOfflineAction(action);
            await removeOfflineAction(action.id);
        } catch (error) {
            console.log('Failed to sync action:', error);
        }
    }
}

async function getOfflineActions() {
    // Retrieve offline actions from IndexedDB
    return [];
}

async function processOfflineAction(action) {
    // Process the offline action
    console.log('Processing offline action:', action);
}

async function removeOfflineAction(actionId) {
    // Remove processed action from IndexedDB
    console.log('Removing offline action:', actionId);
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New church notification',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/assets/images/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/images/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Grace Community Church', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
