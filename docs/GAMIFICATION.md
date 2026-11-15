# Gamification — shipped and still proposed

Status (2026-11-15): the owner lifted the old ban and explicitly asked for coins.
**Shipped:** earned coins, a once-a-day goal award, three cosmetic accent looks,
the word-list learner and the vocabulary polish. **Still proposed:** mastery
seals, the rest day, the one-more change and the confusion constellation. The
unchecked items at the bottom are not in the app.

## Where the product is today

The app already has a light progression system:

- **XP and levels** — `state.xp`, one level per 100 XP, shown on Today.
- **A day streak** — `state.streak`, shown as a flame and a number.
- **A daily goal** — cards counted in `state.daily`, adapted by `src/adaptive.js`.
- **A path** — units unlock on cards met, not on XP.
- **Mastery** — "solid" counts cards whose interval is at least six days.
- **"One more"** — a filled control on the session summary.
- **Coins** — earned by finished lessons, first-try answers, clean sheets,
  vocabulary sessions and the daily goal. They buy looks, nothing else.
- **Looks** — Ember (free), Plum (60 coins) and Moss (120 coins), in Settings.

XP is still paid per session, so repeating a short session farms it. That is
now a deliberate, cosmetic-only number; the coins are earned the same way and
buy no learning advantage.

## The line I will not cross

These stay banned regardless of the lifted ban, because they are the mechanics
that turn practice into compulsion:

- notifications, badges that expire, or "you will lose X" copy
- purchases, paid coins, loot, energy, or a second currency (earned coins are
  shipped, but they buy cosmetics only)
- leaderboards, public profiles, or comparisons to other learners
- an infinite card feed, or a "keep going" loop that never ends
- a number that goes up for opening the app rather than for remembering
  something

The test for every mechanic below: **does it make the next real card more likely,
or only make the app feel busier?**

## What shipped, and why it is acceptable

**Coins.** A finished lesson pays 2 coins for showing up, 1 per first-try answer
and 3 for a clean sheet (`src/economy.js`). Vocabulary pays 1 per correct word.
Reaching the daily goal pays 5 once that day. Nothing is paid for opening the
app, for a login streak, or for a purchase. There is no daily cap: the currency
cannot buy learning, so farming it only changes a colour.

**Looks.** Coins buy accented themes. Ember is free; Plum costs 60; Moss costs
120. The accent changes the colour of actions, focus and the coin count, not
the content, the schedule or the difficulty. The shop is in
**Settings → Look**.

**Word list.** Not a gamification mechanic, but the same problem — a generic
course does not cover the words a person actually needs. Paste a list, see what
the pack has, start a focused lesson. See `README.md`.

## Proposed mechanics, in build order

### 1. Today ring — a goal, not a score

A single 44 px ring beside the streak shows today's real card count against the
learner's own adaptive goal (`ADAPT.dailyGoal`). It fills as cards are answered,
completes once, and never resets to zero with a penalty. No animation beyond the
existing 120 ms press/answer motion.

- **Data:** `state.daily.cards`, `ADAPT.dailyGoal(history)`. No new storage.
- **Copy:** `today · 6 of 10`; at the goal, `today · done`.
- **Metric:** share of sessions that reach the goal, and time-to-first-card.
- **Risk:** low. This is presentation of an existing fact.
- **Effort:** S — one component, one test for the goal arithmetic.

### 2. One more — the weakest card, once

The summary already offers **One more**. Today it starts a fresh session. Change
it to draw **one** card from the learner's weakest due pair, then return to the
summary. The button stays in the thumb zone, stays the only filled control, and
does not become a feed.

- **Data:** `MEM.weakItems`, `state.confusions`, existing SRS queue.
- **Copy:** `one more · the pair you keep mixing` above the card.
- **Metric:** completion rate of the one-more card; lapses on that pair in the
  next seven days.
- **Risk:** low, but it changes the end-of-session contract; approve the copy and
  the single-card limit.
- **Effort:** S–M.

### 3. Mastery seals — one-time proof, no points

Six seals, each tied to a real event already in storage. They are shown only in
**Progress → More details**, never on Today, never as a notification, and never
with a countdown. They do not pay XP.

| Seal | Earned when |
|---|---|
| First conversation | one completed chat with three learner turns |
| First text finished | one reader completed with a score |
| Fifty solid | 50 cards with an interval of six days or more |
| Seven-day rhythm | seven consecutive days with one session each |
| Two languages | two decks with at least one solid card |
| Own sentence | one personal sentence survives its first review |

- **Data:** existing counters plus `state.seals[id] = timestamp`; no network.
- **Copy:** the name and one line of what happened; no exclamation marks.
- **Metric:** day-7 return for learners who earn the first seal, compared with
  their own previous week; no cross-user comparison.
- **Risk:** medium — this is the badge mechanic the old rules banned. Approve the
  list, the placement, and the "no notification" rule explicitly.
- **Effort:** M.

### 4. Rest day — a streak that can breathe

One **rest day** is earned for every five consecutive practised days. It is
applied automatically to the first missed day; it cannot be bought, saved up
beyond one, or advertised. Copy says `rest day used`, never `streak lost`.

- **Data:** `state.streak.restDays` and the existing day key.
- **Metric:** return within two days after a missed day.
- **Risk:** medium — any streak protection can become a loss-framed mechanic.
  The guardrail is that it is earned, capped at one, and never mentioned before
  it is used.
- **Effort:** S.

### 5. Weekly recap — three real numbers

**Progress** gains one line: `this week · 4 sessions · 38 cards · 71% first try`.
It is computed from `state.history`, `state.daily` and `state.reviews`; it is not
a screen, not a share card, and not a notification.

- **Data:** existing.
- **Metric:** visits to Progress; not a growth target, just context.
- **Risk:** low.
- **Effort:** S.

## One bold idea — the confusion constellation

**Hypothesis.** Learners repeat the same confusions because a list of "most
confused pairs" is not actionable. If the app turns each confusion into a
one-tap, three-card targeted drill, repeated lapses on that pair will fall.

**What it is.** In Progress, the confused-pairs list becomes a small constellation
of the learner's own pairs. Each edge is a real drill: tap it, get three cards
that separate the two meanings (one recognition, one production, one contrast),
then return to Progress. No new content; it reuses the existing items,
`state.confusions`, `neighboursOf` and the SRS queue.

**Metric.** Lapses on the targeted pair in the seven days after a drill, compared
with the seven days before. Locally, each pair already carries a count, so the
test is a before/after pair of numbers, not a cohort study.

**Cheapest test.** Do not draw the constellation first. Add a **"drill this
pair"** button to the existing list, log the pair and the three answers, and
compare the counts. If the drill does not move lapses, the constellation is
decoration and should not be built.

**Risk.** Low, if the drill is capped at three cards and the constellation never
becomes a second home screen.

## Approval checklist

- [ ] Keep the existing XP, or make it non-farmable (XP only for a first correct
      answer per item per day)?
- [x] Earned coins and cosmetic accent looks — shipped at the owner's request.
- [ ] Approve or reject **mastery seals** as specified (six, Progress-only,
      no notifications, no XP).
- [ ] Approve or reject **rest day** (one earned, capped, auto-applied).
- [ ] Approve the one-more change (one weakest card, then back).
- [ ] Approve the confusion-constellation test (drill first, drawing second).

Until these are checked, only the low-risk presentation work (ring, weekly
recap) is safe to build without changing the learning contract. Coins and looks
were added by explicit owner request; they do not change the learning contract.
