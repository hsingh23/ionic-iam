# prompt.md — one-shot recreation of iAM (Integrated Amrita Meditation)

Give this prompt to a coding agent to recreate the app from scratch. It
describes the app as built at commit `4b55a68` (2015-12-16), including
every design decision and its known quirks.

## Goal

A minimal single-screen mobile app that guides an "Integrated Amrita
Meditation" session: the practitioner presses Start and the app plays a
soft chime ("ting", an mp3 asset) at each scripted stage of the technique.
One stage's duration is chosen by the user (0–15 minutes); everything else
is fixed. When the full sequence completes, the session is logged to a
local, persistent history shown on the same screen (three most recent
entries). No backend, no accounts, no network, no env vars.

## Stack

- Ionic 1.1.1 framework on AngularJS 1.4 (`angular.module('starter', ['ionic','ngCordova','ngStorage'])`)
- Apache Cordova, Android platform (iOS icons/splash resources optional)
- ngCordova ~0.1.23-alpha for `$cordovaNativeAudio`
- ngStorage ~0.3.10 for `$localStorage` persistence
- moment.js ~2.10.6 for date formatting
- Gulp 3 + gulp-sass/gulp-minify-css/gulp-rename; Bower with
  `.bowerrc` → `{ "directory": "www/lib" }`
- Dependencies vendored (committed) under `www/lib/`
- Cordova plugins: device, console, whitelist, splashscreen, statusbar,
  ionic-plugin-keyboard (+ the native-audio plugin ngCordova wraps)

## Phased build order

1. **Scaffold**: `ionic start` blank tabs-less project; `config.xml`
   (widget id `com.ionicframework.myapp664332`, name `iam`, description
   "An Ionic Framework and Cordova project.", author Harsh Singh);
   `bower.json` (name "HelloIonic", private) with the deps above;
   `package.json` (name "iam", version "1.1.1") with the gulp toolchain
   and the Cordova plugin/platform lists; `ionic.project` (name "iam",
   empty app_id); `.editorconfig`; `.gitignore`
   (`node_modules/`, `platforms/`, `plugins/`);
   `hooks/after_prepare/010_add_platform_class.js` (adds the platform CSS
   class to `<html>`); `resources/` with Android + iOS icons and splash
   images for all densities referenced from `config.xml`.
2. **Prototype the timing** (`www/draft.js`, standalone, not loaded by the
   app): a literal `times` array of stage durations in seconds and a
   recursive `setTimeout` walker.
3. **Main screen** (`www/index.html`): one `ion-pane` with
   `ng-controller="MeditationController"`; header bar titled "IAM";
   `ion-content` containing: a "list" form with the text "Optional
   meditation length in minutes", an `ion-item.range.range-calm` holding
   `<input type="range" min="0" max="15"
   ng-model="$storage.meditationLen">` plus a `<strong>` showing the value;
   a Start button `button button-balanced button-block icon-right
   ion-ios-play`, `ng-disabled="!ready"`, `ng-click="play(...)"`; a 100px
   spacer; and a card list "Recent History" iterating
   `$storage.history | limitTo:3` showing `formatDate(event.date)` and
   `{{event.meditationLen}} min`. Load `lib/ionic/js/ionic.bundle.js`,
   `lib/ngstorage/ngStorage.min.js`, `lib/moment/min/moment.min.js`,
   `lib/ngCordova/dist/ng-cordova.js`, then `cordova.js`, then `js/app.js`.
4. **Controller** (`www/js/app.js`): `Array.prototype.insert(index, item)`
   splice polyfill; module `starter`; `app.run` hiding the keyboard
   accessory bar and styling the status bar on platform ready;
   `MeditationController` per "APIs" below.
5. **Styles**: `scss/ionic.app.scss` sets
   `$ionicons-font-path: "../lib/ionic/fonts"` and imports
   `www/lib/ionic/scss/ionic`; `gulp sass` emits to `www/css/`;
   `www/css/style.css` starts empty.
6. **Asset**: `www/ting.mp3` (the chime).

## All design decisions (replicate faithfully)

1. **Vendored deps**: commit `www/lib` (Ionic, Angular, ui-router, ngCordova,
   ngStorage, moment) instead of restoring per-machine. Rationale: 2015
   clone-and-build reliability; cost: ~468 files and permanent
   security-staleness. Do not re-lint or upgrade vendored code.
