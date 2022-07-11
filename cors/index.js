export default {
  async fetch(request) {
    const url = new URL(request.url);
    const queryString = decodeURIComponent(url.search.substring(1));

    let response;
    if (request.method === 'OPTIONS') {
      response = new Response();
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
      response.headers.set('Access-Control-Allow-Methods', request.headers.get('Access-Control-Request-Method'));
      response.headers.set('Access-Control-Allow-Headers', request.headers.get('Access-Control-Request-Headers'));
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.append('Vary', 'Origin');
    }
    else {
      response = await fetch(queryString);
      response = new Response(response.body, response);
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Expose-Headers', '*, Authorization');
      response.headers.append('Vary', 'Origin');
    }

    return response;
  }
}
