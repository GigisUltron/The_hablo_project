# Demo video plan

A practical shot list, script, demo-data recipe and recording checklist for showing
hablo. The goal is not to tour every feature. The goal is to make one claim
believable in ninety seconds:

> **A complete language course, including the tutor, runs on the machine in front
> of you.**

Everything in the video must be real: the app, the model, the audio, the counts.
No staged replies, no edited progress numbers and no personal data in frame.

## Deliverables

| Cut | Length | Use | Format |
|---|---|---|---|
| Primary demo | 90 seconds | Hackathon submission, portfolio, first link | 16:9, 1080p |
| Walkthrough | 3 minutes | Judges who want depth, README video | 16:9, 1080p |
| Loop | 15–20 seconds | Social preview, silent autoplay | 9:16, 1080×1920 |

Record the 3-minute walkthrough first, then cut the 90-second version from it.
The loop is a separate, tighter take.

Do not commit the video files to the repository. Upload them, then link them from
the README or the submission page.

## The story

The order is deliberate. The unexpected thing goes first; the expected thing
proves it.

1. **The text talks back.** A reading word is tapped, heard, kept, and turned into
   a practice card. This is the hook.
2. **There is no cloud.** One command starts the app and the local model. The
   terminal is evidence, not the opening shot.
3. **It teaches.** A real lesson: teach, answer, feedback, summary. This is the
   product, not a trick.
4. **The tutor is local.** A streamed reply, a Stop control, an authored mission.
5. **The numbers are honest.** Progress shows what happened, with sample sizes.
6. **It still works offline.** Network off, lesson continues; if the local model
   also survives the test, show that too.
7. **Close on the promise.** MIT, no account, no analytics, no subscription.

## What each claim needs on screen

| Claim | Must be visible | Do not say |
|---|---|---|
| No account, no cloud | Full-screen app, Settings → Your data, no sign-in anywhere | “100% private” as an absolute |
| Local model | Terminal output `local model: ready`, status line in Conversation, streamed reply | “GPT” or a model brand not actually running |
| Thirteen languages | Language library with readable names, a short scroll | “Fluent in thirteen languages” |
| Learning loop | A card answered, feedback, summary built from kept/missed | “Guaranteed retention” |
| Reading word feature | Word underlined, tap, audio, meaning line, Practice button | “AI reads for you” |
| Offline | Wi-Fi off, next lesson card answered; reload if it works | “Works forever offline” |
| One command | `python3 serve.py` and its startup lines | “No setup” — first run downloads the model |
| Tests | Only in the technical cut; use a cropped/clean terminal | A stale test count |
| Open source | MIT line in README or LICENSE | “Free forever” as a legal promise |

## Before recording

### 1. Use a dedicated demo profile

Create a separate browser profile. Do not record from a personal profile.

- Learning language: **Spanish**.
- Interface language: **English**.
- Level: complete the first short lessons rather than editing storage.
- Personal why: **Travel**.
- Interests: **cooking, football** — synthetic, nothing real about a person.
- Zoom: 110% at 1440×900, or 100% at 1280×800. Check the reading text and the
  session counter are legible at 1080p.
- Light theme, Ember accent.
- Hide the bookmarks bar, extensions, download shelf and notifications.

### 2. Warm the model before the camera

```sh
python3 serve.py --no-open
```

Wait for `local model: ready`, then open the printed URL. In
**Settings → Local model**, press **Test reply** and confirm a real sentence comes
back. Keep the model warm for every take; do not record a cold load in the main
cut.

If the machine has already installed the model, startup is quick. The first-run
download is a separate, labelled time-lapse at most; never present it as instant.

### 3. Build a believable, honest demo state

Spend ten minutes using the app, not editing it:

1. Complete two short lessons. Miss one answer on purpose so Progress has a real
   miss, a real confusion and a real accuracy sample.
2. Open **Read a text**, choose a packed Spanish text that contains `pan` or
   `leche`, tap two authored words, then answer the three questions and reach the
   finish screen.
