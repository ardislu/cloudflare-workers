class InjectStyle {
  element(element) {
    element.prepend(`<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/sakura.css@1.3.1/css/sakura.min.css">`, { html: true });
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const queryString = decodeURIComponent(url.search.substring(1));

  const response = await fetch(queryString);
  return new HTMLRewriter().on('html', new InjectStyle()).transform(response);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})
