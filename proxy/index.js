export default {
  async fetch(request) {
    const url = /^http(s)?:\/\//i.test(request.url) ? new URL(request.url) : new URL(`https://${request.url}`);
    const queryString = decodeURIComponent(url.search.substring(1));
    return await fetch(queryString);
  }
}
