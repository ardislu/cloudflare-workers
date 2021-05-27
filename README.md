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

4. Set `account_id` in `wrangler.toml.example`:
```
account_id = [Account ID value from login]
```

5. For each Cloudflare Worker, make a copy of `wrangler.toml.example` and rename it to `wrangler.toml`. Put `wrangler.toml` in the folder for each worker. Set the Cloudflare Worker name in the copied `wrangler.toml`:
```
name = [Cloudflare Worker name]
```

6. Test that all Cloudflare Workers work:
```
npm run preview --workspaces
```

Or test an individual Worker:
```
npm run preview --workspace=[Cloudflare Worker name]
```

7. Publish all the Workers to Cloudflare
```
npm run publish --workspaces
```

Or publish an individual Worker:
```
npm run publish --workspace=[Cloudflare Worker name]
```

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
