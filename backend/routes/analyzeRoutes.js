import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

let ai;
try {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("GoogleGenAI init failed. Missing API key?");
}

const promptText = `
You are a board-certified clinical AI assistant with expertise in internal medicine, pathology, and radiology. 
Analyze the provided medical report (blood test, metabolic panel, lipid panel, CBC, X-ray, MRI, CT scan, urinalysis, etc.) with the precision of a senior physician.

Strictly return ONLY a valid JSON object matching this schema with no markdown formatting, no code fences, no extra text:
{
  "type": "string (exact report type e.g. 'Complete Blood Count (CBC)', 'Lipid Panel', 'Chest X-Ray Report')",
  "reportDate": "string (date of the report if visible, else 'Not specified')",
  "overallRisk": "string ('Low', 'Moderate', 'High', or 'Critical') based on aggregate findings",
  "riskReason": "string (one sentence justifying the overall risk level)",
  "summary": "string (3-4 clear, jargon-free sentences summarizing findings, what's normal, what's abnormal, and clinical significance)",
  "urgency": "string ('Routine follow-up', 'Schedule appointment within 2 weeks', 'See a doctor within 48 hours', or 'Seek emergency care immediately')",
  "findings": [
    {
      "name": "string (biomarker or finding name)",
      "value": "string (exact value with units, e.g., '145 mg/dL')",
      "referenceRange": "string (normal reference range e.g., '<200 mg/dL')",
      "status": "string (MUST be exactly one of: 'normal', 'high', 'low', 'critical-high', 'critical-low', 'abnormal')",
      "meaning": "string (plain-English 2-sentence explanation of what this value means clinically)",
      "actionNeeded": "boolean (true if this finding alone warrants medical attention)"
    }
  ],
  "possibleConditions": [
    {
      "name": "string (possible condition suggested by findings)",
      "likelihood": "string ('Possible', 'Probable', or 'Likely')",
      "basedOn": "string (which specific findings suggest this)"
    }
  ],
  "nextSteps": ["string (specific, actionable next step 1)", "string (next step 2)", "string (next step 3)"],
  "medicationsToDiscuss": ["string (medication class or specific drug a doctor may consider based on findings — NOT a prescription, just informational)"],
  "nutritionPlan": [
    {
      "nutrient": "string (e.g., 'Omega-3 Fatty Acids', 'Iron', 'Vitamin D')",
      "reason": "string (specific finding that drives this recommendation)",
      "foods": "string (4-5 specific foods with quantities or serving sizes)",
      "action": "string (one clear, measurable daily/weekly action)"
    }
  ],
  "lifestyleRecommendations": ["string (specific lifestyle change 1)", "string (lifestyle change 2)", "string (lifestyle change 3)"]
}

CRITICAL RULES:
- Extract ALL biomarkers/findings present in the report, not just the abnormal ones
- Reference ranges must reflect standard clinical lab ranges for adults
- possibleConditions should only be included if there are genuinely abnormal findings — do NOT speculate on normal reports
- nutritionPlan items must directly correspond to specific findings (high cholesterol → Omega-3, low iron → Iron-rich foods, etc.)
- Output ONLY valid JSON. No explanatory text before or after. No markdown fences.
`;

router.post('/', upload.single('report'), async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || !ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing in backend/.env" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const mimeType = req.file.mimetype;
    const base64Data = req.file.buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        promptText,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]
    });

    const rawText = response.text;
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultData = JSON.parse(cleanJson);

    res.json(resultData);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze report" });
  }
});

export default router;
