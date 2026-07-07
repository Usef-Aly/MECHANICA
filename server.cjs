var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var geminiClient = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return geminiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/explain", async (req, res) => {
    try {
      const { topic, lang = "en" } = req.body;
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic string is required." });
      }
      console.log(`Generating interactive explanation model for user topic: "${topic}" (language: ${lang})`);
      const ai = getGeminiClient();
      if (!ai) {
        console.warn("No GEMINI_API_KEY provided in environment. Serving an intelligent static mockup...");
        return res.json(createFallbackModel(topic, lang));
      }
      let languageInstructions = "";
      if (lang === "ar") {
        languageInstructions = "\nCRITICAL: Since the requested language is Arabic ('ar'), you MUST write ALL string fields in Arabic (including title, category, summary, node labels, node descriptions, connection labels, parameter labels, parameter descriptions, visualizer descriptions, step titles, step descriptions, application text, questions, and answers). Use pristine classic standard Arabic phrasing suitable for high-grade technical and engineering educational resources.";
      }
      const prompt = `You are a world-class structural and physics systems teacher.
Deconstruct the target concept: "${topic}" into an exceptionally informative, interactive, visual, node-based schematic model.

Instructions:
1. Provide a beautiful title, general categorizer, and short inspiring summary.
2. Design 4 to 5 unique components (nodes) that make up this system. Make sure each node has coordinate layouts:
   - "x" from 10 to 90 (layout along a structural or causal line: input on left, process in middle, outputs on right)
   - "y" from 15 to 80 (separated clearly so nodes do not overlap!)
3. Design connections between these nodes defining logical system flows.
4. Set up 2 interactive parameter controls (such as speed, focus size, wave frequency, or force strain) to build an interactive physics simulator. Assign one of these simulator types to 'visualTypeHint': ("wave" | "transfer" | "flow" | "lever" | "rotational" | "gauge").
5. Write 4 sequential steps explaining how the technology actually works, highlighting which node IDs are active in each step.
6. Provide real world applications.
7. Provide 2 brilliant deep interest questions with mind-expanding, intuitive answers.
8. Provide deep academic lecture notes inside the "theory" block. This MUST be a fully fleshed out academic deconstruction. It must contain fields: titleEn, titleAr, thesisEn, thesisAr, mathEn, mathAr, historyEn, historyAr, challengeEn, challengeAr.
Write the En fields in English and Ar fields in Arabic. Ensure the depth is highly professional and educational.
${languageInstructions}

Be incredibly precise, creative, and clear. Avoid robotic boilerplate. Return the schema strictly matching the required JSON format.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              title: { type: import_genai.Type.STRING, description: "Title of the topic (e.g. 'How noise-canceling headphones work')" },
              category: { type: import_genai.Type.STRING, description: "System category (e.g. 'Audio Physics & Hardware')" },
              summary: { type: import_genai.Type.STRING, description: "Inspiring 2-sentence summary explaining the magic of the mechanism" },
              iconName: { type: import_genai.Type.STRING, description: "Short Lucide React icon name that best matches (e.g. 'Cpu', 'Waves', 'Activity', 'Shield', 'Gauge')" },
              nodes: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    id: { type: import_genai.Type.STRING, description: "Short lowercase ID (e.g. 'mic', 'inverter', 'driver')" },
                    label: { type: import_genai.Type.STRING, description: "Elegant human label (e.g. 'Ambient Microphone')" },
                    description: { type: import_genai.Type.STRING, description: "Brief intuitive explanation of what it does" },
                    x: { type: import_genai.Type.INTEGER, description: "Pragmatic X coordinate percentage from 10 to 90" },
                    y: { type: import_genai.Type.INTEGER, description: "Pragmatic Y coordinate percentage from 15 to 80" },
                    type: { type: import_genai.Type.STRING, description: "Component type: 'input' | 'process' | 'output' | 'control' | 'storage'" },
                    statusLabel: { type: import_genai.Type.STRING, description: "Dynamic status description (e.g., 'Capturing ambient pressure waves')" }
                  },
                  required: ["id", "label", "description", "x", "y", "type"]
                }
              },
              connections: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    fromId: { type: import_genai.Type.STRING, description: "Source node ID" },
                    toId: { type: import_genai.Type.STRING, description: "Destination node ID" },
                    label: { type: import_genai.Type.STRING, description: "Short description of what flows (e.g., 'Analogue Audio Voltage')" },
                    flowDirection: { type: import_genai.Type.STRING, description: "'forward' or 'none'" },
                    flowSpeedMultiplier: { type: import_genai.Type.NUMBER, description: "Speed of flow simulation particles (e.g., 1.0)" }
                  },
                  required: ["fromId", "toId"]
                }
              },
              simulation: {
                type: import_genai.Type.OBJECT,
                properties: {
                  params: {
                    type: import_genai.Type.ARRAY,
                    items: {
                      type: import_genai.Type.OBJECT,
                      properties: {
                        id: { type: import_genai.Type.STRING, description: "Param identifier (e.g., 'ambientdb')" },
                        label: { type: import_genai.Type.STRING, description: "Human friendly slider label" },
                        min: { type: import_genai.Type.NUMBER, description: "Minimum numerical value" },
                        max: { type: import_genai.Type.NUMBER, description: "Maximum numerical value" },
                        step: { type: import_genai.Type.NUMBER, description: "Adjustment step interval" },
                        defaultValue: { type: import_genai.Type.NUMBER, description: "Default active value" },
                        unit: { type: import_genai.Type.STRING, description: "Metric units symbol (e.g., 'dB', 'Hz')" },
                        description: { type: import_genai.Type.STRING, description: "Brief description of physics governed" }
                      },
                      required: ["id", "label", "min", "max", "step", "defaultValue", "unit", "description"]
                    }
                  },
                  visualTypeHint: { type: import_genai.Type.STRING, description: "Simulation visual paradigm choice: 'wave' | 'transfer' | 'flow' | 'lever' | 'rotational' | 'gauge'" },
                  description: { type: import_genai.Type.STRING, description: "Explanation of what the simulation illustrates" }
                },
                required: ["params", "visualTypeHint"]
              },
              steps: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    title: { type: import_genai.Type.STRING },
                    description: { type: import_genai.Type.STRING },
                    highlightNodes: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING } }
                  },
                  required: ["title", "description"]
                }
              },
              realWorldApplications: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              },
              theory: {
                type: import_genai.Type.OBJECT,
                properties: {
                  titleEn: { type: import_genai.Type.STRING },
                  titleAr: { type: import_genai.Type.STRING },
                  thesisEn: { type: import_genai.Type.STRING },
                  thesisAr: { type: import_genai.Type.STRING },
                  mathEn: { type: import_genai.Type.STRING },
                  mathAr: { type: import_genai.Type.STRING },
                  historyEn: { type: import_genai.Type.STRING },
                  historyAr: { type: import_genai.Type.STRING },
                  challengeEn: { type: import_genai.Type.STRING },
                  challengeAr: { type: import_genai.Type.STRING }
                },
                required: [
                  "titleEn",
                  "titleAr",
                  "thesisEn",
                  "thesisAr",
                  "mathEn",
                  "mathAr",
                  "historyEn",
                  "historyAr",
                  "challengeEn",
                  "challengeAr"
                ]
              },
              qAndA: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    question: { type: import_genai.Type.STRING },
                    answer: { type: import_genai.Type.STRING }
                  },
                  required: ["question", "answer"]
                }
              }
            },
            required: ["title", "category", "summary", "iconName", "nodes", "connections", "simulation", "steps", "realWorldApplications", "theory", "qAndA"]
          }
        }
      });
      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (error) {
      console.error("Gemini explanation generation failed:", error);
      res.status(500).json({
        error: "Failed to generate dynamic visual schematic.",
        message: error.message || error.toString()
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mechanica node network online at port ${PORT}`);
  });
}
function createFallbackModel(topicName, lang = "en") {
  const formattedTitle = topicName.replace(/[?]/g, "").trim();
  const cleanTitle = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
  if (lang === "ar") {
    return {
      title: `\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 ${cleanTitle}`,
      category: "\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u0627 \u0648\u0647\u0646\u062F\u0633\u0629 \u0627\u0644\u0623\u0646\u0638\u0645\u0629",
      summary: `\u0627\u0633\u062A\u0643\u0634\u0627\u0641 \u0644\u0644\u0622\u0644\u064A\u0627\u062A \u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0626\u064A\u0629 \u0648\u0645\u0639\u0627\u064A\u064A\u0631 \u0627\u0644\u062A\u0648\u0627\u0632\u0646 \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0641\u0639\u0644\u064A \u0644\u0644\u0646\u0645\u0630\u062C\u0629 \u0627\u0644\u062D\u0631\u0643\u064A\u0629 \u0648\u0631\u0627\u0621 ${cleanTitle}.`,
      iconName: "ShieldAlert",
      nodes: [
        { id: "inputUnit", label: "\u0645\u062F\u062E\u0644 \u0627\u0644\u0646\u0628\u0636\u0627\u062A \u0627\u0644\u0631\u0626\u064A\u0633\u064A", description: "\u064A\u063A\u0630\u064A \u0648\u064A\u0648\u062C\u0647 \u0637\u0627\u0642\u0629 \u0627\u0644\u062C\u0633\u064A\u0645\u0627\u062A \u0623\u0648 \u062D\u0631\u0643\u0627\u062A \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u0627 \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 \u062F\u0627\u062E\u0644 \u062D\u062F\u0648\u062F \u0627\u0644\u0646\u0638\u0627\u0645.", x: 20, y: 30, type: "input", statusLabel: "\u0627\u0644\u062A\u0642\u0627\u0637 \u0648\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u062D\u0631\u0643\u064A" },
        { id: "modifierUnit", label: "\u0645\u0639\u0627\u0644\u062C \u0627\u0644\u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0645\u0631\u0643\u0632\u064A", description: "\u064A\u0637\u0628\u0642 \u0627\u0644\u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0626\u064A\u0629\u060C \u0648\u062E\u0633\u0627\u0626\u0631 \u0627\u0644\u0627\u062D\u062A\u0643\u0627\u0643\u060C \u0648\u0627\u0644\u062A\u062D\u0648\u0644\u0627\u062A \u0627\u0644\u062D\u0631\u0643\u064A\u0629 \u0644\u0644\u0645\u062A\u063A\u064A\u0631\u0627\u062A.", x: 50, y: 50, type: "process", statusLabel: "\u0627\u0644\u0645\u0648\u0627\u0632\u0646\u0629 \u0627\u0644\u0647\u064A\u062F\u0631\u0648\u0644\u064A\u0643\u064A\u0629 \u0646\u0634\u0637\u0629" },
        { id: "pistonForce", label: "\u0635\u0645\u0627\u0645 \u0631\u0635\u062F \u0627\u0644\u0627\u062E\u062A\u0644\u0627\u0644", description: "\u064A\u0646\u0638\u0645 \u0648\u064A\u062E\u0646\u0642 \u0645\u0639\u062F\u0644\u0627\u062A \u0627\u0644\u062A\u062F\u0641\u0642 \u0648\u0627\u0644\u0636\u063A\u0637 \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0641\u0639\u0644\u064A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0648\u0627\u062C\u0647\u0629 \u0627\u0644\u0645\u062D\u0627\u0643\u064A \u0627\u0644\u0634\u0627\u0645\u0644\u0629.", x: 50, y: 20, type: "control", statusLabel: "\u0645\u062E\u0641\u0641 \u0627\u0647\u062A\u0632\u0627\u0632 \u0648\u0628\u0648\u0627\u0628\u0629 \u062A\u062B\u0628\u064A\u0637" },
        { id: "outputForce", label: "\u0645\u062E\u0631\u062C \u0627\u0644\u062D\u0631\u0643\u0629 \u0627\u0644\u0646\u0647\u0627\u0626\u064A", description: "\u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0627\u0644\u0646\u0647\u0627\u0626\u064A\u0629 \u0644\u0644\u0645\u0646\u0638\u0648\u0645\u0629\u060C \u0648\u064A\u062A\u0631\u062C\u0645 \u0641\u0631\u0648\u0642 \u0627\u0644\u062C\u0647\u062F \u0648\u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u062D\u0631\u0643\u064A \u0625\u0644\u0649 \u0639\u0645\u0644 \u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A \u0645\u0633\u062A\u0642\u0631 \u0648\u0646\u0627\u062A\u062C.", x: 80, y: 45, type: "output", statusLabel: "\u062A\u064A\u0627\u0631 \u0645\u062E\u0631\u062C\u0627\u062A \u0645\u062A\u0633\u0642 \u0648\u0645\u0633\u062A\u0642\u0631" }
      ],
      connections: [
        { fromId: "inputUnit", toId: "modifierUnit", label: "\u062A\u064A\u0627\u0631 \u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u062E\u0627\u0645", flowDirection: "forward", flowSpeedMultiplier: 1 },
        { fromId: "pistonForce", toId: "modifierUnit", label: "\u0646\u0628\u0636 \u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u0645\u0646\u0638\u0645", flowDirection: "forward", flowSpeedMultiplier: 1.2 },
        { fromId: "modifierUnit", toId: "outputForce", label: "\u0627\u0644\u0646\u0627\u062A\u062C \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A \u0627\u0644\u0645\u0633\u062A\u0642\u0631", flowDirection: "forward", flowSpeedMultiplier: 1.5 }
      ],
      simulation: {
        params: [
          { id: "frequency", label: "\u0633\u0631\u0639\u0629 \u062A\u064A\u0627\u0631 \u0627\u0644\u0645\u062F\u062E\u0644\u0627\u062A", min: 1, max: 100, step: 5, defaultValue: 40, unit: "Hz", description: "\u062A\u0631\u062F\u062F \u062A\u0635\u0627\u062F\u0645\u0627\u062A \u0627\u0644\u062C\u0632\u064A\u0626\u0627\u062A \u0627\u0644\u062A\u064A \u062A\u0639\u0628\u0631 \u0645\u0646\u0641\u0630 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0646\u0638\u0627\u0645 \u0627\u0644\u0623\u0648\u0644\u064A\u0629." },
          { id: "damping", label: "\u0645\u0639\u0627\u0645\u0644 \u0627\u0645\u062A\u0635\u0627\u0635 \u0627\u0644\u0627\u0647\u062A\u0632\u0627\u0632", min: 0, max: 10, step: 1, defaultValue: 4, unit: "%", description: "\u064A\u0645\u062A\u0635 \u0627\u0644\u0627\u0647\u062A\u0632\u0627\u0632\u0627\u062A \u0648\u064A\u0631\u062C\u0639 \u062A\u0645\u062B\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u062E\u0631\u062C\u0627\u062A \u0625\u0644\u0649 \u0627\u0644\u0646\u0637\u0627\u0642 \u0627\u0644\u0622\u0645\u0646 \u062D\u0627\u0633\u0648\u0628\u064A\u0627\u064B \u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0627\u064B." }
        ],
        visualTypeHint: "wave",
        description: "\u0645\u062D\u0627\u0643\u0627\u0629 \u0644\u0642\u064A\u0645 \u0627\u0644\u062A\u0631\u062F\u062F \u0645\u0642\u0627\u0628\u0644 \u0645\u0639\u0627\u0645\u0644 \u062A\u062B\u0628\u064A\u0637 \u0627\u0644\u0627\u062E\u062A\u0644\u0627\u0644 \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0641\u0639\u0644\u064A."
      },
      steps: [
        {
          title: "\u062D\u0642\u0646 \u0627\u0644\u0637\u0627\u0642\u0629 \u0648\u062A\u0648\u062C\u064A\u0647\u0647\u0627",
          description: `\u062A\u0637\u0628\u0642 \u0627\u0644\u0642\u0648\u0649 \u0627\u0644\u062E\u0627\u0631\u062C\u064A\u0629 \u0636\u063A\u0637\u0627\u064B \u0639\u0646\u062F \u0645\u062F\u062E\u0644 ${cleanTitle}\u060C \u062F\u0627\u0641\u0639\u0629 \u062C\u0632\u064A\u0626\u0627\u062A\u0647 \u0625\u0644\u0649 \u062A\u064A\u0627\u0631 \u0634\u0628\u0643\u0629 \u0627\u0644\u0645\u062E\u0637\u0637 \u0627\u0644\u0647\u0646\u062F\u0633\u064A \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A.`,
          highlightNodes: ["inputUnit"]
        },
        {
          title: "\u0645\u0648\u0627\u0621\u0645\u0629 \u0648\u062A\u062D\u0648\u064A\u0631 \u062A\u064A\u0627\u0631 \u0627\u0644\u062A\u063A\u0630\u064A\u0629",
          description: "\u062A\u0635\u0637\u062F\u0645 \u0627\u0644\u0642\u0648\u0649 \u0648\u0627\u0644\u0646\u0628\u0636\u0627\u062A \u0627\u0644\u0645\u0627\u0631\u0629 \u0628\u0627\u0644\u0635\u0645\u0627\u0645\u0627\u062A \u0648\u0627\u0644\u0645\u0628\u062F\u0644\u0627\u062A \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629 \u0648\u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629 \u0644\u062A\u0634\u063A\u064A\u0644 \u0645\u0639\u0627\u0644\u062C\u0627\u062A \u0627\u0644\u0636\u063A\u0637 \u0648\u0641\u0642 \u062E\u0648\u0627\u0631\u0632\u0645\u064A\u0627\u062A \u0627\u0644\u0627\u062A\u0633\u0627\u0642 \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A \u0627\u0644\u0634\u0627\u0645\u0644.",
          highlightNodes: ["modifierUnit", "pistonForce"]
        },
        {
          title: "\u062D\u0628\u0633 \u0648\u062A\u0628\u062F\u064A\u062F \u0627\u0647\u062A\u0632\u0627\u0632 \u0627\u0644\u0627\u062E\u062A\u0644\u0627\u0644",
          description: "\u062A\u062A\u062D\u0642\u0642 \u0645\u0633\u062A\u0634\u0639\u0631\u0627\u062A \u0627\u0644\u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A \u0645\u0646 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0633\u062A\u0642\u0631\u0627\u0631 \u0627\u0644\u0645\u062A\u062C\u0647\u0627\u062A\u060C \u0644\u062A\u0628\u062F\u064A\u062F \u0627\u0644\u0627\u0647\u062A\u0632\u0627\u0632\u0627\u062A \u0627\u0644\u0632\u0627\u0626\u062F\u0629 \u0648\u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u0637\u0627\u0642\u0629 \u0628\u0634\u0643\u0644 \u0622\u0645\u0646 \u0648\u0635\u062D\u064A\u062D.",
          highlightNodes: ["modifierUnit"]
        },
        {
          title: "\u0646\u0627\u062A\u062C \u0648\u0639\u0645\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0631",
          description: "\u0628\u0639\u062F \u0627\u0644\u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0643\u0627\u0645\u0644 \u0648\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0635\u0645\u0627\u0645\u060C \u062A\u062A\u062D\u0648\u0644 \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629 \u0625\u0644\u0649 \u0639\u0645\u0644 \u062D\u0631\u0643\u064A \u0646\u0647\u0627\u0626\u064A \u0645\u0633\u062A\u0642\u0631\u060C \u0645\u0643\u0645\u0644\u0629 \u0628\u0630\u0644\u0643 \u0627\u0644\u062F\u0648\u0631\u0629 \u0627\u0644\u062A\u0634\u063A\u064A\u0644\u064A\u0629 \u0644\u0644\u0645\u0646\u0638\u0648\u0645\u0629.",
          highlightNodes: ["outputForce"]
        }
      ],
      realWorldApplications: [
        `\u0627\u0644\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0647\u0646\u062F\u0633\u064A\u0629 \u0648\u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629 \u0644\u0640 ${cleanTitle}`,
        "\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062F\u0629 \u0627\u0644\u0630\u0643\u064A\u0629 \u0644\u062D\u0641\u0638 \u062A\u0648\u0627\u0632\u0646 \u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u0643\u0647\u0631\u0648\u0647\u064A\u062F\u0631\u0648\u0644\u064A\u0643\u064A",
        "\u062A\u0635\u0645\u064A\u0645 \u0627\u0644\u0645\u0646\u0638\u0648\u0645\u0627\u062A \u0627\u0644\u0645\u0648\u0641\u0631\u0629 \u0644\u0644\u0637\u0627\u0642\u0629 \u0630\u0627\u062A \u0627\u0644\u0643\u0641\u0627\u0621\u0629 \u0627\u0644\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u0645\u0627\u0646\u0639\u0629 \u0644\u0644\u0627\u062D\u062A\u0643\u0627\u0643"
      ],
      theory: {
        titleEn: `Fundamental Mechanics of ${cleanTitle}`,
        titleAr: `\u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u0627 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0640 ${cleanTitle}`,
        thesisEn: `Exploring the system framework and causal flow pathways that enable ${cleanTitle} to transform incoming power states safely into stabilized output velocity.`,
        thesisAr: `\u0627\u0633\u062A\u0643\u0634\u0627\u0641 \u0647\u064A\u0643\u0644 \u0627\u0644\u0646\u0638\u0627\u0645 \u0648\u0645\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u0633\u0628\u0628\u064A \u0627\u0644\u062A\u064A \u062A\u0645\u0643\u0646 ${cleanTitle} \u0645\u0646 \u062A\u062D\u0648\u064A\u0644 \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u0648\u0627\u0631\u062F\u0629 \u0628\u0623\u0645\u0627\u0646 \u0625\u0644\u0649 \u0637\u0627\u0642\u0629 \u062D\u0631\u0643\u064A\u0629 \u0645\u0633\u062A\u0642\u0631\u0629.`,
        mathEn: `Calculations are governed by localized kinetic friction formulas and conservation of energy guidelines.`,
        mathAr: `\u062A\u062E\u0636\u0639 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0644\u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0627\u0644\u0627\u062D\u062A\u0643\u0627\u0643 \u0627\u0644\u062D\u0631\u0643\u064A \u0627\u0644\u0645\u062D\u0644\u064A \u0648\u062A\u0648\u062C\u064A\u0647\u0627\u062A \u0642\u0627\u0646\u0648\u0646 \u062D\u0641\u0638 \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629.`,
        historyEn: `Designs trace back to early industrial feedback control loops and flow throttle governors.`,
        historyAr: `\u062A\u0639\u0648\u062F \u0627\u0644\u062A\u0635\u0627\u0645\u064A\u0645 \u062A\u0627\u0631\u064A\u062E\u064A\u0627\u064B \u0625\u0644\u0649 \u062D\u0644\u0642\u0627\u062A \u0627\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629 \u0627\u0644\u0645\u0628\u0643\u0631\u0629 \u0641\u064A \u0627\u0644\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062F\u0629 \u0648\u0635\u0645\u0627\u0645\u0627\u062A \u062E\u0646\u0642 \u0627\u0644\u062A\u062F\u0641\u0642.`,
        challengeEn: `The primary engineering challenge is managing material fatigue under severe friction.`,
        challengeAr: `\u064A\u062A\u0645\u062B\u0644 \u0627\u0644\u062A\u062D\u062F\u064A \u0627\u0644\u0647\u0646\u062F\u0633\u064A \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0641\u064A \u0625\u062F\u0627\u0631\u0629 \u0643\u0644\u0644 \u0648\u0625\u062C\u0647\u0627\u062F \u0627\u0644\u0645\u0648\u0627\u062F \u062A\u062D\u062A \u0638\u0631\u0648\u0641 \u0627\u0644\u0627\u062D\u062A\u0643\u0627\u0643 \u0627\u0644\u0634\u062F\u064A\u062F.`
      },
      qAndA: [
        {
          question: `\u0645\u0627 \u0647\u064A \u0623\u062E\u0637\u0631 \u062D\u0627\u0644\u0627\u062A \u0627\u0646\u0647\u064A\u0627\u0631 \u0646\u0638\u0627\u0645 ${cleanTitle}\u061F`,
          answer: "\u0627\u0644\u062A\u0635\u062F\u0639 \u0627\u0644\u062D\u0631\u0627\u0631\u064A \u0623\u0648 \u062A\u0622\u0643\u0644 \u0643\u062A\u0644 \u0627\u0644\u0645\u0648\u0627\u062F \u0639\u0646\u062F\u0645\u0627 \u062A\u0631\u062A\u0641\u0639 \u0645\u0633\u062A\u0648\u064A\u0627\u062A \u0627\u0644\u0632\u062E\u0645 \u0641\u064A \u0627\u0644\u0645\u062F\u062E\u0644\u0627\u062A \u0628\u0634\u0643\u0644 \u064A\u062A\u062C\u0627\u0648\u0632 \u0633\u0631\u0639\u0629 \u0642\u0646\u0648\u0627\u062A \u062A\u0628\u062F\u064A\u062F \u0627\u0644\u0636\u063A\u0637 \u0648\u0627\u0644\u062D\u0631\u0627\u0631\u0629 \u0627\u0644\u0645\u0639\u0632\u0632\u0629."
        },
        {
          question: `\u0643\u064A\u0641 \u062A\u0633\u0627\u0647\u0645 \u0627\u0644\u0623\u062A\u0645\u062A\u0629 \u0627\u0644\u0631\u0642\u0645\u064A\u0629 \u0641\u064A \u062A\u0639\u0632\u064A\u0632 \u062A\u0648\u0627\u0632\u0646 ${cleanTitle}\u061F`,
          answer: "\u0628\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0635\u0645\u0627\u0645\u0627\u062A \u0627\u0644\u0636\u063A\u0637 \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629 \u0627\u0644\u064A\u062F\u0648\u064A\u0629 \u0628\u0645\u0644\u0641\u0627\u062A \u0645\u0646\u0638\u0645\u0629 \u062D\u0627\u0633\u0648\u0628\u064A\u0627\u064B \u0628\u0643\u0647\u0631\u0628\u0627\u0621 \u062F\u0642\u064A\u0642\u0629 \u0648\u0645\u0633\u062A\u0634\u0639\u0631\u0627\u062A \u0630\u0643\u064A\u0629\u060C \u0645\u0645\u0627 \u064A\u0642\u0644\u0644 \u0645\u0646 \u0646\u0633\u0628 \u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u0636\u0627\u0626\u0639 \u0628\u0640 45%!"
        }
      ]
    };
  }
  return {
    title: `How ${cleanTitle} Works`,
    category: "Dynamic Physics & Systems",
    summary: `Exploring the real-time physical mechanisms and interactive balance metrics behind ${cleanTitle}.`,
    iconName: "ShieldAlert",
    nodes: [
      { id: "inputUnit", label: "Signal Feed Input", description: "Injects initial variables or energy vectors into the mechanism boundary.", x: 20, y: 30, type: "input", statusLabel: "Capturing primary vectors" },
      { id: "modifierUnit", label: "System Calibration Process", description: "Bends or calculates mathematical transformations based on parameters.", x: 50, y: 50, type: "process", statusLabel: "Frictional balancing dynamic active" },
      { id: "pistonForce", label: "Governor regulator gate", description: "Adjusts fluid flow pressure according to target slider controllers.", x: 50, y: 20, type: "control", statusLabel: "Active dampening throttle" },
      { id: "outputForce", label: "Final Vector Output", description: "The result of the interaction cascade, translating potential energy into motion.", x: 80, y: 45, type: "output", statusLabel: "Stable output amplitude" }
    ],
    connections: [
      { fromId: "inputUnit", toId: "modifierUnit", label: "Raw Force Stream", flowDirection: "forward", flowSpeedMultiplier: 1 },
      { fromId: "pistonForce", toId: "modifierUnit", label: "Calibration Push", flowDirection: "forward", flowSpeedMultiplier: 1.2 },
      { fromId: "modifierUnit", toId: "outputForce", label: "Refined Drive Output", flowDirection: "forward", flowSpeedMultiplier: 1.5 }
    ],
    simulation: {
      params: [
        { id: "frequency", label: "Input Driver Speed", min: 1, max: 100, step: 5, defaultValue: 40, unit: "Hz", description: "Frequency of particle collisions passing through the system input gate." },
        { id: "damping", label: "Resistance Dampening Coefficient", min: 0, max: 10, step: 1, defaultValue: 4, unit: "%", description: "Absorbs vibration, bringing output stabilization vectors back under controller threshold." }
      ],
      visualTypeHint: "wave",
      description: "Simulation of dynamic input vs physical damping factors."
    },
    steps: [
      {
        title: "Energy Injection Point",
        description: `External motion forces apply pressure onto the ${cleanTitle} entrance boundary, pushing raw molecules or signal waves into the responsive grid network.`,
        highlightNodes: ["inputUnit"]
      },
      {
        title: "Feedback Modulation Cascade",
        description: "The incoming forces collide with mechanical gears or electronic switches. Real-time parameters alter the speed of transmission paths.",
        highlightNodes: ["modifierUnit", "pistonForce"]
      },
      {
        title: "Damping Vector Suppression",
        description: "Energy limits are checked. Feedback sensors damp down runaway friction loops and direct the kinetic pathways safely into ready storage cells.",
        highlightNodes: ["modifierUnit"]
      },
      {
        title: "Stable Work Action Output",
        description: "After complete stabilization, potential yields convert to functional work action, fulfilling the ultimate mechanical loop of the device.",
        highlightNodes: ["outputForce"]
      }
    ],
    realWorldApplications: [
      `Industrial engineering implementations of ${cleanTitle}`,
      "Dynamic responsive feedback loops",
      "Next generation energy efficient designs"
    ],
    theory: {
      titleEn: `Fundamental Mechanics of ${cleanTitle}`,
      titleAr: `\u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u0627 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0644\u0640 ${cleanTitle}`,
      thesisEn: `Exploring the system framework and causal flow pathways that enable ${cleanTitle} to transform incoming power states safely into stabilized output velocity.`,
      thesisAr: `\u0627\u0633\u062A\u0643\u0634\u0627\u0641 \u0647\u064A\u0643\u0644 \u0627\u0644\u0646\u0638\u0627\u0645 \u0648\u0645\u0633\u0627\u0631\u0627\u062A \u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u0633\u0628\u0628\u064A \u0627\u0644\u062A\u064A \u062A\u0645\u0643\u0646 ${cleanTitle} \u0645\u0646 \u062A\u062D\u0648\u064A\u0644 \u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u0648\u0627\u0631\u062F\u0629 \u0628\u0623\u0645\u0627\u0646 \u0625\u0644\u0649 \u0637\u0627\u0642\u0629 \u062D\u0631\u0643\u064A\u0629 \u0645\u0633\u062A\u0642\u0631\u0629.`,
      mathEn: `Calculations are governed by localized kinetic friction formulas and conservation of energy guidelines.`,
      mathAr: `\u062A\u062E\u0636\u0639 \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u0644\u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0627\u0644\u0627\u062D\u062A\u0643\u0627\u0643 \u0627\u0644\u062D\u0631\u0643\u064A \u0627\u0644\u0645\u062D\u0644\u064A \u0648\u062A\u0648\u062C\u064A\u0647\u0627\u062A \u0642\u0627\u0646\u0648\u0646 \u062D\u0641\u0638 \u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u064A\u0629.`,
      historyEn: `Designs trace back to early industrial feedback control loops and flow throttle governors.`,
      historyAr: `\u062A\u0639\u0648\u062F \u0627\u0644\u062A\u0635\u0627\u0645\u064A\u0645 \u062A\u0627\u0631\u064A\u062E\u064A\u0627\u064B \u0625\u0644\u0649 \u062D\u0644\u0642\u0627\u062A \u0627\u0644\u062A\u062D\u0643\u0645 \u0627\u0644\u0635\u0646\u0627\u0639\u064A\u0629 \u0627\u0644\u0645\u0628\u0643\u0631\u0629 \u0641\u064A \u0627\u0644\u062A\u063A\u0630\u064A\u0629 \u0627\u0644\u0645\u0631\u062A\u062F\u0629 \u0648\u0635\u0645\u0627\u0645\u0627\u062A \u062E\u0646\u0642 \u0627\u0644\u062A\u062F\u0641\u0642.`,
      challengeEn: `The primary engineering challenge is managing material fatigue under severe friction.`,
      challengeAr: `\u064A\u062A\u0645\u062B\u0644 \u0627\u0644\u062A\u062D\u062F\u064A \u0627\u0644\u0647\u0646\u062F\u0633\u064A \u0627\u0644\u0623\u0633\u0627\u0633\u064A \u0641\u064A \u0625\u062F\u0627\u0631\u0629 \u0643\u0644\u0644 \u0648\u0625\u062C\u0647\u0627\u062F \u0627\u0644\u0645\u0648\u0627\u062F \u062A\u062D\u062A \u0638\u0631\u0648\u0641 \u0627\u0644\u0627\u062D\u062A\u0643\u0627\u0643 \u0627\u0644\u0634\u062F\u064A\u062F.`
    },
    qAndA: [
      {
        question: `What is the most critical failure mode of ${cleanTitle}?`,
        answer: "Thermal or material fracturing when input momentum rises faster than the kinetic heat dispersion tubes can transport energy away."
      },
      {
        question: `How does adding digital automation improve ${cleanTitle} systems?`,
        answer: "By replacing structural physical weights with micro-servos managed by computerized logic. This cuts target system drag by over 45%!"
      }
    ]
  };
}
startServer();
//# sourceMappingURL=server.cjs.map
