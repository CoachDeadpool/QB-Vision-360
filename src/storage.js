// Stand-in for the window.storage API this app was originally built against
// inside Claude's artifact preview. That API doesn't exist outside of Claude,
// so this file polyfills it using the browser's localStorage instead.
//
// IMPORTANT LIMITATIONS OF THIS SHIM:
// - Data is stored per-browser, per-device only. It does NOT sync across
//   devices, and does NOT actually give you a shared/multi-user database.
// - The app's "shared" storage calls (quiz results, feedback) will behave
//   as if every visitor is looking at their own private copy, since there's
//   no real backend behind this yet.
// - Before you rely on this for real players, replace this file with calls
//   to a real backend (Supabase is a good, fast option: free tier includes
//   a Postgres database and auth, and it's a natural fit for this app).
//
// Everything else in the app (App.jsx) talks to `window.storage` exactly
// the same way it did inside Claude, so you should NOT need to touch
// App.jsx to swap this out later — just replace the implementations below.

function keyFor(key, shared) {
  return `qbv360:${shared ? "shared" : "private"}:${key}`;
}

window.storage = {
  async get(key, shared = false) {
    try {
      const raw = localStorage.getItem(keyFor(key, shared));
      if (raw === null) return null;
      return { key, value: raw, shared };
    } catch (e) {
      return null;
    }
  },

  async set(key, value, shared = false) {
    try {
      localStorage.setItem(keyFor(key, shared), value);
      return { key, value, shared };
    } catch (e) {
      console.error("storage.set failed", e);
      return null;
    }
  },

  async delete(key, shared = false) {
    try {
      localStorage.removeItem(keyFor(key, shared));
      return { key, deleted: true, shared };
    } catch (e) {
      return null;
    }
  },

  async list(prefix = "", shared = false) {
    try {
      const scope = `qbv360:${shared ? "shared" : "private"}:`;
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith(scope + prefix))
        .map((k) => k.slice(scope.length));
      return { keys, prefix, shared };
    } catch (e) {
      return { keys: [], prefix, shared };
    }
  },
};
