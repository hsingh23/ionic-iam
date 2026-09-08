# ADR 001 — Vendored front-end dependencies committed under www/lib

- Date: 2015-12-16 (initial commit `4b55a68`)
- Status: Accepted (snapshot preserved; not revisited)

## Context

2015 Ionic tooling resolved front-end packages with Bower (`.bowerrc`
installs into `www/lib`): Ionic 1.1.1, Angular + animate/sanitize,
angular-ui-router, ngCordova, ngStorage, and moment.js (~2.10.6). Cordova
apps are bundled web roots; the device build consumes whatever is in
`www/`.

## Decision

Commit the Bower-installed `www/lib` tree to git rather than treating it
as a build artifact restored via `bower install` on each machine.

## Consequences

- Positive (in 2015): clone-and-build with no network round-trip to the
  Bower registry; exact library bytes pinned forever; `ionic build` works
  offline; no registry drift (Bower packages were routinely re-published).
- Negative: ~468 files / ~277k inserted lines in the initial commit;
  security fixes never arrive (GitHub Dependabot now flags the vendored
  copies); repository noise when diffing; `.min.js.map` and full SCSS
  source trees ride along.
- The alternative — `.gitignore www/lib` + `gulp install` on setup — was
  available (`gulpfile.js` has the `install` task) and was simply not
  chosen.

## Notes for agents

Never edit, reformat, or "upgrade" anything under `www/lib/`. If the
project were modernized, the equivalent decision would be a lockfile +
`npm install`/bundle step, with `www/lib` removed from history.
