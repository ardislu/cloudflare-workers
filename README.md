# cloudflare-workers

Monorepo for my personal [Cloudflare Workers](https://workers.cloudflare.com/).

Uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) (npm version 7+) to manage multiple `package.json` files (a separate package is required for each Cloudflare Worker). 

# Quickstart

1. Clone this repo
```
git clone https://github.com/ardislu/cloudflare-workers.git
```

2. Install dependencies
```
npm i
```

3. Authorize yourself with your Cloudflare account
```
npm run login
```

4. For each Cloudflare Worker, make a copy of `wrangler.toml.example` and rename it to `wrangler.toml`. Set `account_id` in `wrangler.toml`:
```
account_id = [Account ID value from login]
```

5. Test that all Cloudflare Workers work:
```
npm run preview --workspaces
```

Or test an individual Worker:
```
npm run preview --workspace=[Cloudflare Worker name]
```

6. Publish all the Workers to Cloudflare:
```
npm run publish --workspaces
```

Or publish an individual Worker:
```
npm run publish --workspace=[Cloudflare Worker name]
```

# Limitations

There are [some permission issues](https://github.com/cloudflare/wrangler/issues/240) when installing `wrangler` as a dependency in an npm workspace. As a workaround, I've made `wrangler` a dependency in the top-level `package.json` for the overall monorepo, and omitted `wrangler` from the dependencies for each workspace. That means that **the npm scripts in each workspace depend on `wrangler` being installed outside of the workspace**. So if you wanted to pull a workspace out of the monorepo and run the workspace on its own, you must re-add `wrangler` to the workspace dependencies first.

# Workers

## proxy

This is a minimal, basic reverse proxy.

### Usage

Proxy any request through the Cloudflare Worker by passing the **entire** URL as a query string to the Cloudflare Worker. So if your Cloudflare Worker domain is 
```
https://x.y.workers.dev
```
and the request you want to proxy is
```
https://api.example.com?param1=test1&param2=test2
```
then the final request URL should be
```
https://x.y.workers.dev?https://api.example.com?param1=test1&param2=test2
```

### Caching

For simplicity, this code does not configure the `cf` headers on the `fetch` request that is sent to the Cloudflare proxy. Set the `cf` request headers to configure the Cloudflare Worker's behavior on caching. See: [Cache using fetch](https://developers.cloudflare.com/workers/examples/cache-using-fetch). 

## instagram

This reverse proxy embeds Instagram posts so they can be viewed without logging in.

### Usage

Same as `proxy`, but it will only work on instagram URLs in the format: `https://www.instagram.com/p/{POST_ID}/`.

## cors

This reverse proxy injects permissive CORS response headers to a response. Useful to use APIs that have not enabled CORS.

### Usage

Same as `proxy`.

## pwned

Checks a password against the [have i been pwned?](https://haveibeenpwned.com/) API and returns a boolean indicating if the password has been pwned or not. This is a simplified re-implementation of the [Pwned Passwords Cloudflare Worker](https://github.com/HaveIBeenPwned/PwnedPasswordsCloudflareWorker).

### Usage

Pass a plaintext password as the entire query string to the endpoint. For example, if your Cloudflare Worker domain is 
```
https://x.y.workers.dev
```
and the password you want to check is
```
hunter1
```
then the final request URL should be
```
https://x.y.workers.dev?hunter1
```

## qr

Generates a QR code for the value passed to the endpoint. Note: set the `type` property in `wrangler.toml` to `webpack` to use `require`.

### Usage

Same as `proxy`.

## ip

Returns the requester's IP address. Uses the [Cloudflare header](https://developers.cloudflare.com/workers/runtime-apis/headers#cloudflare-headers) `CF-Connecting-IP` to get this value. Inspired by and works like [ifconfig.me](https://ifconfig.me) and [ifconfig.co](https://ifconfig.co).

### Usage

In bash:
```
curl https://x.y.workers.dev
> <your IP address>
```

In PowerShell:
```
(Invoke-WebRequest https://x.y.workers.dev).Content
> <your IP address>
```

## uuid

Returns a random version 4 UUID.

### Usage

In bash:
```
curl https://x.y.workers.dev
> <random v4 UUID>
```

In PowerShell:
```
(Invoke-WebRequest https://x.y.workers.dev).Content
> <random v4 UUID>
```

## hash

Returns the hash of a string using the [crypto web API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest).

### Usage

In bash:
```
curl https://x.y.workers.dev?algorithm=SHA-256&query=Hello%2C%20world%21
> 315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3
```

In PowerShell:
```
(Invoke-WebRequest https://x.y.workers.dev?algorithm=SHA-256&query=Hello%2C%20world%21).Content
> 315F5BDB76D078C43B8AC0064E4A0164612B1FCE77C869345BFC94C75894EDD3
```

### `algorithm`

Supported values are:
- `SHA-1`
- `SHA-256`
- `SHA-384`
- `SHA-512`

### `query` (alias `q`)

The string you want to get the hash of.

## style

Reverse proxy which injects a basic CSS style sheet.

### Usage

Same as `proxy`.

## unroll

Redirects a tweet thread to the corresponding Threadreader thread.

### Usage

Same as `proxy`, but only works on tweet URLs.