3. Open **Conversation**, send one short Spanish message, and let the local model
   answer. Leave the mission strip visible.
4. Open **Roleplay** once from **Plan a lesson** with “dinner out, I want pizza”
   or similar.
5. Check Progress: there should be nonzero words met and a visible sample next to
   accuracy. Never record the empty `0/47 words met · 100% accuracy` state.
6. In **Settings → Your data**, download a backup. Store it outside the repository.
   Use import to reset between takes.

The exact numbers do not matter. The fact that they came from play does.

### 4. Choose the reading text

Use a packed text with several authored words, for example the Spanish market
text containing `pan` and `leche`. Confirm before recording:

- both words are underlined;
- tapping one shows the meaning line;
- the bundled clip is audible in the recording;
- **Practice this word** starts exactly one card;
- the finish screen still offers the kept words.

If a word is not authored by the pack it stays plain prose. That is intentional;
do not “fix” it on camera or imply every word is tappable.

### 5. Capture audio properly

The word clips and conversation speech are part of the product. Route system audio
into the recorder (desktop audio in OBS, a loopback device, or the platform’s
screen-recording system audio). Test with a five-second clip and play it back
before the real take.

- Narration microphone close and clear.
- No music under speech, or very low and licensed.
- Pause narration while a word clip plays.
- If the machine has no installed speech voice and conversation audio is silent,
  turn **Settings → Speak replies** off and do not claim spoken replies in the
  video.

### 6. Scrub the frame

Before every take, check the whole screen for:

- browser profile name or avatar, tabs, bookmarks, history, extensions;
- notifications, email, calendar, password manager;
- terminal path containing a home directory or user name;
- operating-system user name, machine name, Wi-Fi network name, IP address;
- file manager windows, desktop files, recording app overlays;
- real personal notes in **Settings → Personalize**;
- generated model text containing a real name.

Blur or crop what cannot be removed. Prefer removing it.

## Recording setup

| Setting | Choice |
|---|---|
| Canvas | 1920×1080, 16:9, 30 or 60 fps |
| Browser | One clean window, 110% zoom, no bookmarks bar |
| App view | Today, session, reader and Progress at full width |
| Cursor | Visible, deliberate movement, no circles or scribbles |
| Terminal | Large font, repository path cropped or generic, no secrets |
| Audio | System audio + narrator, tested before every take |
| Takes | One continuous take per chapter; cut on transitions, never mid-answer |
| Time-lapse | Only installation, clearly labelled |

Record the walkthrough in chapter-sized takes. The lesson, the streamed reply and
the reading word interaction should each play in real time.

## Primary cut — 90 seconds

| Time | Picture | Action | What it proves | Voiceover |
|---|---|---|---|---|
| 0:00 | Reading text, word underlined | Tap `pan`; audio plays; line shows `pan · bread` | The text is alive | “This is a language course that runs on the machine in front of you. No account. No cloud. Watch what the text can do.” |
| 0:10 | Same text | Tap a second word; **Practice 2 words** appears; click | Reading becomes practice | “Every word the course knows is a handle. Tap it, hear it, keep it. The words you touch become a lesson.” |
| 0:20 | Session card for a kept word | Let the card land | The claim is real | “Not a demo mockup. A real card, from the text.” |
| 0:25 | Terminal | `python3 serve.py`; wait for `local model: ready`; URL | One command, local model | “One command starts the app and the local model. First run installs the model; after that it starts quickly.” |
| 0:38 | Today | Scroll the path; point at Start lesson | One action, a real path | “Thirteen languages. One learning engine. Today has one action: start the lesson.” |
| 0:45 | Lesson | Teach card, answer, verdict | The loop | “New words, recall, listening, production. What you miss comes back before the session ends.” |
| 1:02 | Summary | Kept and coming back, One more | Honest result | “The summary is built from what actually happened, not from a score animation.” |
| 1:10 | Conversation | Type `Quiero un café con leche, por favor.`; reply streams; press Stop once | Local model, control | “The tutor is a model on this machine. Replies stream in, and you can stop one mid-sentence.” |
| 1:25 | Progress | Header, coach read, 7-day strip, path | Real counts, sample size | “Progress counts real recalls, with the sample size beside the accuracy.” |
| 1:34 | Settings | Translations off, then a lesson card with no translation prompt | The setting is real | “Translations can be switched off. The lesson still runs, with listening and building instead.” |
| 1:43 | Lesson with Wi-Fi off | Answer one card; audio plays | Offline | “And after setup, the course still works with the network off.” |
| 1:50 | Close on Today | Hold | The promise | “hablo. MIT licensed. No account, no analytics, no subscription. The whole course, and the tutor, on your machine.” |

