# SPEC SHEET — AI MYSTERY ROOM

**Project Type:** AI-Powered Interactive Mystery Investigation Web Application  
**Development Methodology:** Spec-Driven Development (SDD)  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**AI Model:** Google Gemini API  
**Version:** 1.0  
**Status:** Initial Specification

## 1. Project Overview

AI Mystery Room is an AI-powered web application that allows users to create and solve interactive mystery investigations based on a scenario or story provided by the user.

The application uses Google Gemini AI on the backend to transform the user's input into a fictional investigation containing suspects, clues, evidence, and a hidden culprit. The evidence may include fictional WhatsApp-style conversations, AI-generated images, simulated CCTV footage or transcripts, witness statements, and other investigation records.

Users explore the available evidence, analyze the clues, connect information, and select the person they believe is responsible for the mystery.

The system evaluates the user's final answer against the actual solution generated for that investigation and presents the result with an explanation of the decisive clues.

## 2. Problem Statement

Traditional mystery-solving games often provide fixed stories, predefined clues, and limited replayability. Users cannot easily create investigations based on their own ideas or experience new mysteries each time they play.

AI Mystery Room addresses this limitation by allowing users to submit their own scenarios and dynamically generate unique, interactive mystery-solving experiences using AI.

## 3. Project Objectives

- Allow users to create mysteries from their own story or scenario.
- Generate fictional investigations using Gemini AI.
- Create multiple suspects with believable motives, alibis, and relationships.
- Provide different types of digital evidence for investigation.
- Allow users to inspect clues and identify contradictions.
- Enable users to submit a final culprit selection.
- Evaluate answers and reveal the correct solution with reasoning.
- Store investigation data and user progress in MongoDB.
- Provide a responsive, user-friendly interface.

## 4. Target Users

- Mystery and detective game enthusiasts.
- Students interested in logical reasoning and problem-solving.
- Users who enjoy interactive storytelling.
- Content creators who want to generate fictional detective challenges.

## 5. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js | User interface and investigation dashboard |
| Styling | CSS / Tailwind CSS | Responsive and interactive UI |
| Backend | Node.js | Server-side application logic |
| API Framework | Express.js | REST API endpoints |
| Database | MongoDB | Store users, mysteries, evidence, and results |
| AI Integration | Google Gemini API | Generate mystery scenarios and structured evidence |
| Authentication | JWT / secure session approach | User authentication, if required |
| Image Generation | Image-generation service, if available | Generate fictional visual evidence |
| Video Evidence | Simulated CCTV clips or generated video, if supported | Provide visual investigation clues |
| Version Control | Git and GitHub | Source control and collaboration |

**Important implementation note:** Gemini will be responsible for generating the mystery narrative, suspects, clues, and investigation logic. Actual image or video generation may require a separate compatible service. The initial version can use simulated CCTV footage, still images, and transcripts rather than depending on AI-generated video.

## 6. Core Features

### 6.1 Scenario Input

Users can enter a short story, situation, or mystery idea.

**Requirements:**
- Provide a text area for scenario input.
- Validate empty or excessively long input.
- Allow the user to choose difficulty: Easy, Medium, or Hard.
- Allow the user to generate a mystery from the submitted scenario.
- Display a loading state while the investigation is generated.

### 6.2 AI Mystery Generation

The backend sends the user's scenario and generation instructions to Gemini.

The AI generates:
- A mystery title and introduction.
- A fictional incident and timeline.
- Three to five suspects.
- Suspect profiles, motives, and alibis.
- Evidence items and associated clues.
- Red herrings that are misleading but logically explainable.
- One predetermined culprit.
- A consistent final solution explaining how the clues establish responsibility.

**Critical requirement:** The culprit and solution must be established during generation and stored securely on the backend. They must not be regenerated or changed when the user opens evidence or submits an answer.

### 6.3 Digital Evidence Room

The investigation page displays evidence as separate, inspectable items.

Supported evidence categories:

