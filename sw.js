/**
 * Service Worker for Task Scheduler
 * Provides offline functionality
 */

const CACHE_NAME = 'task-scheduler-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/custom.css',
    '/js/app.js',
    '/js/data-manager.js',
    '/js/models.js',
    '/js/router.js',
    '/js/templates.js',
    '/js/ui-controllers.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Install event - cache assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Skip waiting on install');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker');

    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached assets or fetch
self.addEventListener('fetch', event => {
    // Skip for CORS and other complex requests
    if (event.request.url.indexOf('http') !== 0 || event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Return cached response
                    console.log('[Service Worker] Found in cache:', event.request.url);
                    return response;
                }

                // Not in cache, fetch from network
                return fetch(event.request)
                    .then(networkResponse => {
                        // Don't cache responses with error status codes
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Cache the fetched response
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Fetch failed:', error);
                        // Could return a custom offline page here
                    });
            })
    );
});// Service Worker for offline functionality
