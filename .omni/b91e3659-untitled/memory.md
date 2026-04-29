# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/b91e3659-3aad-48b4-b4e5-b3a466a558a2`

## Repositories

- **`capture-cam/`** — Branch: `omni/b91e3659/capture-cam`, Remote: `numbersprotocol/capture-cam`
  - <a href='https://play.google.com/store/apps/details?id=io.numbersprotocol.capturelite'><img alt='Get it on Google Play' src='https://i.imgur.com/nqDY3fd.png' height="64"/></a>
  - Has `CLAUDE.md` project instructions

## Environment & Tools

- capture-cam verified locally with Node v22.13.0 and npm 10.9.2; production build command used successfully: `node set-secret.js && npx ng build --configuration production`.
- `npm ci` currently fails because `package.json` and `package-lock.json` are out of sync for entries including `chokidar@5.0.0`, `readdirp@5.0.0`, `@types/node@25.6.0`, and `undici-types@7.19.2`.

## Key Discoveries

- PR 3454 updates `@capgo/capacitor-social-login` to 8.3.20 and `cordova-plugin-purchase` to 13.15.4; social login cancellation now rejects with `code === 'USER_CANCELLED'`, so app code should handle that without showing an error toast.
- capture-cam in-app purchase code registers consumable products only; the `cordova-plugin-purchase` 13.15.4 StoreKit 2 intro-offer eligibility fix does not require app code changes for the current product setup.

---

_Last system refresh: 2026-04-29 03:59 UTC_
