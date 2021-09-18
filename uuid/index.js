addEventListener('fetch', event => {
  event.respondWith(new Response(crypto.randomUUID()));
})
