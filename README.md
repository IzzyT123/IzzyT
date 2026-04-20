# IzzyT.com

Personal portfolio site: above-the-fold project cards, then a merged reverse-chronological timeline (lanes for ChangeAble, GPT Builder Pro—including dated reviews—DeGPT, and Canimate). Built with [Next.js](https://nextjs.org/) (static export), Tailwind CSS v4, and Framer Motion.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

`next build` produces a static site in the `out/` directory (see `output: "export"` in [`next.config.ts`](next.config.ts)).

## Deploying to IzzyT.com

1. Connect the repo to your host (e.g. [Vercel](https://vercel.com/) or any static host).
2. Build command: `npm run build`. Output directory: `out` (static export).
3. **DNS:** At your registrar, point **IzzyT.com** to the host:
   - **Vercel:** Add the domain in the project settings and follow the A/CNAME records Vercel shows.
   - **Generic static host:** Use the provider’s documented apex (root) and `www` records; many use a CNAME for `www` and ALIAS/ANAME or A records for the apex.

4. Enable HTTPS (usually automatic on Vercel and similar).

## Content

- Copy, links, overview cards: [`src/data/site.ts`](src/data/site.ts)
- GPT reviews (with `id`, `date`, `lang`): [`src/data/gpt-reviews.json`](src/data/gpt-reviews.json)
- Timeline merge logic: [`src/data/build-timeline.ts`](src/data/build-timeline.ts)

## License

Private; all rights reserved unless you choose otherwise.
