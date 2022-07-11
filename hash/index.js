export default {
  async fetch(request) {
    const url = new URL(request.url);
    let algorithm = 'SHA-256';
    let query = 'Example string';
    for (const [key, value] of url.searchParams) {
      if (key.toLowerCase() === 'algorithm' && ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].includes(value.toUpperCase())) {
        algorithm = value;
      }
      else if ((key.toLowerCase() === 'q' || key.toLowerCase() === 'query') && value) { // Intentionally excluding falsy values and not just null because empty strings are no good
        query = value;
      }
    }

    // Convert query string to byte array and hash it, then convert hashed byte array to hex string
    const inputArray = new TextEncoder().encode(query);
    const digest = await crypto.subtle.digest(algorithm, inputArray);
    const outputArray = [...new Uint8Array(digest)]; // Need to spread typed array into a non-typed array to allow .map() to output strings
    const hash = outputArray.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    return new Response(hash);
  }
}
