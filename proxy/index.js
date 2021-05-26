async function handleRequest(request) {
  const url = new URL(request.url);
  const queryString = decodeURIComponent(url.search.substring(1));

  return await fetch(queryString);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
