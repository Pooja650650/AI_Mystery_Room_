# The Mystery Room

An interactive detective game built from the MVP in `spec.md`. Players turn a premise into a fictional investigation, inspect suspects and evidence, and submit one final accusation to receive the server-held solution.

## Stack

- React 19 and Vite for the responsive investigation interface
- Express 5 and Node.js for the REST API
- MongoDB with Mongoose for persistent cases
- Google Gemini for structured mystery generation

## Run locally

1. Install Node.js 20 or newer and MongoDB (local or hosted).
2. Copy `.env.example` to `.env` and set `MONGODB_URI` and `GEMINI_API_KEY`.
3. Install packages with `npm install`.
4. Start both the Vite frontend and Express API with `npm run dev`.
5. Open the local Vite URL printed in the terminal.

`npm run build` creates the production frontend in `dist/`. Set `GEMINI_API_KEY` on the server only; it is never sent to the browser. If MongoDB is not configured, the API uses in-memory storage for local development. That storage is temporary and is cleared when the server stops. Without a Gemini key, the sample case remains playable, but generating a new AI case returns a setup message.

## MVP included

- Scenario text input, character limits, difficulty selection, and generation loading/error states
- A sample case with four suspects, six inspectable evidence items, and a timeline
- Evidence filters, expanded evidence detail, suspect profiles, and a final-answer confirmation step
- Gemini JSON generation with server-side schema and cross-reference validation
- MongoDB persistence when configured, with an in-memory development fallback
- Server-side answer checking; the public case response omits the solution
- A result endpoint that refuses access before an accusation and an API rule preventing repeat submissions
- Case history scoped to a browser session and responsive desktop/mobile layouts

## API

All routes use the `x-session-id` header generated and stored in the current browser. This lightweight MVP scopes cases to a client session; it is not user account authentication.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/mysteries/generate` | Validate a premise, generate a case, validate it, save it, and return public fields |
| `GET` | `/api/mysteries/:id` | Retrieve public case details |
| `GET` | `/api/mysteries/:id/evidence` | Retrieve evidence and timeline |
| `POST` | `/api/mysteries/:id/submit` | Submit one suspect accusation and receive the result |
| `GET` | `/api/mysteries/:id/result` | Retrieve the solution after submission |
| `GET` | `/api/mysteries/history` | List cases belonging to the current session |

## Deliberate MVP boundaries

Authentication, image/video generation, replay, scoring, and multi-device history are later-phase items in the specification. Image and CCTV evidence in generated cases are text descriptions/transcripts; every investigation is labeled fictional. Sessions are anonymous and should not be treated as a strong identity or access-control mechanism for a public deployment.
