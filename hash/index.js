export default {
  async fetch(request) {
    const url = new URL(request.url);
    let algorithm;
    let query;

    // Parse URLSearchParams
    for (const [key, value] of url.searchParams) {
      const normalizedKey = key.toLowerCase();
      if ((normalizedKey === 'a' || normalizedKey === 'algorithm') && /^SHA-?(1|256|384|512)$/i.test(value)) {
        algorithm = value.includes('-') ? value : `SHA-${value.slice(3)}`; // Insert a '-' character if it's not present; crypto.subtle.digest() requires it.
      }
      else if ((normalizedKey === 'q' || normalizedKey === 'query') && value) { // Intentionally fail for falsy values because a null or empty string is also invalid
        query = value;
      }
    }

    // Handling bad params
    if (algorithm === undefined) {
      return new Response('Invalid algorithm provided. Provide one of the following values for the parameter "a" or "algorithm": SHA-1, SHA-256, SHA-384, or SHA-512.', { status: 400 });
    }
    else if (query === undefined) {
      return new Response('Invalid query provided. Provide a value for the parameter "q" or "query".', { status: 400 });
    }

    // Convert query string to byte array and hash it, then convert hashed byte array to hex string
    const inputArray = new TextEncoder().encode(query);
    const digest = await crypto.subtle.digest(algorithm, inputArray);
    const outputArray = [...new Uint8Array(digest)]; // Need to spread typed array into a non-typed array to allow .map() to output strings
    const hash = outputArray.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

    return new Response(hash);
  }
}
