export default {
  async fetch(request) {
    return new Response(event.request.headers.get('CF-Connecting-IP'));
  }
}
