import { SetBase, UpdateLink } from '../proxy';

class InjectStyle {
  element(element) {
    element.prepend(`<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/sakura.css@1.5.0/css/sakura.min.css">`, { html: true });
  }
}

export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);
    const remoteUrl = new URL(decodeURIComponent(url.search.substring(1)));

    const response = await fetch(remoteUrl);
    return new HTMLRewriter()
      .on('head', new SetBase(remoteUrl.origin))
      .on('link, script', new UpdateLink())
      .on('html', new InjectStyle())
      .transform(response);
  }
}
