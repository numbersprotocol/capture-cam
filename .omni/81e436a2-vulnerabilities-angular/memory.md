# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/81e436a2-d3a6-45a1-920b-592b684ea80d`

## Repositories

- **`capture-cam/`** — Branch: `omni/81e436a2/capture-cam`, Remote: `numbersprotocol/capture-cam`
  - <a href='https://play.google.com/store/apps/details?id=io.numbersprotocol.capturelite'><img alt='Get it on Google Play' src='https://i.imgur.com/nqDY3fd.png' height="64"/></a>
  - Has `CLAUDE.md` project instructions

## Environment & Tools

- capture-cam upgraded to Angular 20: Angular core 20.3.19, Angular CLI/build 20.3.24, Material/CDK 20.2.14, angular-eslint 20.7.0, NgRx 20.1.0.
- Local runtime observed: Node 20.20.2 and npm 10.8.2; Angular 20 compatibility verified against official Node/TypeScript/RxJS matrix.
- Local test setup: `puppeteer` is a devDependency and `karma.conf.js` sets `CHROME_BIN` from Puppeteer when unset, so `npm run test.ci` can run ChromeHeadlessCI without system Chrome.

## Key Discoveries

- Angular 20 migration changed TypeScript `moduleResolution` to `bundler`, added schematic generation defaults, and migrated Angular Material form-field CSS vars from `--mdc-filled-*` to `--mat-form-field-filled-*`.
- Browser support: because native iOS targets still include iOS 15.0/15.6, `.browserslistrc` intentionally preserves Ionic 8 floors (`Chrome >= 89`, `Firefox >= 75`, `Edge >= 89`, `Safari >= 15`, `iOS >= 15`) instead of Angular 20 Baseline-only; production/test commands warn these browsers are outside Angular 20's official support.
- Post-Angular-20 audit state without npm overrides: high/critical vulnerabilities are 0; remaining audit findings are moderate/low in `@angular-devkit/build-angular/postcss`, `webpack-dev-server/sockjs/uuid`, Cypress `@cypress/request/uuid`, and `crypto-browserify/elliptic`.
- Angular 20 checklist verification found no uses of deprecated `afterRender`, `TestBed.flushEffects`, `TestBed.get`, `InjectFlags`, experimental zoneless/checkNoChanges providers, resources/rxResource APIs, or ng-reflect selectors.

---

_Last system refresh: 2026-04-28 03:45 UTC_
