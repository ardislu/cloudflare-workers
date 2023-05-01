import writeQR from '@paulmillr/qr';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const queryString = decodeURIComponent(url.search.substring(1));
    const qrImage = writeQR(queryString || 'https://example.com', 'svg');

    return new Response(qrImage, {
      headers: {
        'Content-Type': 'image/svg+xml'
      }
    })
  }
}
