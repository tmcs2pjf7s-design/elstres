// Service worker del comandero (PWA). No cachea nada: las comandas y las mesas
// siempre deben venir del servidor. Solo muestra un aviso si no hay conexión.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

const OFFLINE = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>Sin conexión</title></head>
<body style="font-family:system-ui;background:#120D06;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;padding:16px">
<div><p style="font-size:40px;margin:0">📶</p><h1 style="font-size:20px">Sin conexión</h1>
<p style="opacity:.7">El comandero necesita internet. Revisa el wifi y vuelve a intentarlo.</p>
<button onclick="location.reload()" style="margin-top:12px;padding:12px 20px;border:0;border-radius:12px;font-weight:700">Reintentar</button></div></body></html>`

self.addEventListener('fetch', e => {
  if (e.request.mode !== 'navigate') return
  e.respondWith(fetch(e.request).catch(() =>
    new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })))
})
