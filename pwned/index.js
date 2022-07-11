export default {
  async fetch(request) {
    const url = new URL(request.url);
    const queryString = decodeURIComponent(url.search.substring(1));

    // Convert password string to byte array and hash it, then convert hashed byte array to hex string
    const inputArray = new TextEncoder().encode(queryString);
    const digest = await crypto.subtle.digest('SHA-1', inputArray);
    const outputArray = [...new Uint8Array(digest)]; // Need to spread typed array into a non-typed array to allow .map() to output strings
    const hash = outputArray.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    // Split the hash as required by the HIBP API (k-Anonymity model)
    const range = hash.substring(0, 5);
    const index = hash.substring(5);

    const result = fetch(`https://api.pwnedpasswords.com/range/${range}`)
      .then(response => response.text())
      .then(body => body.includes(index))
      .then(bool => new Response(bool));

    return result;
  }
}
