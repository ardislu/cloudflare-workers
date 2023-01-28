export default {
  async fetch(request) {
    const url = new URL(request.url);
    const queryString = decodeURIComponent(url.search.substring(1));

    return Response.redirect(`https://archive.ph/${queryString}`);
  }
}
