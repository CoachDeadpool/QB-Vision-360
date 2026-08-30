# QB Vision 360

A training app for young Canadian football quarterbacks — lessons, drills, film
review, a self-quiz, and a personal development plan. Built by Dan Carnevale
(a.k.a. Coach Deadpool).

This project was exported from a Claude-built prototype into a standalone
Vite + React app so it can be deployed as a real, independent website.

## Important: read this before deploying

The original prototype used a Claude-specific storage API (`window.storage`)
to save progress, quiz results, and feedback. That API doesn't exist outside
of Claude, so `src/storage.js` in this project is a **temporary stand-in**
that uses the browser's `localStorage` instead.

**What this means right now:**
- Data (lesson progress, drill reps, quiz scores, feedback, etc.) is saved
  per-device, per-browser only. It won't sync between a player's phone and
  laptop, and it disappears if they clear their browser data.
- The "shared" data used for the Quiz Coach View and the Feedback section
  will NOT actually be shared between different players — each visitor only
  sees their own local copy.

**This is fine for testing the app yourself or with a very small pilot
group**, but before real players rely on it, you'll want to replace
`src/storage.js` with calls to a real backend. **Supabase** is a strong,
fast option — free tier includes a Postgres database and built-in user
authentication, and the API shape in `storage.js` was kept deliberately
simple so swapping it out shouldn't require touching `App.jsx` at all.

## Getting started locally

You'll need [Node.js](https://nodejs.org) installed (v18 or later).

```bash
npm install
npm run dev
```

This starts a local dev server (usually at http://localhost:5173) where you
can click through the app exactly like the Claude preview.

## Pushing to GitHub

If you haven't already, create a new empty repository on GitHub (no README,
no .gitignore — this project already has them), then from this folder:

```bash
git init
git add .
git commit -m "Initial commit: QB Vision 360"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Deploying to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click "Add New Project" and select this repository.
3. Vercel will auto-detect it as a Vite project — no configuration needed.
4. Click "Deploy."

Within a minute or two you'll have a live URL (something like
`qb-vision-360.vercel.app`). Every time you push a new commit to the `main`
branch on GitHub, Vercel automatically rebuilds and updates the live site.

## Project structure

```
qb-vision-360/
├── index.html          # HTML entry point
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx         # React entry point, loads storage.js then App
│   ├── App.jsx           # The entire app (all subjects, tabs, components)
│   └── storage.js        # localStorage polyfill — replace with a real backend later
└── README.md
```

## Making changes

For now, the simplest workflow is:
1. Ask Claude (in the chat where this app was built) to make the content or
   feature change you want.
2. Copy the updated file over `src/App.jsx` in this project.
3. Commit and push — Vercel redeploys automatically.

Once real backend/auth work begins, that logic will live outside this single
file, and changes are better made directly against this real project (e.g.
with Claude Code) rather than regenerated from the Claude chat.
