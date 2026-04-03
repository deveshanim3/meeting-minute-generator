# 🚀 MeetMind: AI Meeting Minutes Generator - Technical Documentation

This document serves as a comprehensive reference guide for your project viva, detailing the technical implementation, completed features, API routes, and the Generative AI architecture backing the system.

## 1. System Architecture overview
- **Frontend**: Built with Next.js (React), styled with Tailwind CSS, and using React Query for dynamic data fetching.
- **Backend**: Built with Node.js and Express.js framework.
- **Database & Storage**: Powered entirely by Firebase (Firestore for NoSQL data, Storage for file blobs).
- **Authentication**: Firebase Authentication with JWT-based route protection.
- **AI/LLM Provider**: Groq API (yielding lightning-fast LPU inference compatible with the standard OpenAI SDK).

---

## 2. Completed Features (What works today)
- **Audio to Text (ASR)**: Upload `.mp3` or `.wav` files, which are securely parsed and sent to Groq's Whisper API for near-instant transcription.
- **Document Parsing**: Fallback processing to accurately extract text from `.pdf` and `.txt` uploads using `pdfjs-dist`.
- **Generative Summarization**: Converts raw unstructured transcripts into structured markdown minutes featuring Summaries, Discussion Points, and Action Items.
- **User Authentication**: Secure Login/Signup utilizing Firebase.
- **Data Privacy**: All database queries are securely scoped; users can strictly only see, edit, and access their own specific meetings.
- **PDF Export**: Users can easily export the final markdown into a stylized PDF using `jspdf`.
- **Workspace Management**: Users can dynamically "invite" members, assign roles (Viewer/Editor/Admin), and manage their workspace tables.

---

## 3. Generative AI Pipeline (Core Engine)

The AI engine relies on **Groq**, which exposes models using standard OpenAI SDK bindings (`openai.chat.completions` and `openai.audio.transcriptions`).

### A. Transcription (Speech-to-Text)
When an audio file is uploaded, it is intercepted in memory, written temporarily to disk (`os.tmpdir()`), and sent to the LLM.
- **Model Used**: `whisper-large-v3` (via Groq)
- **Function**: Converts messy audio data into highly accurate plain-text paragraphs.

### B. Minutes Generation (Text-to-Text)
The system feeds the raw transcript directly into a Large Language Model to format and comprehend the data.
- **Model Used**: `llama-3.3-70b-versatile` (via Groq)
- **System Prompt Used**:
  > *"You are an expert meeting assistant. Generate comprehensive meeting minutes based on the provided transcript. The minutes should include:
  1. A brief summary of the meeting.
  2. Key discussion points.
  3. Action items with assignees if mentioned.
  4. Decisions made.
  Output the minutes clearly formatted in markdown."*
- **User Prompt Sent**: `Title: [title]\nDate: [date]\nAgenda: [agenda]\nTranscript: [transcript text]`

---

## 4. Backend API Routes

All endpoints reside under the `/api/v1` base path. Every route is protected by a custom `authMiddleware` which intercepts the `Authorization: Bearer <token>` header and verifies it mathematically using Firebase Admin (`admin.auth().verifyIdToken()`). It rejects unauthorized requests and populates `req.uid`.

### A. Meeting APIs (`/api/v1/meetings`)
- `GET /` : **List Meetings**
  - Fetches all documents from the `meetings` Firestore collection where `uid === req.uid`.
  - Ordered by creation date (descending) in Javascript to circumvent composite index constraints.
- `GET /:id` : **Get Single Meeting**
  - Fetches a single meeting document. Blocks access if `doc.data().uid !== req.uid`.
- `POST /` : **Generate Minutes (The Heavy Lifter)**
  - Receives `multipart/form-data` containing the audio/text file, title, and metadata via `multer`.
  - Uploads the physical file to **Firebase Storage**.
  - Routes the file through the **AI Pipeline** (Whisper -> Llama 3).
  - Saves the resulting JSON structure (including the raw transcript and AI-markdown) to **Firestore**.

### B. Workspace APIs (`/api/v1/workspace`)
- `GET /members` : Fetches all invited team members securely bound to the user's `ownerUid`.
- `POST /invite` : Saves a new invited user (with their email and role) into Firestore.
- `PATCH /members/:id` : Updates an existing member's permission role (e.g., Viewer -> Admin).
- `DELETE /members/:id` : Revokes a user's access from the workspace.

### C. User Profiles (`/api/v1/user`)
- `PATCH /profile` : Receives a new Display Name string. Communicates securely with the **Firebase Admin SDK** (`admin.auth().updateUser`) to safely mutate the user's registered name without them needing to re-authenticate or manually handle tokens.

---

## 5. Firebase Implementations

To impress your examiners, highlight how Firebase coordinates the backend seamlessly:
1. **Firebase Authentication (Client)**: The frontend listens to `onAuthStateChanged()`, managing the active JSON Web Token (JWT).
2. **Firebase Admin SDK (Server)**: Bypasses standard CORS limits and safely verifies JWTs using Google Service Account credentials.
3. **Firestore**: The NoSQL engine holding two major collections:
   - `meetings`: Stores timestamps, participants, stringified transcripts, and LLM output. 
   - `workspace_members`: Simple collection binding emails to particular user's dashboards.
4. **Firebase Storage**: Audio files heavily exceed standard document sizes; they are uploaded into scalable Google Cloud buckets and linked back to Firestore via public URLs tracking.

---

## 6. Data Schemas (Firestore)

The NoSQL document structures used by the backend to store information in Firebase are strictly outlined below:

### `meetings` Collection Schema
Represents a recorded and generated meeting minutes session.

```json
{
  "uid": "string",            // The Firebase Auth ID of the user who owns it
  "title": "string",          // Meeting Title
  "date": "string",           // ISO datestring of when the meeting occurred
  "participants": ["string"], // Array of participant names stringified
  "agenda": "string",         // Raw text of the user's uploaded agenda
  "fileUrl": "string",        // Public Google Cloud Storage URL (.mp3, .pdf)
  "fileType": "string",       // Mimetype (e.g., 'audio/mpeg')
  "fileName": "string",       // Original uploaded filename
  "transcript": "string",     // Raw transcribed text dumped from Whisper
  "minutes": "string",        // Formatted Markdown text dumped from Llama-3
  "createdAt": "timestamp"    // Firebase Timestamp object
}
```

### `workspace_members` Collection Schema
Represents a user invited to a particular dashboard workspace.

```json
{
  "ownerUid": "string",       // The Firebase Auth ID of the admin running the workspace
  "name": "string",           // Extracted name (defaults to email prefix)
  "email": "string",          // Contact email of the invited user
  "role": "string",           // Granular permission level ("viewer", "editor", "admin")
  "status": "string",         // Invitation status (e.g., "invited")
  "joinedAt": "timestamp"     // Firebase Timestamp object handling when they were added
}
```