Keep the actual read under two minutes. If a word clip or a model reply takes too
long, cut around the wait; do not speed up the model to make it look faster than
it is.

## Walkthrough — 3 minutes

Add these beats between the primary chapters. Keep each one short.

| Time | Beat | Notes |
|---|---|---|
| 0:00 | Cold open on the reading tap | Same hook, slightly longer: two words, practice card, back to text |
| 0:20 | First run, labelled time-lapse | Optional; show the install line and the `ready` line, never real-time download |
| 0:35 | Today and the path | Point at the one filled control; no marketing copy |
| 0:50 | A full lesson | One teach card, one recognition, one production or listening card, one miss, the return of the miss, summary |
| 1:30 | Conversation | Streamed reply, Stop, mission strip, and the “local model” status |
| 1:50 | Roleplay or planned lesson | “dinner out, I want pizza” → scene → one reply |
| 2:05 | Reading end to end | Tap words, answer three questions, finish, practice kept words |
| 2:25 | Progress | Accuracy sample, coach read, 7-day strip, path grid; open More details for confusions and memory |
| 2:40 | Settings and data | Language library, translations toggle, accent, backup; no account |
| 2:52 | Offline | Wi-Fi off, lesson continues; only claim model-offline if it actually answered with the network off |
| 3:00 | Engineering proof | Cropped terminal: `node --test tests/` summary and `make audio-check`; no absolute paths |
| 3:08 | Close | MIT, local, no account |

Do not show every exercise type. Show that the mix exists and that the result is
counted honestly.

## 20-second vertical loop

Silent, captioned, no narration:

1. Reading text. Tap `pan`. Caption: “Tap a word. Hear it.”
2. Meaning line appears. Caption: “Keep it.”
3. Practice button. Caption: “Practise the words you touched.”
4. One practice card. Caption: “No account. No cloud. On your machine.”
5. Hold Today or the word line for one second.

Use large type and crop so the word and the practice button are readable at phone
size.

## Narration script (90-second cut)

Read this naturally; it is a guide, not a legal document.

> This is a language course that runs on the machine in front of you. No account,
> no cloud. Watch what the text can do.
>
> Every word the course knows is a handle. Tap it, hear it, keep it. The words you
> touch become a lesson.
>
> One command starts the app and the local model. First run installs the model;
> after that it starts quickly.
>
> Thirteen languages, one learning engine. Today has one action: start the lesson.
>
> New words, recall, listening, production. What you miss comes back before the
> session ends. The summary is built from what actually happened.
>
> The tutor is a model on this machine. Replies stream in, and you can stop one
> mid-sentence. Authored phrases from the course steer the conversation.
>
> Progress counts real recalls, with the sample size beside the accuracy.
> Translations can be switched off. And after setup, the course still works with
> the network off.
>
> hablo. MIT licensed. No account, no analytics, no subscription. The whole
> course, and the tutor, on your machine.

Pause after “the text can do” and after “become a lesson” so the sound and the
practice action land.

## What not to show

- The empty Progress state with `0` words and a bare percentage. It looks like
  invented progress and invites the wrong question.
- A cold model install in real time, unless it is labelled as a time-lapse.
- A fabricated model reply, pre-typed assistant text or edited subtitle that the
  app did not produce.
