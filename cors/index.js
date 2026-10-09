const BLOCKED_HOSTS = /^(localhost|127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?|\[?fc00:|\[?fe80:)/i;

function isSafeTarget(target) {
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return false;
  }
  if (!/^https?:$/i.test(parsed.protocol)) return false;
  if (BLOCKED_HOSTS.test(parsed.hostname)) return false;
  return true;
}

export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);
    const queryString = decodeURIComponent(url.search.substring(1));

    if (request.method !== 'OPTIONS' && !isSafeTarget(queryString)) {
      return new Response('Invalid or disallowed target URL', { status: 400 });
    }

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
