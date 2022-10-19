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

4. Test that each Cloudflare Worker works:

```
npm run dev --workspace=[Cloudflare Worker name]
```

5. Publish all the Workers to Cloudflare:

```
npm run publish --workspaces
```

Or publish an individual Worker:

```
npm run publish --workspace=[Cloudflare Worker name]
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

<h1 align="center">Web Utilities</h1>

## qr

Generates a SVG file representing a QR code for the value passed to the
endpoint.

```
https://x.y.workers.dev?https://example.com
> (The SVG file rendered below)
```

<img alt="QR code for https://example.com" src="./qr.svg" height="200px">

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

<h1 align="center">Command Line Utilities</h1>

## pwned

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
PS> (Invoke-WebRequest https://x.y.workers.dev?hunter2).Content
true
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
PS> (Invoke-WebRequest https://x.y.workers.dev).Content
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
PS> (Invoke-WebRequest https://x.y.workers.dev).Content
<random v4 UUID>
```

## hash

Returns the hash of a string using the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).

In bash:

```bash
$ curl https://x.y.workers.dev?algorithm=SHA-256&query=Hello%2C%20world%21
315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3
```

In PowerShell:

```powershell
PS> (Invoke-WebRequest https://x.y.workers.dev?algorithm=SHA-256&query=Hello%2C%20world%21).Content
315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3
```

### `algorithm`

Supported values are:

- `SHA-1`
- `SHA-256`
- `SHA-384`
- `SHA-512`

### `query` (alias `q`)

The string you want to get the hash of.
