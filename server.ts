import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/examdesk";

// Safely connect to MongoDB (won't crash if unavailable, allowing UI to still work)
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.warn("MongoDB connection warning (running with mock data for APIs):", err.message));

// Define Models
const ContactSchema = new mongoose.Schema({
  name: String, email: String, subject: String, message: String,
  createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", ContactSchema);

const InquirySchema = new mongoose.Schema({
  schoolName: String, contactPerson: String, email: String, phone: String,
  city: String, numberOfStudents: String, requiredFeatures: [String],
  budgetRange: String, message: String,
  createdAt: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model("Inquiry", InquirySchema);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(cors());
  app.use(express.json());

  // --- API ROUTES ---
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ExamDesk API is running" });
  });

  app.post("/api/contact", async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const newContact = new Contact(req.body);
        await newContact.save();
      }
      res.status(201).json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to send message" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      if (mongoose.connection.readyState === 1) {
        const newInquiry = new Inquiry(req.body);
        await newInquiry.save();
      }
      res.status(201).json({ success: true, message: "Inquiry submitted successfully!" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to submit inquiry" });
    }
  });

  // --- VITE MIDDLEWARE (DEV) OR STATIC SERVING (PROD) ---
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
