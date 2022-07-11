export default {
  async fetch(request) {
    return new Response(request.headers.get('CF-Connecting-IP'));
  }
}
