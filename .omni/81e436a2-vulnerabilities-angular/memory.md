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
- Local test caveat: `npm run test.ci` requires Chrome/Chromium via `CHROME_BIN`; current workspace has no Chrome binary.

## Key Discoveries

- Angular 20 migration changed TypeScript `moduleResolution` to `bundler`, added schematic generation defaults, and migrated Angular Material form-field CSS vars from `--mdc-filled-*` to `--mat-form-field-filled-*`.
- Angular 20 browser support uses Baseline date `2025-04-30`; `.browserslistrc` should use `baseline widely available on 2025-04-30` to avoid unsupported browser warnings.
- Post-Angular-20 audit state: high/critical vulnerabilities are 0; remaining audit findings are moderate/low in `webpack-dev-server/sockjs/uuid`, Cypress `@cypress/request/uuid`, and `crypto-browserify/elliptic`.

---

_Last system refresh: 2026-04-27 06:23 UTC_
