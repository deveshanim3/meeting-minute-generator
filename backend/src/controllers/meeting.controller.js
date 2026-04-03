const fs = require("fs");
const path = require("path");
const os = require("os");
const { OpenAI } = require("openai");
const { db, bucket } = require("../config/firebase");
const { env } = require("../config/env");

/**
 * Extract text from a PDF buffer using pdfjs-dist (Mozilla's PDF library).
 */
async function extractPdfText(buffer) {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const uint8 = new Uint8Array(buffer);
  const doc = await pdfjsLib.getDocument({ data: uint8 }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n");
}

// Groq provides an OpenAI-compatible API so we can use the same SDK
const openai = new OpenAI({
  apiKey: env.groqApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

exports.generateMinutes = async (req, res, next) => {
  try {
    const { title, date, participants, agenda } = req.body;
    const file = req.file; // multer file

    if (!title || !date || !file) {
      return res.status(400).json({ success: false, message: "Missing required fields (title, date, file)" });
    }

    if (!env.groqApiKey) {
      return res.status(500).json({ success: false, message: "Server configuration missing Groq API Key" });
    }

    if (!db || !bucket) {
      return res.status(500).json({ success: false, message: "Server configuration missing Firebase" });
    }

    // ── 1. Upload the file to Firebase Storage via Admin SDK (no CORS issues) ──
    const destFileName = `uploads/${Date.now()}_${file.originalname}`;
    const fileRef = bucket.file(destFileName);

    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    // Make the file publicly readable so we can get a download URL
    await fileRef.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${destFileName}`;

    console.log("File uploaded to Firebase Storage:", fileUrl);

    // ── 2. Get transcript ──
    let transcript = "";
    const fileType = file.mimetype;
    const fileName = file.originalname;

    if (fileType && fileType.startsWith("audio/")) {
      // Write to temp file for Whisper API
      const tempFilePath = path.join(os.tmpdir(), fileName);
      fs.writeFileSync(tempFilePath, file.buffer);

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-large-v3",
      });

      transcript = transcription.text;
      fs.unlinkSync(tempFilePath);
    } else if (fileType === "text/plain") {
      transcript = file.buffer.toString("utf-8");
    } else if (fileType === "application/pdf") {
      transcript = await extractPdfText(file.buffer);
    } else {
      return res.status(400).json({
        success: false,
        message: `Unsupported file type: ${fileType}. Please upload an audio (.mp3, .wav), text (.txt), or PDF (.pdf) file.`,
      });
    }

    // ── 3. Generate minutes via Groq LLM ──
    const parsedParticipants = typeof participants === "string" ? JSON.parse(participants) : participants;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert meeting assistant. Generate comprehensive meeting minutes based on the provided transcript. The minutes should include:\n1. A brief summary of the meeting.\n2. Key discussion points.\n3. Action items with assignees if mentioned.\n4. Decisions made.\nOutput the minutes clearly formatted in markdown.",
        },
        {
          role: "user",
          content: `Meeting Title: ${title}\nDate: ${date}\nParticipants: ${parsedParticipants?.join(", ") || "N/A"}\n${agenda ? `Agenda: ${agenda}\n` : ""}\nTranscript:\n${transcript}`,
        },
      ],
    });

    const generatedMinutes = completion.choices[0].message.content;

    // ── 4. Save to Firestore ──
    const meetingData = {
      uid: req.uid,
      title,
      date,
      participants: parsedParticipants || [],
      agenda: agenda || "",
      fileUrl,
      fileType,
      fileName,
      transcript,
      minutes: generatedMinutes,
      createdAt: new Date(),
    };

    const docRef = await db.collection("meetings").add(meetingData);

    return res.status(201).json({
      success: true,
      message: "Minutes generated successfully",
      meetingId: docRef.id,
      meeting: { id: docRef.id, ...meetingData },
    });
  } catch (error) {
    console.error("Error generating minutes:", error);
    next(error);
  }
};

/**
 * GET /api/v1/meetings — list all meetings from Firestore
 */
exports.listMeetings = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: "Firebase not configured" });
    }

    const snapshot = await db.collection("meetings")
      .where("uid", "==", req.uid)
      .get();
    const meetings = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        const aTime = a.createdAt?._seconds || 0;
        const bTime = b.createdAt?._seconds || 0;
        return bTime - aTime;
      });

    return res.json({ success: true, meetings });
  } catch (error) {
    console.error("Error listing meetings:", error);
    next(error);
  }
};

/**
 * GET /api/v1/meetings/:id — get a single meeting from Firestore
 */
exports.getMeeting = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: "Firebase not configured" });
    }

    const doc = await db.collection("meetings").doc(req.params.id).get();

    if (!doc.exists || doc.data().uid !== req.uid) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    return res.json({ success: true, meeting: { id: doc.id, ...doc.data() } });
  } catch (error) {
    console.error("Error getting meeting:", error);
    next(error);
  }
};
