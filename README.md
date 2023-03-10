# Welcome to my Upfluence challenge

This is a simple app that allows you to view the latest processed posts from the Upfluence API using [Remix](https://remix.run/) and [Fly](https://fly.io/).

## Setup

### Install dependencies

```sh
npm install
```

## Development
This starts your app in development mode, rebuilding assets on file changes.

From your terminal:

```sh
npm run dev
```

## Description of your solution.
I chose to use Remix because its a framework that focus on delivering the best user experience. It's also a framework that I'm familiar (and excited for its future) and I wanted to use it to showcase my skills.

Remix allows us to have a very clean and simple codebase, it delivers a SSR experience (which is great for SEO and for the user experience as they are able to see the actual html that would be rendered right away).
I also chose to use TailwindCSS because it's a utility-first CSS framework that allows us to have a very clean and simple UI.

One option was to preprocess all the data from the stream and transform it on the server (like what is done in `data-stream` but I decided to do it on the client side instead as the calculation needed where not that computationally expensive and it would allow me to (if needed) deploy it to a static hosting service like Netlify. But using the server side approach would have been a better option if the data was more complex or if we were concerned about the performance of the app.

I also decided to use Fly as it's a very simple and easy to use PaaS that allows us to deploy our app in a matter of minutes.

I also used chart.js as it's a very simple and easy to use charting library that allows us to create beautiful charts with very little effort. I used the vanilla version of the library (tree shaken to keep the bundle size as small as possible) just to show how react could integrate with vanilla js libraries (and  I did not wanted to recreate all the datasets on every render and wanted to do no more work that was needed).

I used React as it's a library that I'm very familiar with and I wanted to showcase my skills with it.
I used TypeScript as it's a language that allows me to write more robust code (and refactor it more easily) and I wanted to showcase my skills with it.


## Deployment

1. [Install `flyctl`](https://fly.io/docs/getting-started/installing-flyctl/)

2. Sign up and log in to Fly

```sh
flyctl auth signup
```

3. Setup Fly. It might ask if you want to deploy, say no since you haven't built the app yet.

```sh
flyctl launch

4. Build your app

```sh npm run build
```

5. Deploy your app

```sh
npm run deploy
```

You can run `flyctl info` to get the url and ip address of your server.

Check out the [fly docs](https://fly.io/docs/getting-started/node/) for more information.