2. **Hardcoded scripted timing**: durations live as a literal array in the
   controller, not config/data. Use exactly (seconds):
   `8*60+30, 2*60, 20, 15, 10, 5, 55, 15, 15, 15, 15, 15, 15, 15, 15, 15,
   15, 15, 15, 15, 15, 15, 30, 90, 120, 10, 8, 8, 8, 8, 8, 8, 30,
   meditationLen*60, 120, 5*60, 0` — with the user's `meditationLen*60`
   substituted at array-build time.
3. **Recursive $timeout chain** `playTingAfterTime()`: if `pos <
   times.length` → play "ting", `pos += 1`, schedule the next call after
   `times[pos]*1000` ms; else prepend the history record. `play()` resets
   `pos = 0`, records `startTime`, cancels any pending `started` timeout,
   and starts the chain. Keep these exact quirks: the first ting fires
   immediately (so `times[0]` never acts as a delay); the array is built
   once at controller construction, so later slider moves change recorded
   history but not the running sequence; history records are written only
   on full completion.
4. **Native audio gating**: preload in `$ionicPlatform.ready` inside
   try/catch (`preloadSimple('ting', 'ting.mp3')`); on success set
   `$scope.ready = true` (enables Start); on failure `alert(error)`; the
   catch logs "no audio" (browser mode never enables Start). Playing is
   also wrapped in try/catch logging "playing".
5. **ngStorage persistence**: `$localStorage.$default({ history: [],
   meditationLen: 0 })` assigned to `$scope.$storage`; slider binds
   directly; history entries `{ date: moment(), meditationLen: n }`
   prepended via `history.insert(0, x)`.
6. **Formatting**: `formatDate(m)` returns `moment(m).format("dd M/D a")`.
7. **Dead parameter**: the Start button's ng-click passes an mp3 URL
   string but `play()` ignores its argument — reproduce as a no-op
   argument (historic leftover of an abandoned remote-audio idea) or omit
   if you prefer a clean recreation; note the choice.
8. **Reference files kept**: `www/draft.js` (prototype) and
   `www/iAM-IntegratedAmritaMeditation.html` (static mockup with sample
   history rows "Dec 6 - 5:33 pm, +2 min" etc.) stay in the repo, unloaded.

## Data model

Per-device `localStorage` (ngStorage keys):

- `history`: JSON array, newest first; elements
  `{ "date": <moment() serialization>, "meditationLen": <int 0–15> }`
- `meditationLen`: int 0–15 (slider position)

## APIs by name

- `angular.module('starter', ['ionic','ngCordova','ngStorage'])`
- `app.run(function($ionicPlatform))` — platform-ready setup
- `app.controller("MeditationController", function($scope, $cordovaNativeAudio, $ionicPlatform, $ionicLoading, $timeout, $localStorage))`
- `$scope.play()` — (re)start the interval chain
- `$scope.formatDate(m)` — moment formatting "dd M/D a"
- `$scope.ready`, `$scope.$storage`
- `$cordovaNativeAudio.preloadSimple('ting', 'ting.mp3')`, `$cordovaNativeAudio.play("ting")`
- `$localStorage.$default({ history: [], meditationLen: 0 })`
- Internal: `times` (array), `pos`, `started` (timeout promise), `startTime`,
  `playTingAfterTime()`, `Array.prototype.insert`

## Acceptance criteria

1. `gulp sass` compiles; `ionic serve` shows the single IAM screen with
   slider (0–15) and Start disabled and an empty Recent History card.
2. On device/emulator, Start enables after audio preload; pressing Start
   plays a ting immediately, then subsequent tings follow the array delays
   (first scheduled delay = `times[1]` = 2 minutes).
3. Pressing Start again cancels and restarts the chain; no history entry is
   written for the abandoned run.
4. After the final stage, a history entry appears at the top of Recent
   History with format like "We 12/16 pm" and "<n> min"; it persists after
   app restart; at most 3 entries render.
5. Moving the slider updates the displayed number and the stored
   `meditationLen` used by the next session's record.
6. No network calls; no environment variables; no secrets in the repo.
