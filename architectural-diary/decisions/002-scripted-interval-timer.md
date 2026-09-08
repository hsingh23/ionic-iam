# ADR 002 — Scripted interval timer: hardcoded times array + $timeout chain

- Date: 2015-12-16 (initial commit `4b55a68`)
- Status: Accepted

## Context

The IAM technique prescribes a fixed sequence of stages with specific
durations; only one stage varies with the practitioner's chosen meditation
length (0–15 minutes). The earliest artifact, `www/draft.js`, encoded the
durations as a literal array and walked it with recursive `setTimeout`.

## Decision

Keep that exact shape in production code: `MeditationController` holds a
literal `times` array of per-stage durations in seconds (the variable stage
slotted in as `$scope.$storage.meditationLen*60`) and a recursive
`playTingAfterTime()` that plays the chime via `$cordovaNativeAudio` and
schedules the next stage with Angular's `$timeout`. The array and the
recursion live directly in the controller — no timer service, no
configuration file, no per-stage labels.

## Consequences

- Positive: minimal code; the sequence is readable as a column of numbers;
  `$timeout` integrates with Angular's digest (history updates the UI);
  `play()` cancels any in-flight chain with `$timeout.cancel`.
- Negative / quirks (all observed in the code, retained as-is):
  - `times[0]` (8.5 min) is never used as a delay — the first ting sounds
    immediately on Start, then delays come from `times[1]` onward.
  - The array is built once at controller construction, so slider changes
    after load do not affect a subsequent session's timing (they do affect
    what is recorded in history).
  - A stage list change means editing source code; no runtime
    configurability.
  - Only one timer lifetime is managed (`started`); the design assumes a
    single session at a time, which holds for a one-button app.

## Alternatives considered

- A `$interval` tick + countdown math — more state, no benefit at this size.
- A data-driven "stages" service with labels — deferred; there was no UI
  need for stage names.
