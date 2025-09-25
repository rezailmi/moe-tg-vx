## moe-tg-vx Starter

Production-ready Next.js 15 starter configured with Tailwind CSS v4, shadcn/ui, and theming helpers. Built with TypeScript, ESLint, Prettier, and sensible defaults for accessibility and DX.

### Tech stack

- Next.js App Router with React 19 support and Turbopack dev server
- Tailwind CSS v4 using the new `@theme` and `@layer` directives
- shadcn/ui components sourced locally with `next-themes`
- Inset sidebar layout and empty-state homepage scaffold
- TypeScript strict mode, ESLint Flat config, Prettier, and import aliases

### Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the app. Edit `src/app/page.tsx` to customize the landing page or add new routes under `src/app`.

### Project scripts

- `npm run dev` — start Next.js in development with Turbopack
- `npm run build` — create an optimized production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint across the repo
- `npm run type-check` — verify TypeScript types without emitting files
- `npm run format` — check formatting with Prettier
- `npm run format:fix` — format files with Prettier

### Tailwind & shadcn/ui

Component source lives under `src/components/ui`. Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add accordion avatar button
```

Global styles and design tokens are defined in `src/app/globals.css` using CSS variables generated during `shadcn init`.

### Deployment

The app is ready for Vercel out of the box (`next.config.ts` defaults). Configure environment variables in the Vercel dashboard or `.env.local` and run `npm run build` before deploying.
