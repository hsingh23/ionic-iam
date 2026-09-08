# Architectural diary — iAM (Integrated Amrita Meditation)

Index of the design decisions behind this app, in the order they matter.
Each entry records context, the decision, and its consequences. The whole
app landed as one commit on 2015-12-16 (`4b55a68`), so dates are not
per-decision; ordering reflects how the build unfolded (prototype →
controller → persistence).

| # | Decision | Status |
| - | -------- | ------ |
| 1 | [Vendored front-end dependencies committed under www/lib](decisions/001-vendored-dependencies.md) | Accepted (snapshot preserved) |
| 2 | [Scripted interval timer: hardcoded times array + $timeout chain](decisions/002-scripted-interval-timer.md) | Accepted |
| 3 | [Zero-backend persistence with ngStorage/localStorage](decisions/003-localstorage-history.md) | Accepted |

## Narrative

The goal was a personal Android companion for the IAM technique: nothing
more than a chime at each stage of the sequence and a log of sessions.
`www/draft.js` shows the earliest idea — a bare `setTimeout` loop over a
hardcoded list of stage durations. That prototype was ported almost
verbatim into `MeditationController` (www/js/app.js) once the Ionic
scaffolding existed, gaining native audio (`$cordovaNativeAudio`), a slider
for the variable-length stage, and persistent history. The app is a single
screen (`www/index.html`) bound to a single controller; there is no router
use, no services, no backend, and no tests. That minimalism is the
architecture: a snapshot of a working personal tool, frozen in 2015.

See also: `AGENTS.md` (day-to-day working guide), `prompt.md` (recreation
spec), `CHANGELOG.md` (release notes and the 2026-09-08 messages-only
history rewrite).
