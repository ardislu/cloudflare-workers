export default {
  async fetch(request) {
    const url = new URL(request.url);
    const queryString = decodeURIComponent(url.search.substring(1));

    const segments = queryString.split('/');
    const id = segments.pop() || segments.pop(); // If there's a trailing '/' character, need to pop() twice

    const responseBody = `<!DOCTYPE html>
    <body>
      <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/${id}/?utm_source=ig_embed" data-instgrm-version="13"></blockquote>
      <script async defer src="https://platform.instagram.com/en_US/embeds.js"></script>
    </body>`;

    return new Response(responseBody, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  }
}
