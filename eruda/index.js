import { SetBase, UpdateLink } from '../proxy';

class InjectEruda {
  element(element) {
    element.prepend('<script src="//cdn.jsdelivr.net/npm/eruda@3.0.1/eruda.js" integrity="sha512-iqTxJJyPkonhuLaymGBUWM6x/icdahslHnzOZjrQifaSH+RjA3SGNGhKWboNqhbekZiN63UeorCfIz6XJBD/Fw==" crossorigin></script><script>eruda.init();</script>', { html: true });
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
      .on('body', new InjectEruda())
      .transform(response);
  }
}
