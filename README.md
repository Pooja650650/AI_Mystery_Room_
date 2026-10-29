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

## Deploy to Render

This repository includes a Render Blueprint (`render.yaml`). It builds the Vite frontend and serves it from the Express server, so the site and `/api` use one origin. MongoDB Atlas stores cases between server restarts. The Render service exits during startup if Atlas is not configured or cannot be reached.

1. Push this project to a GitHub repository. Keep `.env` out of Git; `.gitignore` excludes it. If a secret was ever committed, revoke and replace it before deploying.
2. Create a MongoDB Atlas cluster and a database user. In Render, open the service's **Connect → Outbound** panel and copy its outbound IP ranges; add those ranges to Atlas **Network Access**. Copy the Atlas connection string and replace its username, password, and database name. URL-encode special characters in the password.
3. Create a Gemini API key in Google AI Studio if you want players to generate new mysteries. The sample case works without it.
4. In Render, choose **New → Blueprint**, connect the GitHub repository, and apply the `render.yaml` blueprint. If creating a Web Service manually, use the repository root, build command `npm ci && npm run build`, and start command `npm start`.
5. In the Render service's **Environment** settings, set `MONGODB_URI` to the Atlas connection string and `GEMINI_API_KEY` to the Gemini key. Do not put either value in frontend variables or commit them. Keep `NODE_ENV=production`.
6. Deploy and watch the build logs. Once it is live, open the `onrender.com` URL, try **Explore a sample case**, then generate a case to confirm the Gemini and database settings work. The health endpoint is `/healthz`.
7. Push later code changes to the connected branch; Render will build and deploy them automatically.

The free Render service can sleep when idle, so the first visit after inactivity may take longer. Render plan availability and limits can change; check the current plan details in its dashboard.

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
