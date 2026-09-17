// Blocks proxying to loopback, link-local, private, and cloud metadata addresses to prevent SSRF.
function isForbiddenTarget(targetUrl) {
  if (!/^https?:$/i.test(targetUrl.protocol)) {
    return true;
  }
  const hostname = targetUrl.hostname.toLowerCase();
  return hostname === 'localhost'
    || hostname === '169.254.169.254'
    || hostname === '[::1]'
    || /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(hostname)
    || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    || /^\[::1?\]?$|^\[fe80:|^\[fc00:|^\[fd00:/.test(hostname);
}

export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);
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
      const targetUrl = new URL(queryString);
      if (isForbiddenTarget(targetUrl)) {
        return new Response('Forbidden target URL', { status: 400 });
      }
      response = await fetch(targetUrl);
      response = new Response(response.body, response);
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('Origin'));
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Expose-Headers', '*, Authorization');
      response.headers.append('Vary', 'Origin');
    }

    return response;
  }
}
