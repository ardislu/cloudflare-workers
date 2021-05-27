async function handleRequest(request) {
  const url = new URL(request.url);
  const queryString = decodeURIComponent(url.search.substring(1));

  let response = await fetch(queryString);
  response = new Response(response.body, response);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Headers', '*');
  response.headers.set('Access-Control-Allow-Methods', '*');
  response.headers.set('Access-Control-Expose-Headers', '*');
  response.headers.set('Access-Control-Max-Age', '86400');
  
  return response;
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
