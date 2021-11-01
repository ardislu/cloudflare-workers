async function handleRequest(request) {
  const url = new URL(request.url);
  const queryString = decodeURIComponent(url.search.substring(1));
  const tweet = queryString.split('/').pop();

  return Response.redirect(`https://threadreaderapp.com/thread/${tweet}`);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
