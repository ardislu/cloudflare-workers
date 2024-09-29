# cloudflare-workers

Monorepo for my personal [Cloudflare Workers](https://workers.cloudflare.com/).

Uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) (npm
version 7+) to manage multiple `package.json` files (a separate package is
required for each Cloudflare Worker).

# Quickstart

1. Clone this repo

```
git clone https://github.com/ardislu/cloudflare-workers.git
```

2. Install dependencies

```
npm i
```

3. For each Cloudflare Worker, make a copy of `wrangler.toml.example` and rename
   it to `wrangler.toml`.
   [Customize the fields](https://developers.cloudflare.com/workers/wrangler/configuration/)
   as required.

You can use this bash script to quickly make a `wrangler.toml` file from the
`wrangler.toml.example` file in each folder:

```bash
find -name '*.example' | xargs -I {} sh -c 'cp -u "$1" "${1%.*}"' -- {}
```

Or using PowerShell:

```PowerShell
Get-ChildItem -Recurse -Filter '*.example' | Where-Object { -Not (Test-Path "$($_.DirectoryName)\$($_.BaseName)" -PathType Leaf) } | ForEach-Object { Copy-Item -LiteralPath "$($_.FullName)" -Destination "$($_.DirectoryName)\$($_.BaseName)" }
```

4. Test that each Cloudflare Worker works:

```
npm run dev --workspace=[Cloudflare Worker name]
```

5. Deploy all the Workers to Cloudflare:

```
npm run deploy --workspaces
```

Or deploy an individual Worker:

```
npm run deploy --workspace=[Cloudflare Worker name]
```

# Limitations

There are
[some permission issues](https://github.com/cloudflare/wrangler/issues/240) when
installing `wrangler` as a dependency in an npm workspace. As a workaround, I've
made `wrangler` a dependency in the top-level `package.json` for the overall
monorepo, and omitted `wrangler` from the dependencies for each workspace. That
means that **the npm scripts in each workspace depend on `wrangler` being
installed outside of the workspace**. So if you wanted to pull a workspace out
of the monorepo and run the workspace on its own, you must re-add `wrangler` to
the workspace dependencies first.

# Workers

All examples assume that the worker has been deployed at
**`https://x.y.workers.dev`**.

<h1 align="center">Reverse Proxies</h1>

## proxy

This is a minimal, basic reverse proxy. Proxy any request through the Cloudflare
Worker by passing the **entire** URL as a query string to the Cloudflare Worker.

For example, if the request you want to proxy is:

```
https://api.example.com?param1=test1&param2=test2
```

then the final request URL should be:

```
https://x.y.workers.dev?https://api.example.com?param1=test1&param2=test2
```

For simplicity, this worker does not configure the `cf` headers on the `fetch`
request that is sent to the Cloudflare proxy. Set the `cf` request headers to
configure the Cloudflare Worker's behavior on caching. See:
[Cache using fetch](https://developers.cloudflare.com/workers/examples/cache-using-fetch).

## cors

This reverse proxy injects permissive
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) response headers
to a response. Useful for using APIs that have not enabled CORS.

```
https://x.y.workers.dev?https://api-with-unconfigured-cors.example.com?param1=test1&param2=test2
```

## style

This reverse proxy injects a basic CSS style sheet to a page's `<head>` and
returns the result. Good for quickly "upgrading" old/minimalist web pages with
no styling.

```
https://x.y.workers.dev?https://site-with-no-styles.example.com
```

Before (https://www.cs.virginia.edu/~robins/YouAndYourResearch.html):
<img alt="An unstyled page. The body text stretches the entire width of the screen, making it hard to read." src="./.github/style-before.png">

After
(https://x.y.workers.dev?https://www.cs.virginia.edu/~robins/YouAndYourResearch.html):
<img alt="A styled version of the previous page. The body text is centered with a max width of about 700px, making a much easier reading experience." src="./.github/style-after.png">

## buttcoin

Returns a page where all instances of the word "bitcoin" are replaced with
"buttcoin".

```
https://x.y.workers.dev?https://en.wikipedia.org/wiki/Bitcoin
> (See image below)
```

<img alt="Snippet of the Wikipedia page for 'Bitcoin' but all instances of the word 'bitcoin' are replaced with 'buttcoin'." src="./.github/buttcoin.png">

## eruda

This reverse proxy injects [eruda](https://github.com/liriliri/eruda) into a
webpage. Good for quickly injecting DevTools into a webpage.

```
https://x.y.workers.dev?https://example.com
```

<h1 align="center">Web Utilities</h1>

## qr

Generates a SVG file representing a QR code for the value passed to the
endpoint.

```
https://x.y.workers.dev?https://example.com
> (The SVG file rendered below)
```

<img alt="QR code for https://example.com" src="./.github/qr.svg" height="200px">

## unroll

Redirects a Twitter thread to the corresponding Threadreader thread.

```
https://x.y.workers.dev?https://twitter.com/{username}/status/{id}
> (HTTP redirect to https://threadreaderapp.com/thread/{id})
```

## instagram

Returns a page with an Instagram post embedded in it so the post can be viewed
without logging in.

```
https://x.y.workers.dev?https://www.instagram.com/p/{POST_ID}/
> (Page with the Instagram post's embedded view in it)
```

## archive

Redirects a webpage to the corresponding [archive.ph](https://archive.ph)
capture. Useful to bypass news article paywalls.

```
https://x.y.workers.dev?https://example.com
> (HTTP redirect to https://archive.ph/https://example.com)
```

<h1 align="center">Command Line Utilities</h1>

## pwned

> [!CAUTION]<br> The underlying Pwned Passwords API used in this worker uses a
> [_k_-anonymity model](https://en.wikipedia.org/wiki/K-anonymity) to preserve
> your privacy. This worker negates that benefit. This worker should only be
> referenced for education, not actually used in a production backend.<br><br>
> [Click here to read more.](https://www.troyhunt.com/ive-just-launched-pwned-passwords-version-2/#cloudflareprivacyandkanonymity)

Checks a password against the [have i been pwned?](https://haveibeenpwned.com/)
API and returns a boolean indicating if the password has been pwned or not. This
is a simplified implementation of the
[Pwned Passwords Cloudflare Worker](https://github.com/HaveIBeenPwned/PwnedPasswordsCloudflareWorker).

In bash:

```bash
$ curl https://x.y.workers.dev?hunter2
true
```

In PowerShell:

```powershell
PS> irm https://x.y.workers.dev?hunter2
True
```

## ip

Returns the requester's IP address. Uses the
[Cloudflare header](https://developers.cloudflare.com/workers/runtime-apis/headers#cloudflare-headers)
`CF-Connecting-IP` to get this value. Inspired by and works like
[ifconfig.me](https://ifconfig.me) and [ifconfig.co](https://ifconfig.co).

In bash:

```bash
$ curl https://x.y.workers.dev
<your IP address>
```

In PowerShell:

```powershell
PS> irm https://x.y.workers.dev
<your IP address>
```

## uuid

Returns a random version 4 UUID.

In bash:

```bash
$ curl https://x.y.workers.dev
<random v4 UUID>
```

In PowerShell:

```powershell
PS> irm https://x.y.workers.dev
<random v4 UUID>
```

## hash

Returns the hash of a string or a hexadecimal byte array using the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).

In bash:

```bash
# SHA-256 hash of the string "Hello, world!"
$ curl "https://x.y.workers.dev?algorithm=SHA-256&query=Hello%2C%20world%21"
315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3

# MD5 hash of the literal byte array [00, AA, BB, CC]
$ curl "https://x.y.workers.dev?algorithm=MD5&hex=00AABBCC"
CD7409B51FDE80807E2E1532B7432A00
```

In PowerShell:

```powershell
# SHA-256 hash of the string "Hello, world!"
PS> irm "https://x.y.workers.dev?algorithm=SHA-256&query=Hello%2C%20world%21"
315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3

# MD5 hash of the literal byte array [00, AA, BB, CC]
PS> irm "https://x.y.workers.dev?algorithm=MD5&hex=00AABBCC"
CD7409B51FDE80807E2E1532B7432A00
```

### `algorithm` (alias `a`)

Supported values are:

- `MD5` (not part of the Web Crypto API but supported by Cloudflare Workers)
- `SHA-1`
- `SHA-256`
- `SHA-384`
- `SHA-512`

### `query` (alias `q`)

The string you want to get the hash of.

### `hex` (alias `h`)

The hexadecimal byte array you want to get the hash of. An optional "0x" prefix
may be given, the prefix is ignored.

If both `query` and `hex` are provided, `query` will be used.