1. **Chat Evidence:** Fictional WhatsApp-style conversations, timestamps, and contact details.
2. **Image Evidence:** AI-generated or simulated photographs, objects, locations, and scene images.
3. **CCTV Evidence:** Simulated camera footage, generated clips where supported, or timestamped transcripts.
4. **Witness Statements:** Accounts provided by fictional witnesses.
5. **Timeline Evidence:** Events organized by time.
6. **Document Evidence:** Fictional reports, notes, receipts, and records.

Each evidence item should have a title, type, description, content, and relevance to the investigation.

All fictional messages, people, images, and records must be clearly presented as generated game content rather than real evidence.

### 6.4 Suspect Profiles

Each suspect profile includes:
- Name and fictional profile image, if available.
- Relationship to the incident.
- Possible motive.
- Stated alibi.
- Relevant background information.

The correct culprit must not be revealed before the user submits a final answer.

### 6.5 Culprit Selection

Users review the suspects and select one person as the culprit.

**Requirements:**
- Display the available suspects.
- Allow one final selection per investigation attempt.
- Ask for confirmation before submitting the answer.
- Store the selected suspect and submission time.
- Compare the answer with the server-stored culprit ID.
- Prevent changes to the answer after submission, unless replay or retry functionality is explicitly enabled.

### 6.6 Result and Explanation

After submission, the application displays:
- Whether the answer is correct or incorrect.
- The actual culprit.
- The decisive evidence.
- An explanation of contradictions and relevant clues.
- A summary of how the investigation was solved.

### 6.7 Investigation History

Users can view their previously completed investigations, including:
- Mystery title.
- Difficulty.
- Creation date.
- Selected culprit.
- Final result.

This feature requires persistent storage and may be restricted to authenticated users.

## 7. User Flow

1. User opens the AI Mystery Room website.
2. User enters a scenario or story.
3. User selects a difficulty level.
4. User submits the scenario.
5. The backend requests a structured mystery from Gemini.
6. The backend validates the generated mystery and stores it in MongoDB.
7. The frontend displays the investigation room.
8. User explores suspects and evidence.
9. User analyzes the clues and selects a culprit.
10. The backend evaluates the submitted answer.
11. The frontend displays the result and solution.
12. The investigation is added to the user's history, if enabled.

## 8. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The system shall accept a user-provided mystery scenario. | Must Have |
| FR-02 | The system shall generate a structured investigation using Gemini. | Must Have |
| FR-03 | The system shall generate multiple suspects and exactly one intended culprit. | Must Have |
| FR-04 | The system shall generate multiple types of fictional evidence. | Must Have |
| FR-05 | The system shall maintain consistency across the story, timeline, suspects, and clues. | Must Have |
| FR-06 | The system shall store the investigation and its solution in MongoDB. | Must Have |
| FR-07 | The system shall hide the correct answer until submission. | Must Have |
| FR-08 | The system shall evaluate the user's selected culprit on the backend. | Must Have |
| FR-09 | The system shall reveal the solution and reasoning after submission. | Must Have |
| FR-10 | The system shall provide difficulty selection. | Should Have |
| FR-11 | The system shall maintain investigation history for authenticated users. | Should Have |
| FR-12 | The system shall support AI-generated images and video evidence where available. | Could Have |

## 9. Non-Functional Requirements

- **Performance:** Display progress feedback during AI generation and avoid unnecessary repeated API calls.
- **Security:** Keep Gemini API keys and answer-validation logic on the backend.
- **Reliability:** Validate AI-generated output before making an investigation playable.
- **Consistency:** Ensure clues, timestamps, suspect statements, and the final solution do not contradict one another unintentionally.
- **Usability:** Provide clear navigation, readable evidence, and a simple investigation interface.
- **Responsiveness:** Support desktop, tablet, and mobile screens.
- **Scalability:** Structure the backend so additional evidence types and AI providers can be added later.
- **Privacy:** Collect only necessary user information and protect stored investigation data.

## 10. Proposed System Architecture

