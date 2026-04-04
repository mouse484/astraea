/// <reference lib="WebWorker" />

const sw = globalThis as unknown as ServiceWorkerGlobalScope

sw.addEventListener('install', (event) => {
  event.waitUntil(sw.skipWaiting())
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(sw.clients.claim())
})

sw.addEventListener('fetch', () => {})
