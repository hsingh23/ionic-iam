# AGENTS.md — working guide for coding agents

iAM (Integrated Amrita Meditation) is an Ionic 1.1.1 / AngularJS / Cordova
app: a single controller plays a "ting" chime at scripted intervals and
stores session history in `localStorage`. Everything ships in one commit;
all front-end dependencies are vendored under `www/lib/` (do not edit them).

## Commands

| Task                    | Command                                      |
| ----------------------- | -------------------------------------------- |
| Install build toolchain | `npm install`                                |
| Install front-end deps  | `gulp install` (runs `bower install`; rarely needed — `www/lib` is committed) |
| Compile SCSS            | `gulp sass` (scss/ionic.app.scss → www/css/) |
| Watch SCSS              | `gulp watch`                                 |
| Run in browser          | `ionic serve`                                |
| Device build            | `ionic platform add android && ionic build android` |

There are no tests, no linter config, and no CI in this repo.

## Architecture map

```
www/index.html      Entire UI: one ion-pane bound to MeditationController
www/js/app.js       Module 'starter' ['ionic','ngCordova','ngStorage'] +
                    MeditationController (the only controller)
scss/ionic.app.scss Styling entry; imports www/lib/ionic/scss/ionic
gulpfile.js         sass / watch / install tasks (default = sass)
config.xml          Cordova config; Android platform, icon/splash mapping
www/lib/            Vendored libs (Ionic, Angular, ngCordova, ngStorage, moment) — read-only
```

Runtime flow: `$ionicPlatform.ready` → `$cordovaNativeAudio.preloadSimple('ting','ting.mp3')`
→ Start button enables (`$scope.ready`). `play()` resets the position into the
hardcoded `times` array and starts the `$timeout` chain `playTingAfterTime()`,
which plays "ting" and schedules the next stage. When the array is exhausted,
a `{date, meditationLen}` record is prepended to `$storage.history`.

Data (per device, via ngStorage / `localStorage` keys `history`,
`meditationLen`):

- `history` — JSON array, newest first, of `{date: <moment serialized>, meditationLen: <minutes>}`
- `meditationLen` — number 0–15 chosen on the slider

## Conventions

- AngularJS 1.x style: one module (`starter`), controllers (not components),
  `$scope` binding, dependency injection by annotation-in-order.
- Vendored dependencies are committed; versions are pinned in `bower.json`.
- The UI lives in `www/index.html` only; the `iAM-IntegratedAmritaMeditation.html`
  file is a static mockup and `www/draft.js` a pre-Angular prototype —
  neither is loaded by the app; treat them as reference, not live code.

## Gotchas

- **`times[0]` is never a delay.** `playTingAfterTime()` plays a ting
  immediately at `pos = 0`, then increments `pos` and schedules the next
  ting at `times[pos] * 1000`. So the first ting is instantaneous and the
  array's first entry (8.5 min) is effectively skipped as an interval.
- **Slider changes after load don't affect the sequence.** The `times`
  array (including `$scope.$storage.meditationLen*60`) is built once when
  the controller is constructed. Moving the slider afterwards updates
  storage (and what gets recorded in history) but not the running sequence.
- **Browser mode is a dead end for audio.** `$cordovaNativeAudio` requires
  the native plugin; in `ionic serve` the preload rejects, the catch logs
  `no audio`, and Start stays disabled. Test on a device/emulator.
- **`play()` ignores its argument.** The Start button's `ng-click` passes a
  remote mp3 URL, but the controller's `play(soundUrl)` never uses it —
  leftover from an abandoned remote-audio idea.
- **History only records completed sequences.** Interrupted sessions (a
  second press of Start restarts and cancels the chain) leave no record.
- **Ancient toolchain.** Gulp 3, Bower, npm-package `bower`, Node-0.10-era
  assumptions. Do not "upgrade" casually; modern Node cannot run Gulp 3.
- **Vendored `www/lib` is huge (468 files in the initial commit).** Never
  regenerate, reformat, or lint it; leave it byte-identical.
- GitHub reports Dependabot alerts against the vendored 2015 libraries;
  they are acknowledged and intentionally left as-is in this snapshot.

## Verifying changes

1. `gulp sass` compiles without error.
2. `ionic serve` renders the IAM screen: slider 0–15, Start button, empty
   Recent History card.
3. On a device/emulator with plugins installed: Start enables after audio
   preload; tings fire per the `times` array; after the sequence a history
   entry appears and survives app restart.

## Pointers

- Design decisions and rationale: `architectural-diary/` (start at
  `architectural-diary/main.md`).
- Release notes: `CHANGELOG.md`.
- Full recreation spec: `prompt.md`.
