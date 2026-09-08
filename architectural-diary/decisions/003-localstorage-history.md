# ADR 003 — Zero-backend persistence with ngStorage/localStorage

- Date: 2015-12-16 (initial commit `4b55a68`)
- Status: Accepted

## Context

The only data the app produces is "a meditation finished, at this time, of
this chosen length." There is no account system, no sync target, and a
single intended user. The app must show the three most recent sessions on
the main screen and remember them across restarts.

## Decision

Persist with ngStorage (`ngStorage` ~0.3.10): inject `$localStorage`, seed
defaults once via `$localStorage.$default({ history: [], meditationLen: 0 })`,
bind the slider directly to `$storage.meditationLen`, and on sequence
completion prepend `{ date: moment(), meditationLen: <n> }` to
`$storage.history` (using the `Array.prototype.insert` polyfill defined at
the top of app.js). Render with `history | limitTo:3`.

## Consequences

- Positive: two-way binding means the slider and history need no glue code;
  serialization to `localStorage` keys (`history`, `meditationLen`) is
  automatic; works fully offline on-device.
- Negative: no backup/export — clearing WebView storage erases history;
  `date` is stored as whatever `moment()` serializes to, so the format is
  coupled to moment's default output; records are only written when a full
  sequence completes, so abandoned sessions are invisible; history grows
  unboundedly (only the display is capped at 3).
- Alternatives considered: none seriously — a backend or a file plugin was
  scope the project never needed.
