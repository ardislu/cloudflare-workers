import { decode } from 'html-entities';

class SetBase {
  constructor(origin) {
    this.origin = origin;
  }

  element(element) {
    element.prepend(`<base href="${this.origin}" />`, { html: true });
  }
}

class UpdateLink {
  element(element) {
    for (const attrName of ['href', 'src']) {
      const attrValue = element.getAttribute(attrName);
      if (attrValue !== null && attrValue[0] === '/') {
        element.setAttribute(attrName, attrValue.substring(1));
      }
    }
  }
}

class ReplaceBitcoin {
  #buffer = '';

  text(text) {
    this.#buffer += text.text;

    if (text.lastInTextNode) {
      const buttText = this.#buffer
        .replaceAll('bitcoin', 'buttcoin')
        .replaceAll('Bitcoin', 'Buttcoin')
        .replaceAll('BITCOIN', 'BUTTCOIN')
        .replaceAll(/bitcoin/gi, 'buttcoin'); // Any other mixed case just become buttcoin
      text.replace(decode(buttText));
      this.#buffer = '';
    }
    else {
      text.remove();
    }
  }
}

export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);

    const queryString = decodeURIComponent(url.search.substring(1));
    let remoteUrl;
    try {
      remoteUrl = new URL(queryString);
    }
    catch {
      return new Response('Invalid URL provided in query string.');
    }

    const response = await fetch(remoteUrl);

    return new HTMLRewriter()
      .on('head', new SetBase(remoteUrl.origin))
      .on('link, script', new UpdateLink())
      .on('html', new ReplaceBitcoin())
      .transform(response);
  }
}
