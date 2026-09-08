# iAM — Integrated Amrita Meditation

A tiny Ionic 1 / Cordova Android app that guides an "Integrated Amrita
Meditation" (IAM) session by playing a soft "ting" chime (`www/ting.mp3`) at
each scripted stage of the technique. The meditator picks an optional
meditation length, presses Start, and the app sounds the chime at the
prescribed intervals; finished sessions are kept in a local history list.

This is a 2015-era personal project, committed as a single snapshot. It is
preserved here as-is (plus documentation) — expect an ancient toolchain.

## Features

- **Scripted interval chime**: a hardcoded `times` array (in seconds, one
  entry per stage of the IAM sequence) drives a `$timeout` chain that plays
  the "ting" sound at each stage. The first ting fires immediately on Start.
- **Optional meditation length**: a 0–15 minute slider; the chosen value
  becomes one of the timed stages in the sequence.
- **Session history**: when the full sequence finishes, the session
  (date + length) is prepended to a history list persisted with `ngStorage`
  (`localStorage`); the three most recent entries render on the main screen.
- **Native audio**: chime playback via `$cordovaNativeAudio`
  (ngCordova); the Start button stays disabled until the sound is preloaded.

## Stack

| Layer     | Choice                                                       |
| --------- | ------------------------------------------------------------ |
| Framework | Ionic 1.1.1 (AngularJS 1.4, `angular.module('starter')`)     |
| Platform  | Apache Cordova (Android target; iOS resources included)      |
| Storage   | ngStorage ~0.3.10 over `localStorage`                        |
| Audio     | ngCordova ~0.1.23-alpha (`$cordovaNativeAudio`) + `ting.mp3` |
| Dates     | moment.js ~2.10.6 (history formatting)                       |
| Build     | Gulp 3 (`gulp-sass`, `gulp-minify-css`, `gulp-concat`), Bower |
| Deps      | Vendored — committed directly under `www/lib/`               |

## Quickstart

The original 2015 toolchain is assumed: Node ~0.10–4 era, npm, Bower,
Gulp 3, and the Ionic/Cordova CLI. Vendor libraries are already committed,
so a Bower install is only needed if you change `bower.json`.

```sh
npm install -g bower gulp cordova ionic   # 2015-era CLIs
npm install                                # gulp toolchain
gulp sass                                  # compile scss/ionic.app.scss -> www/css
ionic serve                                # run in browser (ting sound needs the device)
ionic platform add android                 # optional: device build
ionic build android
```

Notes:

- `ionic serve` runs the app, but `$cordovaNativeAudio` only works on a
  device/emulator with the native audio plugin installed; in the browser the
  preload fails, the catch logs `no audio`, and the Start button never
  enables.
- There are no required environment variables or API keys — the app is fully
  offline with no backend.

## Project structure

```
config.xml                  Cordova app config (id com.ionicframework.myapp664332, name "iam")
bower.json / .bowerrc       Bower deps -> installed into www/lib
package.json                Gulp toolchain + Cordova plugin/platform lists
gulpfile.js                 gulp sass / watch / install (bower) tasks
ionic.project               Ionic CLI project file
scss/ionic.app.scss         Ionic SCSS entry (imports vendored Ionic SCSS)
hooks/after_prepare/        Cordova hook: adds platform class to <html>
resources/                  Android + iOS icons and splash screens (all densities)
www/                        App itself (deployed web root)
  index.html                Single screen: slider, Start button, recent history
  js/app.js                 MeditationController (module 'starter')
  draft.js                  Pre-Angular prototype of the interval script
  iAM-IntegratedAmritaMeditation.html   Static mockup of the main screen
  ting.mp3                  The chime
  css/ style.css            (empty) custom CSS target
  lib/                      Vendored Ionic, Angular, ngCordova, ngStorage, moment
```

## Documentation

- `AGENTS.md` — working guide for agents (commands, architecture, gotchas).
- `CHANGELOG.md` — what changed, including the 2026-09-08 messages-only
  history rewrite.
- `architectural-diary/` — the app's design decisions and rationale.
- `prompt.md` — one-shot prompt that recreates this app from scratch.
