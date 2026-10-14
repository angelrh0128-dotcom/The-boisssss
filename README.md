# The Boissss — fixed chat starter

This version fixes the chat submission flow and always returns a built-in tutoring response if live AI is not configured or the server cannot be reached. It is mobile-friendly.

## Run on a computer
1. Install Node.js 20+ from https://nodejs.org/
2. Unzip the project.
3. Open Terminal/Command Prompt in the project folder.
4. Run `npm start`.
5. Open `http://localhost:3000`.

Without an API key, the app uses sample responses for algebra, fractions, photosynthesis, parents, and teachers. Other topics receive a general tutoring prompt. This is a demo, not full AI.

## Enable live AI (adult help recommended)
Set `OPENAI_API_KEY` as a server environment variable; do not put it in the HTML or share it publicly.

macOS/Linux:
`export OPENAI_API_KEY="your-key-here" && npm start`

Windows PowerShell:
`$env:OPENAI_API_KEY="your-key-here"; npm start`

Optional: `OPENAI_MODEL` selects a model available to your account. Check current pricing and set spending limits before use.

## Why the earlier phone preview may not have responded
Some iPhone file previews do not run JavaScript like a normal website. This project should be opened in a browser through the local server (or deployed to a secure web host), not only in a file preview pane. The chat uses a built-in fallback so a missing AI key will not leave the message without a reply.

## Before public launch
This is not yet production-ready. Add HTTPS hosting, abuse/rate limiting, cost controls, error monitoring, privacy policy/terms, age-appropriate safety testing, and a plan for child privacy and parental consent where applicable. Do not collect unnecessary personal information. Add secure accounts and payments only after testing. AI can make mistakes, so teachers/parents should review important educational content.
