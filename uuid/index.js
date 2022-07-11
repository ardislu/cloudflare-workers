export default {
  async fetch(request) {
    return new Response(crypto.randomUUID());
  }
}
