# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/81e436a2-d3a6-45a1-920b-592b684ea80d`

## Repositories

- **`capture-cam/`** — Branch: `omni/81e436a2/capture-cam`, Remote: `numbersprotocol/capture-cam`
  - <a href='https://play.google.com/store/apps/details?id=io.numbersprotocol.capturelite'><img alt='Get it on Google Play' src='https://i.imgur.com/nqDY3fd.png' height="64"/></a>
  - Has `CLAUDE.md` project instructions

## Environment & Tools

- capture-cam upgraded to Angular 21: Angular core 21.2.10, Angular CLI/build 21.2.8, Material/CDK 21.2.8, angular-eslint 21.3.1, NgRx 21.1.0, TypeScript 5.9.3.
- Local runtime observed: Node 20.20.2 and npm 10.8.2; Angular 21 compatibility verified against official Node/TypeScript/RxJS matrix, but npm install warns Capacitor CLI 8.3.1 declares Node >=22.
- Local test setup: `puppeteer` is a devDependency and `karma.conf.js` sets `CHROME_BIN` from Puppeteer when unset, so `npm run test.ci` can run ChromeHeadlessCI without system Chrome.

## Key Discoveries

- Angular 21 migration added `provideZoneChangeDetection()` in `src/main.ts`, updated `tsconfig.json` target libs, migrated most templates to built-in control flow, and required fixing `long-press.directive.spec.ts` setup to avoid NG0100 after stricter test checks.
- Browser support: because native iOS targets still include iOS 15.0/15.6, `.browserslistrc` intentionally preserves Ionic 8 floors (`Chrome >= 89`, `Firefox >= 75`, `Edge >= 89`, `Safari >= 15`, `iOS >= 15`) instead of Angular 21 Baseline-only; production/test commands warn these browsers are outside Angular 21's official support.
- Post-Angular-21 audit state without npm overrides: production audit is 0 vulnerabilities; full dev audit remains 9 moderate from Angular devkit `postcss`/`webpack-dev-server`/`sockjs` and Cypress `@cypress/request`/`uuid`, with no non-downgrade fix available upstream.

---

_Last system refresh: 2026-04-28 06:14 UTC_