- Personal data of any kind: names, emails, usernames, machine names, IPs, paths,
  Wi-Fi names, browser profiles, bookmarks, notifications.
- Absolute paths in `make` output. Use a clean terminal and crop, or run the test
  command directly.
- Errors, stack traces or a terminal full of logs.
- Every feature in the repo. A tour is not a demo.
- Coins, streaks or cosmetics as the payoff. They are not the product.
- A “100% accuracy” number without its sample size.
- Speed-ramped model output presented as normal speed.
- Copyrighted music or footage.

## Failure and recovery

| Symptom | Recovery |
|---|---|
| Model not ready | Restart `python3 serve.py`; wait for `local model: ready`; test a reply in Settings before taking |
| Low memory / model stops | Close other apps; restart; use a smaller already-downloaded tier; keep the demo prompt short |
| No speech recognition | Skip the “Say it” card in the cut; do not show a permission prompt |
| No system voice | Turn **Speak replies** off; do not claim spoken replies |
| Word clip not audible in capture | Fix the audio route before recording; do not publish a silent reading segment |
| Reading words not underlined | The text is packed with words outside the deck; choose another text or tap only the authored ones; do not edit the data for the video |
| Offline test breaks the model | Show the offline lesson only; do not claim the model works offline unless it is on screen |
| Wrong state after a retake | Import the saved demo backup; do not edit `localStorage` by hand |
| Personal data appears | Stop, fix the profile, retake. Never blur in post if a clean retake is possible |

## Post-production

- Cut on transitions, not mid-word or mid-answer.
- Keep the cursor movement intentional. Hide the pointer if it obscures the word
  line.
- Add captions. Label “first run, time-lapse” and “Wi-Fi off” on screen.
- Add chapter markers for the 3-minute cut:

```text
0:00 A text that talks back
0:20 One command
0:35 A lesson
1:30 The local tutor
1:50 Roleplay
2:05 Reading becomes practice
2:25 Honest progress
2:40 Local data
2:52 Offline
3:00 Engineering proof
```

- Thumbnail: the reading text with one underlined word, the `pan · bread` line and
  the words “No account. No cloud.” Do not use a fake screenshot.
- File names, kept outside the repository:

```text
hablo-demo-90s-1080p.mp4
hablo-demo-3min-1080p.mp4
hablo-demo-loop-1080x1920.mp4
hablo-demo.en.vtt
hablo-demo-thumb.png
```

- Strip embedded metadata that names a machine or a person before uploading.
- Description: one sentence, the repository link, the MIT licence, the local-model
  note (first run downloads the model), and the chapter list. No testimonials, no
  inflated claims.
- Upload unlisted first; watch it on a phone with sound and captions before making
  it public.
- After upload, add the link to the README or the submission page. Do not link a
  private draft.

## Final checklist

- [ ] Dedicated browser profile, no personal data anywhere in frame.
- [ ] Model installed, warm and verified with **Test reply**.
- [ ] Demo state played honestly; Progress has a real sample and a real miss.
- [ ] Reading text has authored words; audio is captured; practice starts one card.
- [ ] Backup exported outside the repo and import tested.
- [ ] Wi-Fi-off behaviour tested; only claims shown on screen.
- [ ] Microphone and system audio tested and played back.
- [ ] Terminal path cropped or generic; no secrets or absolute paths.
- [ ] 90-second cut under two minutes; 3-minute cut under four.
- [ ] Captions, chapter list, thumbnail and description prepared.
- [ ] Playback on a phone: text legible, audio audible, captions correct.
- [ ] Every claim in the voiceover is visible in the same video.
- [ ] Uploaded, unlisted review passed, then published and linked.

## One-line pitch options

Use one, not all three:

- “A language course that lives on your laptop — including the tutor.”
- “Tap a word in a text. Hear it. Keep it. Practise it.”
- “No account. No cloud. Thirteen languages, and a model that runs locally.”

The first is the product. The second is the moment. The third is the proof.
