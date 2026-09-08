# Changelog

All notable changes to this project are documented in this file.

## History-rewrite note (2026-09-08)

On 2026-09-08 the single commit's message was improved via a messages-only
`git filter-branch` rewrite (tree contents unchanged). The original commit
`21244d74f9f594897fa0e78659b28b83cd31baf6` ("stuff") became
`4b55a68a73aeda731038fc1d5e66b272b9cc7823`. File trees are byte-identical;
only the commit hash and message changed.

## 0.0.1 — 2015-12-16

Initial commit: `4b55a68a73aeda731038fc1d5e66b272b9cc7823` (short `4b55a68`)
— feat: scaffold IAM meditation timer app with Ionic 1.1.1.

### Added

- Ionic 1.1.1 / Cordova project scaffolding: `config.xml`, `gulpfile.js`,
  `bower.json`, `package.json`, `.bowerrc`, `.editorconfig`, `.gitignore`,
  `ionic.project`, and the `hooks/after_prepare/010_add_platform_class.js`
  Cordova hook.
- Vendor libraries committed directly under `www/lib`: Ionic 1.1.1 bundle
  (with Angular, AngularJS modules, and Ionic SCSS), `angular-animate`,
  `angular-sanitize`, `angular-ui-router`, `ngCordova` (~0.1.23-alpha),
  `ngStorage` (~0.3.10), and `moment` (~2.10.6).
- Android and iOS icon and splash-screen resources for all densities under
  `resources/`.
- `MeditationController` in `www/js/app.js`: preloads a "ting" chime
  (`www/ting.mp3`) via `$cordovaNativeAudio` and plays it at a scripted
  sequence of intervals chained with `$timeout`.
- Optional 0–15 minute meditation-length slider bound to `ngStorage`
  `$localStorage`; completed sessions are prepended to a persisted
  `history` array and the three most recent entries are shown on the main
  screen (`www/index.html`).
- `www/draft.js`: standalone pre-Angular prototype of the interval timing
  script, kept for reference.
- `www/iAM-IntegratedAmritaMeditation.html`: static mockup of the main
  screen with sample history entries.