<box border radius="lg" padding={3} gap={2} align="center">
  <box background="surface-secondary" radius="md" padding={3} width="100%" align="center">
    **React.js Frontend**

    <text color="secondary" size="sm" textAlign="center">Scenario Input · Suspect Profiles · Evidence Room · Answer Submission</text>
  </box>
  <icon name="arrow-down" size="xl" color="secondary"/>
  <box background="surface" border radius="md" padding={3} width="100%" align="center">
    **Node.js + Express.js Backend**

    <text color="secondary" size="sm" textAlign="center">REST APIs · Validation · Authentication · AI Orchestration · Answer Checking</text>
  </box>
  <row gap={3} align="center" justify="center">
    <icon name="arrow-down" size="xl" color="secondary"/>
    <icon name="arrow-down" size="xl" color="secondary"/>
  </row>
  <grid columns={2} gap={2}>
    <grid-item>
      <box background="surface-secondary" radius="md" padding={3} height="100%">
        <icon name="brain-circuit" size="xl"/>
        **Gemini API**
        <text size="sm" color="secondary">Mystery generation and structured output</text>
      </box>
    </grid-item>
    <grid-item>
      <box background="surface-secondary" radius="md" padding={3} height="100%">
        <icon name="database" size="xl"/>
        **MongoDB**
        <text size="sm" color="secondary">Mysteries, evidence, users, and results</text>
      </box>
    </grid-item>
  </grid>
  <text color="secondary" size="xs" textAlign="center">Optional media-generation services can be integrated through the backend.</text>
</box>

### Backend Processing

1. Receive and validate the scenario.
2. Construct the Gemini prompt with output requirements.
3. Request structured JSON output.
4. Validate the response against the mystery schema.
5. Check suspect IDs, evidence references, and the solution.
6. Store the complete mystery, including the private answer key, in MongoDB.
7. Return only public investigation data to the frontend.
8. Evaluate the submitted culprit using the stored answer key.

## 11. Proposed Database Design

### Mystery Collection

```json
{
  "_id": "mystery_id",
  "userId": "user_id",
  "title": "The Missing Diamond",
  "scenario": "A diamond disappears during a private event.",
  "difficulty": "medium",
  "suspects": [],
  "evidence": [],
  "timeline": [],
  "solution": {
    "culpritId": "suspect_02",
    "reasoning": "Private explanation of the solution",
    "decisiveEvidenceIds": ["evidence_03", "evidence_05"]
  },
  "status": "active",
  "createdAt": "timestamp"
}
```

### Submission Collection

```json
{
  "_id": "submission_id",
  "userId": "user_id",
  "mysteryId": "mystery_id",
  "selectedCulpritId": "suspect_02",
  "isCorrect": true,
  "submittedAt": "timestamp"
}
```

These are conceptual schemas; the final implementation should define appropriate Mongoose models, validation rules, references, and indexes.

**Security rule:** The `solution` object is private server-side data. It must never be included in the public mystery response before the user submits an answer. A separate public DTO (data transfer object) should be used to return safe fields to React.

