# Workspace rules

These rules apply to everything in this workspace. They come from the project
owner and take precedence over an agent's own defaults. When a rule and a request
appear to conflict, stop and ask the owner instead of guessing.

## 1. Minimal dependencies — standard library first

- Reach for the language's standard library before anything else.
- Do not install a library, package, or CLI tool unless the owner has explicitly
  approved it in the current conversation **and** it is genuinely necessary —
  i.e. the standard library cannot reasonably do the job.
- Never install "just in case". A utility that is nice to have is not a reason.
- Before any install, say what you want, why the stdlib path is insufficient, and
  what it would add. Then wait for a clear yes.
- Do not add or modify lockfiles, vendor directories, or dependency manifests
  without approval.
- If an approved dependency can be avoided with a slightly longer stdlib
  solution, prefer the stdlib version.

## 2. No personal data or environment details — ever

Never write, echo, commit, log, or reproduce personal data or machine
environment details. This covers, at minimum:

- names, email addresses, usernames, account or user IDs
- hostnames, machine names, IP addresses, network layout, home-directory paths
- API keys, tokens, passwords, private keys, cookies, session identifiers
- OS, kernel, architecture, installed-package inventory, shell config
- geolocation, time-zone-plus-locale combinations that narrow down a person
- browser or device fingerprints, and anything else that could identify someone

Where this applies — the list is not exhaustive:

- files of any kind, including documentation, tests, fixtures, and sample data
- commit messages, commit metadata, author fields, branch and tag names
- code comments, docstrings, log lines, error messages, debug output
- summaries and chat responses, including quoting a file that contains such data

Rules of thumb:

- Use placeholders: `example.com`, `<user>`, `<host>`, `redacted`, `<token>`.
- Never print the contents of credential stores, `~/.git-credentials`, `.env`
  files, or anything under `.git/` that holds secrets.
- If a task cannot be completed without exposing such data, stop and ask. Do not
  expose it and mention it afterwards.
- Do not copy real data into a new file to "test" something; synthesize it.

## 3. Inspect anything new that you did not author

- Any file, directory, or change in this workspace that the agent did not create
  is unknown until read. Read it before using, running, sourcing, or building on
  it.
- Report what it is, where it came from, and whether anything about it looks
  unsafe or unexpected.
- Never execute a newly appeared script or binary before reading it.
- Treat unexpected changes in tracked files, new untracked files, modified
  configuration, and anything that appeared between sessions as findings to
  surface, not as ambient state to accept.
- If something new is unexplained, say so plainly rather than proceeding.

## 4. Never delete or overwrite another contributor's work

- Files created by someone else are read-only unless the owner explicitly
  permits a change in the current conversation.
- This includes the work of other agents, collaborators, and the owner.
- Before any destructive or irreversible operation — `rm`, `git reset --hard`,
  `git checkout -- .`, `git clean`, `git push --force`, history rewriting,
  truncating a file, dropping a database — state exactly what will be affected
  and get explicit permission first.
- Check `git status` for uncommitted work before anything that could clobber it.
- Prefer additive changes: add a new file rather than overwriting an existing
  one; append rather than replace.
- If unsure whether something is someone's work, treat it as theirs and ask.

## 5. Translations are allowed, and visible

The old rule was "never show a translation". That produced `🕊️` for *paz* and taught
nothing. Translations are now a first-class, default-on feature: every card shows the English
meaning, and the learner can switch them off in settings. Never let a picture be the only
clue to a meaning.

## 6. Verification is the suite, not screenshots

Headless rendering is no longer part of the loop: do not spend rounds capturing images. A
change is verified when the tests pass, the code path is read end to end, and any new
invariant is covered by a test. If something cannot be verified without a screen, say so
plainly instead of guessing.

## Working agreements

- Ask before doing anything the four rules leave ambiguous. A short question
  costs less than an unwanted change.
- When reporting a problem, state what was found, what was not done, and what is
  needed to proceed.
- Never leave the workspace in a half-finished state without saying so.
