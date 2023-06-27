export class SetBase {
  constructor(origin) {
    this.origin = origin;
  }

  element(element) {
    element.prepend(`<base href="${this.origin}" />`, { html: true });
  }
}

export class UpdateLink {
  element(element) {
    for (const attrName of ['href', 'src']) {
      const attrValue = element.getAttribute(attrName);
      if (attrValue !== null && attrValue[0] === '/') {
        element.setAttribute(attrName, attrValue.substring(1));
      }
    }
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
      .transform(response);
  }
}
