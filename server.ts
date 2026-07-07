import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini Client Lazily if key is present
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Generate a fully structured schematic explanation for any custom topic
  app.post("/api/explain", async (req, res) => {
    try {
      const { topic, lang = "en" } = req.body;
      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic string is required." });
      }

      console.log(`Generating interactive explanation model for user topic: "${topic}" (language: ${lang})`);

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback generator for offline/local environments without API keys
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
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of the topic (e.g. 'How noise-canceling headphones work')" },
              category: { type: Type.STRING, description: "System category (e.g. 'Audio Physics & Hardware')" },
              summary: { type: Type.STRING, description: "Inspiring 2-sentence summary explaining the magic of the mechanism" },
              iconName: { type: Type.STRING, description: "Short Lucide React icon name that best matches (e.g. 'Cpu', 'Waves', 'Activity', 'Shield', 'Gauge')" },
              nodes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "Short lowercase ID (e.g. 'mic', 'inverter', 'driver')" },
                    label: { type: Type.STRING, description: "Elegant human label (e.g. 'Ambient Microphone')" },
                    description: { type: Type.STRING, description: "Brief intuitive explanation of what it does" },
                    x: { type: Type.INTEGER, description: "Pragmatic X coordinate percentage from 10 to 90" },
                    y: { type: Type.INTEGER, description: "Pragmatic Y coordinate percentage from 15 to 80" },
                    type: { type: Type.STRING, description: "Component type: 'input' | 'process' | 'output' | 'control' | 'storage'" },
                    statusLabel: { type: Type.STRING, description: "Dynamic status description (e.g., 'Capturing ambient pressure waves')" }
                  },
                  required: ["id", "label", "description", "x", "y", "type"]
                }
              },
              connections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fromId: { type: Type.STRING, description: "Source node ID" },
                    toId: { type: Type.STRING, description: "Destination node ID" },
                    label: { type: Type.STRING, description: "Short description of what flows (e.g., 'Analogue Audio Voltage')" },
                    flowDirection: { type: Type.STRING, description: "'forward' or 'none'" },
                    flowSpeedMultiplier: { type: Type.NUMBER, description: "Speed of flow simulation particles (e.g., 1.0)" }
                  },
                  required: ["fromId", "toId"]
                }
              },
              simulation: {
                type: Type.OBJECT,
                properties: {
                  params: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING, description: "Param identifier (e.g., 'ambientdb')" },
                        label: { type: Type.STRING, description: "Human friendly slider label" },
                        min: { type: Type.NUMBER, description: "Minimum numerical value" },
                        max: { type: Type.NUMBER, description: "Maximum numerical value" },
                        step: { type: Type.NUMBER, description: "Adjustment step interval" },
                        defaultValue: { type: Type.NUMBER, description: "Default active value" },
                        unit: { type: Type.STRING, description: "Metric units symbol (e.g., 'dB', 'Hz')" },
                        description: { type: Type.STRING, description: "Brief description of physics governed" }
                      },
                      required: ["id", "label", "min", "max", "step", "defaultValue", "unit", "description"]
                    }
                  },
                  visualTypeHint: { type: Type.STRING, description: "Simulation visual paradigm choice: 'wave' | 'transfer' | 'flow' | 'lever' | 'rotational' | 'gauge'" },
                  description: { type: Type.STRING, description: "Explanation of what the simulation illustrates" }
                },
                required: ["params", "visualTypeHint"]
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    highlightNodes: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["title", "description"]
                }
              },
              realWorldApplications: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              theory: {
                type: Type.OBJECT,
                properties: {
                  titleEn: { type: Type.STRING },
                  titleAr: { type: Type.STRING },
                  thesisEn: { type: Type.STRING },
                  thesisAr: { type: Type.STRING },
                  mathEn: { type: Type.STRING },
                  mathAr: { type: Type.STRING },
                  historyEn: { type: Type.STRING },
                  historyAr: { type: Type.STRING },
                  challengeEn: { type: Type.STRING },
                  challengeAr: { type: Type.STRING }
                },
                required: [
                  "titleEn", "titleAr",
                  "thesisEn", "thesisAr",
                  "mathEn", "mathAr",
                  "historyEn", "historyAr",
                  "challengeEn", "challengeAr"
                ]
              },
              qAndA: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
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

    } catch (error: any) {
      console.error("Gemini explanation generation failed:", error);
      res.status(500).json({
        error: "Failed to generate dynamic visual schematic.",
        message: error.message || error.toString()
      });
    }
  });

  // Serve static files in production, set up Vite in active development mode
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

  // Bind server strictly to host 0.0.0.0 and Port 3000 as requested
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mechanica node network online at port ${PORT}`);
  });
}

// Simple deterministic model builder for Offline / Local backup
function createFallbackModel(topicName: string, lang: string = "en") {
  const formattedTitle = topicName.replace(/[?]/g, '').trim();
  const cleanTitle = formattedTitle.charAt(0).toUpperCase() + formattedTitle.slice(1);
  
  if (lang === "ar") {
    return {
      title: `كيف يعمل ${cleanTitle}`,
      category: "ميكانيكا وهندسة الأنظمة",
      summary: `استكشاف للآليات الفيزيائية ومعايير التوازن في الوقت الفعلي للنمذجة الحركية وراء ${cleanTitle}.`,
      iconName: "ShieldAlert",
      nodes: [
        { id: "inputUnit", label: "مدخل النبضات الرئيسي", description: "يغذي ويوجه طاقة الجسيمات أو حركات الميكانيكا الهندسية داخل حدود النظام.", x: 20, y: 30, type: "input", statusLabel: "التقاط وتوجيه التدفق الحركي" },
        { id: "modifierUnit", label: "معالج التوازن المركزي", description: "يطبق المعادلات الفيزيائية، وخسائر الاحتكاك، والتحولات الحركية للمتغيرات.", x: 50, y: 50, type: "process", statusLabel: "الموازنة الهيدروليكية نشطة" },
        { id: "pistonForce", label: "صمام رصد الاختلال", description: "ينظم ويخنق معدلات التدفق والضغط في الوقت الفعلي بناءً على واجهة المحاكي الشاملة.", x: 50, y: 20, type: "control", statusLabel: "مخفف اهتزاز وبوابة تثبيط" },
        { id: "outputForce", label: "مخرج الحركة النهائي", description: "النتيجة النهائية للمنظومة، ويترجم فروق الجهد والضغط الحركي إلى عمل ميكانيكي مستقر وناتج.", x: 80, y: 45, type: "output", statusLabel: "تيار مخرجات متسق ومستقر" }
      ],
      connections: [
        { fromId: "inputUnit", toId: "modifierUnit", label: "تيار القوة الخام", flowDirection: "forward", flowSpeedMultiplier: 1.0 },
        { fromId: "pistonForce", toId: "modifierUnit", label: "نبض الضغط المنظم", flowDirection: "forward", flowSpeedMultiplier: 1.2 },
        { fromId: "modifierUnit", toId: "outputForce", label: "الناتج الميكانيكي المستقر", flowDirection: "forward", flowSpeedMultiplier: 1.5 }
      ],
      simulation: {
        params: [
          { id: "frequency", label: "سرعة تيار المدخلات", min: 1, max: 100, step: 5, defaultValue: 40, unit: "Hz", description: "تردد تصادمات الجزيئات التي تعبر منفذ إدخال النظام الأولية." },
          { id: "damping", label: "معامل امتصاص الاهتزاز", min: 0, max: 10, step: 1, defaultValue: 4, unit: "%", description: "يمتص الاهتزازات ويرجع تمثيلات المخرجات إلى النطاق الآمن حاسوبياً ميكانيكياً." }
        ],
        visualTypeHint: "wave",
        description: "محاكاة لقيم التردد مقابل معامل تثبيط الاختلال في الوقت الفعلي."
      },
      steps: [
        {
          title: "حقن الطاقة وتوجيهها",
          description: `تطبق القوى الخارجية ضغطاً عند مدخل ${cleanTitle}، دافعة جزيئاته إلى تيار شبكة المخطط الهندسي التفاعلي.`,
          highlightNodes: ["inputUnit"]
        },
        {
          title: "مواءمة وتحوير تيار التغذية",
          description: "تصطدم القوى والنبضات المارة بالصمامات والمبدلات الإلكترونية والميكانيكية لتشغيل معالجات الضغط وفق خوارزميات الاتساق الميكانيكي الشامل.",
          highlightNodes: ["modifierUnit", "pistonForce"]
        },
        {
          title: "حبس وتبديد اهتزاز الاختلال",
          description: "تتحقق مستشعرات التوازن الميكانيكي من مستويات استقرار المتجهات، لتبديد الاهتزازات الزائدة وتوجيه الطاقة بشكل آمن وصحيح.",
          highlightNodes: ["modifierUnit"]
        },
        {
          title: "ناتج وعمل الحركة المستقر",
          description: "بعد التوازن الكامل وتعديل الصمام، تتحول الطاقة المعالجة إلى عمل حركي نهائي مستقر، مكملة بذلك الدورة التشغيلية للمنظومة.",
          highlightNodes: ["outputForce"]
        }
      ],
      realWorldApplications: [
        `التطبيقات الهندسية والصناعية لـ ${cleanTitle}`,
        "أنظمة التغذية المرتدة الذكية لحفظ توازن الضغط الكهروهيدروليكي",
        "تصميم المنظومات الموفرة للطاقة ذات الكفاءة العالية المانعة للاحتكاك"
      ],
      theory: {
        titleEn: `Fundamental Mechanics of ${cleanTitle}`,
        titleAr: `الميكانيكا الأساسية لـ ${cleanTitle}`,
        thesisEn: `Exploring the system framework and causal flow pathways that enable ${cleanTitle} to transform incoming power states safely into stabilized output velocity.`,
        thesisAr: `استكشاف هيكل النظام ومسارات التدفق السببي التي تمكن ${cleanTitle} من تحويل حالات القوة الواردة بأمان إلى طاقة حركية مستقرة.`,
        mathEn: `Calculations are governed by localized kinetic friction formulas and conservation of energy guidelines.`,
        mathAr: `تخضع الحسابات لمعادلات الاحتكاك الحركي المحلي وتوجيهات قانون حفظ الطاقة الميكانيكية.`,
        historyEn: `Designs trace back to early industrial feedback control loops and flow throttle governors.`,
        historyAr: `تعود التصاميم تاريخياً إلى حلقات التحكم الصناعية المبكرة في التغذية المرتدة وصمامات خنق التدفق.`,
        challengeEn: `The primary engineering challenge is managing material fatigue under severe friction.`,
        challengeAr: `يتمثل التحدي الهندسي الأساسي في إدارة كلل وإجهاد المواد تحت ظروف الاحتكاك الشديد.`
      },
      qAndA: [
        {
          question: `ما هي أخطر حالات انهيار نظام ${cleanTitle}؟`,
          answer: "التصدع الحراري أو تآكل كتل المواد عندما ترتفع مستويات الزخم في المدخلات بشكل يتجاوز سرعة قنوات تبديد الضغط والحرارة المعززة."
        },
        {
          question: `كيف تساهم الأتمتة الرقمية في تعزيز توازن ${cleanTitle}؟`,
          answer: "باستبدال صمامات الضغط الميكانيكية اليدوية بملفات منظمة حاسوبياً بكهرباء دقيقة ومستشعرات ذكية، مما يقلل من نسب التدفق الضائع بـ 45%!"
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
      { fromId: "inputUnit", toId: "modifierUnit", label: "Raw Force Stream", flowDirection: "forward", flowSpeedMultiplier: 1.0 },
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
      titleAr: `الميكانيكا الأساسية لـ ${cleanTitle}`,
      thesisEn: `Exploring the system framework and causal flow pathways that enable ${cleanTitle} to transform incoming power states safely into stabilized output velocity.`,
      thesisAr: `استكشاف هيكل النظام ومسارات التدفق السببي التي تمكن ${cleanTitle} من تحويل حالات القوة الواردة بأمان إلى طاقة حركية مستقرة.`,
      mathEn: `Calculations are governed by localized kinetic friction formulas and conservation of energy guidelines.`,
      mathAr: `تخضع الحسابات لمعادلات الاحتكاك الحركي المحلي وتوجيهات قانون حفظ الطاقة الميكانيكية.`,
      historyEn: `Designs trace back to early industrial feedback control loops and flow throttle governors.`,
      historyAr: `تعود التصاميم تاريخياً إلى حلقات التحكم الصناعية المبكرة في التغذية المرتدة وصمامات خنق التدفق.`,
      challengeEn: `The primary engineering challenge is managing material fatigue under severe friction.`,
      challengeAr: `يتمثل التحدي الهندسي الأساسي في إدارة كلل وإجهاد المواد تحت ظروف الاحتكاك الشديد.`
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
