const qr = require('qr-image');

async function handleRequest(request) {
  const url = new URL(request.url);
  const queryString = decodeURIComponent(url.search.substring(1));
  const qrImage = qr.imageSync(queryString || 'https://example.com', { type: 'svg' });

  return new Response(qrImage, {
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
