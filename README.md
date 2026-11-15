# Hablo
Track: Language + AI.
The team: Lev Dudin, Aleksandr Loginov, Ian Akopian

## The problem

People who need a language for real situations (a dinner out, a pharmacy, a cousin's wedding) are usually taught from long translated word lists, and forget most of it. Many learners also can't or won't use apps that need an account, a server or a paid AI model. Hablo teaches through short daily lessons built around situations, works fully offline, and keeps all progress on the learner's own device.

## What we built
Hablo is a language app in the browser with 13 languages. No account, and everything stays on your computer. You get short lessons (1–2 minutes) with new words and reviews of old ones, in many types of tasks. You can also write a situation, like "dinner out, I want pizza", and get a lesson for it. There is also a chat partner and short texts to read.

## How it works
4 big courses (about 140 phrases each), 9 small ones (about 40–50 phrases), and 24 dialogues for the chat. Every item has a level from A1 to C1. 1,706 sound files.

Model: by default the chat uses a small AI on your computer (Qwen2.5-0.5B). Without it, the app uses a simple chat partner we wrote ourselves: it finds the best sentence from the course and follows our dialogues. Lessons show each word again just before you forget it.

## Results
In numbers:
- 13 languages
- 13 courses (about 965 phrases) plus 24 dialogues
- 1,706 sound files
- 0 accounts, 0 servers, 0 paid AI calls — it works offline end to end

During the hackathon we tested the full loop: writing a situation, getting a generated lesson, learning it, and chatting about it. The small local model answers fast enough for a conversation and the fallback chat partner still works when the model isn't loaded.

## What we'd do next

- More situations and courses. Right now a lesson comes from the situation you typed; we want the app to build longer practice series around the same situation automatically.
- Better speech output and input: pronunciation practice where you speak and the app checks you, all still on-device.
- Progress you can move: export your streak, stats and course progress as a file, so switching devices loses nothing.
- A "pack" system: download just the language and level you need, so the offline app stays light.
- More local models, so the chat sounds more natural without ever leaving your computer.

## Sources
DeepSeek (via DeepSeek Harness), Claude (via Claude Code), and Gemini (via Gemini CLI).
