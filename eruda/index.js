class InjectEruda {
  element(element) {
    element.prepend('<script src="//cdn.jsdelivr.net/npm/eruda"></script><script>eruda.init();</script>', { html: true });
  }
}

export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);
    const queryString = decodeURIComponent(url.search.substring(1));

    const response = await fetch(queryString);
    return new HTMLRewriter().on('body', new InjectEruda()).transform(response);
  }
}
