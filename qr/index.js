import QRCode from 'qrcode';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const queryString = decodeURIComponent(url.search.substring(1));
    const qrImage = await QRCode.toString(queryString || 'https://example.com', { type: 'svg' });

    return new Response(qrImage, {
      headers: {
        'Content-Type': 'image/svg+xml'
      }
    })
  }
}
