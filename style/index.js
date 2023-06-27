class InjectStyle {
  element(element) {
    element.prepend(`<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/sakura.css@1.3.1/css/sakura.min.css">`, { html: true });
  }
}

export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);
    const queryString = decodeURIComponent(url.search.substring(1));

    const response = await fetch(queryString);
    return new HTMLRewriter().on('html', new InjectStyle()).transform(response);
  }
}
