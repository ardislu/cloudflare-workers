addEventListener('fetch', event => {
  event.respondWith(new Response(event.request.headers.get('CF-Connecting-IP')));
})
