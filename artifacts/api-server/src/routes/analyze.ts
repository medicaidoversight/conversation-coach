import { Router, type IRouter } from "express";
import multer from "multer";
import { AnalyzeConversationResponse } from "@workspace/api-zod";
import { analyzeConversation } from "@workspace/conversation-analysis";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/mp4",
      "audio/aac",
      "application/octet-stream",
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload an MP3, WAV, or M4A file."));
    }
  },
});

router.post("/analyze", upload.single("audio"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "Please choose an audio file to continue." });
    return;
  }

  try {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (apiKey) {
      console.log(
        `Processing audio file: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)} MB)`,
      );
    } else {
      console.log("No ASSEMBLYAI_API_KEY found, returning mock data");
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    const analysis = await analyzeConversation(new Uint8Array(req.file.buffer), apiKey);
    res.json(AnalyzeConversationResponse.parse(analysis));
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "We couldn't analyze that file. Please try again." });
  }
});

export default router;
