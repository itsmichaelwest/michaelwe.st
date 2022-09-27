# 🏡 michaelwe.st

Welcome to my home on the internet.

## Build instructions

This site is built with Next.js. You'll need [Node.js](https://nodejs.org/download/) with [Yarn](https://classic.yarnpkg.com/en/).

1. Clone this repository. I use Git LFS to store image files, so you may need to configure your copy of Git to work with this.
2. Run `yarn` to install dependencies.
3. To preview the site, run `yarn dev` and then go to `localhost:3000`.
4. To build a production deploy, run `yarn build` then `yarn start` and go to `localhost:3000`.

### Fonts looking different?

The live website uses font files from Adobe Fonts. Because they are only licensed to me, through my Creative Cloud account, I cannot include them in this repository. Instead, the fonts are injected automatically at build time on Netlify.
