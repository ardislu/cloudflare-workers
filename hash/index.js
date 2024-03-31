export default {
  async fetch(request) {
    const url = new URL(request.url);
    let algorithm;
    let query;
    let hex;

    // Parse URLSearchParams
    for (const [key, value] of url.searchParams) {
      const normalizedKey = key.toLowerCase();
      if ((normalizedKey === 'a' || normalizedKey === 'algorithm')) {
        if (/^SHA-?(1|256|384|512)$/i.test(value)) {
          algorithm = value.includes('-') ? value : `SHA-${value.slice(3)}`; // Insert a '-' character if it's not present; crypto.subtle.digest() requires it.
        }
        else if (value.toUpperCase() === 'MD5') {
          algorithm = 'MD5';
        }
      }
      else if ((normalizedKey === 'q' || normalizedKey === 'query') && value) { // Intentionally fail for falsy values because a null or empty string is also invalid
        query = value;
      }
      else if ((normalizedKey === 'h' || normalizedKey === 'hex') && value) {
        hex = value;
      }
    }

    // Handling bad params
    if (algorithm === undefined) {
      return new Response('Invalid algorithm provided. Provide one of the following values for the parameter "a" or "algorithm": MD5, SHA-1, SHA-256, SHA-384, or SHA-512.', { status: 400 });
    }
    if (query === undefined && hex === undefined) {
      return new Response('No input provided. Provide a string value for the parameter "q" or "query", or a hex value for the parameter "h" or "hex".', { status: 400 });
    }
    if (hex !== undefined) {
      if (hex.length % 2 === 1 || !/^(0x)?[a-fA-F0-9]+$/.test(hex)) {
        return new Response('Invalid hexadecimal input provided.', { status: 400 });
      }
    }

    let inputArray;
    if (query) {
      inputArray = new TextEncoder().encode(query);
    }
    else {
      inputArray = Uint8Array.from(hex.replace('0x', '').match(/.{2}/g), v => parseInt(v, 16));
    }
    const digest = await crypto.subtle.digest(algorithm, inputArray);
    const outputArray = [...new Uint8Array(digest)]; // Need to spread typed array into a non-typed array to allow .map() to output strings
    const hash = outputArray.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    return new Response(hash);
  }
}
