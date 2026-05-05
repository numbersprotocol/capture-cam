# Workspace Context

<!-- This file is auto-maintained. The Repositories section is refreshed -->
<!-- by the system. The AI should maintain Environment & Key Discoveries. -->

**Workspace root (absolute path):** `/home/workspaces/conversations/39e875ba-0698-4f8f-a4f9-17f7494c8339`

## Repositories

- **`capture-cam/`** — Branch: `omni/39e875ba/capture-cam`, Remote: `numbersprotocol/capture-cam`
  - <a href='https://play.google.com/store/apps/details?id=io.numbersprotocol.capturelite'><img alt='Get it on Google Play' src='https://i.imgur.com/nqDY3fd.png' height="64"/></a>
  - Has `CLAUDE.md` project instructions

## Environment & Tools

- capture-cam currently uses Angular 21.2.11, Ionic 8.8.5, and Capacitor 8.3.1 according to `package.json`.

## Key Discoveries

- iOS dependencies were migrated away from CocoaPods to Capacitor SPM: `ios/App/CapApp-SPM/Package.swift` hosts Capacitor/plugin packages, Firebase is referenced from `firebase-ios-sdk` SPM in `ios/App/App.xcodeproj/project.pbxproj`, `@numbersprotocol/preview-camera` 0.0.23 and `@numbersprotocol/preview-video` 0.0.8 include native SPM support upstream, and `scripts/ensure-ios-spm-packages.js` only patches AppsFlyer.

---

_Last system refresh: 2026-05-05 02:06 UTC_