## 12. API Specification

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/mysteries/generate` | Generate a mystery from the scenario |
| GET | `/api/mysteries/:id` | Retrieve public mystery details |
| GET | `/api/mysteries/:id/evidence` | Retrieve evidence for investigation |
| POST | `/api/mysteries/:id/submit` | Submit the final culprit selection |
| GET | `/api/mysteries/:id/result` | Retrieve the solution after submission |
| GET | `/api/mysteries/history` | Retrieve the user's mystery history |

All endpoints should validate inputs and enforce authorization where applicable. Result endpoints must verify that the user has submitted an answer or otherwise has permission to view the solution.

## 13. Gemini AI Prompt Requirements

The backend prompt must instruct Gemini to:

- Generate a fictional, solvable investigation from the submitted scenario.
- Create three to five suspects with unique IDs.
- Assign exactly one intended culprit.
- Generate at least five evidence items with unique IDs.
- Ensure that the decisive clues support the actual culprit.
- Include believable alternative explanations and red herrings.
- Maintain consistent names, timestamps, locations, and relationships.
- Include a private solution with reasoning and references to decisive evidence.
- Return structured JSON that follows the application's schema.
- Avoid exposing the solution in the public story or evidence descriptions.

The application should reject or repair invalid AI responses before publishing them. AI-generated content should be treated as untrusted input and validated server-side.

## 14. User Interface Pages

1. **Home Page:** Project introduction, start button, and featured mysteries.
2. **Create Mystery Page:** Scenario text area, difficulty selector, and generation button.
3. **Investigation Room:** Story introduction, suspect list, evidence tabs, and investigation timeline.
4. **Evidence Detail View:** Expanded messages, images, transcripts, or documents.
5. **Culprit Selection Page:** Final suspect selection and confirmation.
6. **Results Page:** Answer status, actual culprit, decisive clues, and explanation.
7. **History Page:** Previously played investigations and results.
8. **Authentication Pages:** Login and registration, if authentication is included.

## 15. Acceptance Criteria

The initial release will be considered complete when:

- [ ] A user can submit a valid scenario.
- [ ] Gemini generates a mystery with three to five suspects.
- [ ] Every playable mystery has exactly one intended culprit.
- [ ] Evidence references valid suspects and supports a coherent solution.
- [ ] The investigation can be stored and retrieved from MongoDB.
- [ ] The user can inspect the available evidence.
- [ ] The correct culprit remains hidden before submission.
- [ ] The backend correctly evaluates the selected suspect.
- [ ] The user receives a meaningful explanation after submission.
- [ ] Invalid AI output and API failures are handled gracefully.
- [ ] API keys and private solution data are not exposed to the browser.
- [ ] The core investigation flow works on desktop and mobile.

## 16. Scope and Development Phases

**Phase 1 — MVP (Minimum Viable Product)**

- Scenario input and difficulty selection.
- Gemini-based story and mystery generation.
- Three to five suspects.
- Text-based evidence, chat logs, timelines, and witness statements.
- Culprit selection and result explanation.
- MongoDB persistence.
- Basic responsive interface.

**Phase 2 — Enhanced Investigation**

- AI-generated images.
- Interactive CCTV-style evidence.
- Evidence filtering and bookmarking.
- Investigation history and scoring.
- User authentication and replay functionality.

**Phase 3 — Advanced Features**

- Actual AI-generated video where supported.
- Multiple mystery genres.
- Timed investigations and difficulty-based scoring.
- Leaderboards and challenge sharing.
- Improved consistency validation and automated mystery quality checks.

## 17. Risks and Mitigation

| Risk | Mitigation |
|---|---|
| Gemini generates inconsistent clues | Validate timelines, IDs, and solution consistency before publishing. |
| Gemini returns invalid JSON | Use structured output where supported, schema validation, and bounded retries. |
| AI API costs become high | Apply request limits, control output size, and cache completed mysteries. |
| Users discover the culprit early | Separate public and private data and validate answers on the backend. |
| Image/video generation is unavailable | Start with simulated evidence and integrate compatible media services later. |
| Generated mystery has no logical solution | Require decisive evidence and validate that the solution follows from the clues. |
| Malicious scenario input | Apply input limits, prompt-injection defenses, output validation, and rate limiting. |

## 18. Success Metrics

- Mystery generation success rate.
- Percentage of generated mysteries passing validation.
- Average mystery generation time.
- Percentage of users who complete an investigation.
- User answer accuracy.
- User feedback on mystery quality and difficulty.
- Cost per successfully generated mystery.

## 19. Final Project Definition

AI Mystery Room is a MERN-based interactive detective platform powered by Google Gemini. It converts user-provided scenarios into fictional investigations with suspects, digital evidence, logical clues, and a hidden culprit. Users analyze the evidence, submit their accusation, and receive an explanation of the solution.

The first release prioritizes **consistent mystery generation, secure answer validation, and an enjoyable investigation experience**. AI-generated images and videos are extensions of the core system rather than prerequisites for the MVP.
