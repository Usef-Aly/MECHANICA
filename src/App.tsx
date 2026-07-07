import { useState, useEffect } from 'react';
import { Topic, TopicComponentNode } from './types';
import { PRESET_TOPICS } from './data/presetTopics';
import VisualBlueprint from './components/VisualBlueprint';
import InteractiveSimulator from './components/InteractiveSimulator';
import StepExploration from './components/StepExploration';
import AIPoweredExploration from './components/AIPoweredExploration';
import HeroState from './components/HeroState';
import InteractiveFormulaBreakdown from './components/InteractiveFormulaBreakdown';
import DiagnosticFailureSimulation from './components/DiagnosticFailureSimulation';
import TheoreticalLectureNotes from './components/TheoreticalLectureNotes';
import { localizeTopic, UI_STRINGS } from './lib/translations';
import { 
  Compass, 
  ArrowLeft, 
  BookOpen, 
  Sparkle, 
  Sliders, 
  Settings, 
  Info, 
  HelpCircle,
  Globe,
  Zap,
  Plane,
  Layers,
  Orbit,
  Sparkles,
  Navigation,
  Map,
  Lightbulb
} from 'lucide-react';

// Interactive quizzes matching preset topics to avoid mock or hollow interactions
const INTERACTIVE_QUIZZES: Record<string, {
  question: { en: string; ar: string };
  options: { en: string[]; ar: string[] };
  correctIndex: number;
  explanation: { en: string; ar: string };
}> = {
  "airplane-flight": {
    question: {
      en: "What is the primary aerodynamic force that directly opposes the Lift of the wing in flight?",
      ar: "ما هي القوة الجوية الأيروديناميكية الأساسية التي تعارض مباشرة قوة الرفع للجناح أثناء الطيران؟"
    },
    options: {
      en: ["Thrust from jet engine", "Weight (Force of Gravity)", "Drag (Air Resistance)", "Structural Tension"],
      ar: ["قوة الدفع من التوربينات النفاثة", "الوزن الكلي (قوة الجاذبية الأرضية)", "قوة الكبح ومقاومة الرياح", "قوة الشد الهيكلية"]
    },
    correctIndex: 1,
    explanation: {
      en: "Weight pulls the aircraft straight down toward Earth, which must be perfectly counteracted by lift generated over the wing curvature.",
      ar: "يقوم الوزن الكلي بسحب هيكل الطائرة لأسفل نحو الكوكب، وهو ما يجب التغلب عليه تماماً عبر موازنة تيار قوة الرفع الكامنة بالجناح."
    }
  },
  "electricity-flow": {
    question: {
      en: "Based on Ohm's Law, what happens to the electric current if you double the system Resistance while keeping Voltage identical?",
      ar: "بالاعتماد على قانون أوم، ماذا يحدث للتيار الكهربائي إذا تضاعفت المقاومة مع تثبيت فارق الجهد؟"
    },
    options: {
      en: ["The current doubles in flow", "The current is cut precisely in half", "The current stays exactly unchanged", "The current instantly collapses to absolute zero"],
      ar: ["يتضاعف مقدار وشدة سيل التيار", "ينخفض التيار بنسبة النصف تماماً", "يبقى منسوب شدة التيار ثابتاً دون تعديل", "ينقطع التيار تماماً ويصل للصفر المطلق"]
    },
    correctIndex: 1,
    explanation: {
      en: "Ohm's Law states that current is inversely proportional to resistance. If resistance climbs, electron flow drops proportionally.",
      ar: "ينص قانون أوم الفيزيائي على أن التيار يتناسب عكسياً مع المقاومة. فإذا تضاعفت الممانعة، ينخفض السيل الإلكتروني للنصف تلقائياً."
    }
  },
  "electricity-home": {
    question: {
      en: "Why is electricity stepped up to extreme high voltages before traveling across national pylon lines?",
      ar: "لماذا يتم رفع الفولتية لقيم فائقة بمحطات الرفع قبل بثها عبر أبراج الضغط العالي؟"
    },
    options: {
      en: ["To force electricity to reach households faster", "To transmit power with minimal energy lost as wire heat", "To keep high-tension wires chilled in summer", "To allow double-direction power swapping without servers"],
      ar: ["لجبر الكهرباء على السفر عبر الأسلاك بسرعة أكبر", "لنقل الطاقة بأدنى كفاءة تشتت وفقد طاقة كحرارة بالموصلات", "لإيقاف تسخين الخطوط وحمايتها من التجمد شتاءً", "لتنفيذ تبديل الطاقة ثنائي الاتجاه بالشبكات"]
    },
    correctIndex: 1,
    explanation: {
      en: "Stepping up voltage reduces line current. Lower current means dramatically reduced active friction inside copper cords, saving massive amounts of power.",
      ar: "يؤدي رفع الجهد لتقليص التيار الساري بخط النقل، والحد من التيار يعني هبوط الاحتكاك الحراري الذري بالنحاس، فيحمى الطاقة من الهدر والتبدد."
    }
  },
  "bgp-routing": {
    question: {
      en: "Which routing parameter does the BGP protocol prioritize above all to map packets across domains?",
      ar: "ما هو المقياس الذي يعطيه بروتوكول BGP الأولوية لتوجيه حزم البيانات عبر مسارات الشبكات المختلفة؟"
    },
    options: {
      en: ["The physical geocentric distance in miles", "AS-Path length (shortest number of autonomous network hops)", "Line speed rated in Gigabits per second", "Physical wire thickness of fiber channel"],
      ar: ["المسافة الجغرافية الساحلية بالأميال", "طول مسار الأنظمة المانحة (أقل عدد من قفزات الأنظمة الذاتية AS-Path)", "سرعة الخط التناظرية معبراً عنها بالجيجابت براند", "سماكة الطلاء الداخلي لقنوات ليف الاتصال"]
    },
    correctIndex: 1,
    explanation: {
      en: "BGP prefers paths with fewer Autonomous System (AS) hops, prioritizing domain reliability and shortest directory steps over raw physical wiring lengths.",
      ar: "يبحث BGP عن مسار يعبر الأنظمة المستقلة (AS) بعدد قفزات أقل، معطياً الاستقرار الإداري والقفزات الهيكلية الأسبقية على المعاير الجغرافية."
    }
  }
};

const ONE_SCREEN_SUMMARIES: Record<string, {
  bullets: { en: string[]; ar: string[] }
}> = {
  "airplane-flight": {
    bullets: {
      en: [
        "Aerodynamic forces do not balance by random luck.",
        "High wings create natural low pressure pockets leveraging air velocity.",
        "Angle of attack is the ultimate engine booster to recover from stalls.",
        "Flight represents a continuous action-reaction loop."
      ],
      ar: [
        "قوى الطيران ليست عشوائية بل اتزان فيزيائي منسق وقوى مترابطة.",
        "الأجنحة المنحنية تفرز حقول ضغط جوي منخفض بالسطح العلوي عبر تسخين وتوجيه التدفق.",
        "زاوية المواجهة تعد المعزز والجبر الفوري لتعويض نسب انخفاض السرعات ومنع الانهيار.",
        "طيران الطائرة يجسد موازنة دورية لدروس الفعل واستجابات نيوتن الهندسية."
      ]
    }
  },
  "electricity-flow": {
    bullets: {
      en: [
        "Electricity is atomic potential difference inside wires.",
        "Amps represent flow volume, Volts represent direct pressure force.",
        "Resistance converts mechanical electric currents to thermal energy.",
        "Circuits must remain completely closed, or currents instantly cease."
      ],
      ar: [
        "الكهرباء تنشأ وتزدهر من فارق شحن مجهري كامن بالذرات المتجاورة.",
        "الأمبير يعكس حجم السيل المائي الكثيف، بينما يعبر الفولت عن ضغط الدفع المتراكم.",
        "المقاوم يترجم الاحتكاك الموصل الإلكتروني لحرارة محورية هادفة بدقة.",
        "الدائرة الكهربائية يجب أن تلتف مغلقة بالكامل، وإلا انهار التوصيل فوراً بلا تأخير."
      ]
    }
  },
  "electricity-home": {
    bullets: {
      en: [
        "Electricity is never created but transformed from raw kinetical energy.",
        "Voltage is stepped up for transit to drop heating losses over highways.",
        "Municipal grids are closely-wired networks to output stable local voltages.",
        "Household safety breakers auto-shutoff if current overloads the walls."
      ],
      ar: [
        "الكهرباء لا تفنى ولا تُخلق من العدم بل تتحول من طاقة ميكانيكية كامنة بالطبيعة.",
        "يتم رفع الجهد لقدرة فائقة للنقل البري بغية تضييق تبدد الطاقة وحماية الأسلاك من الانصهار.",
        "الشبكات ومحولات التوزيع منسقة لحفظ مخرجات المنزل عند معدل فولت ذي استقرار ثابت.",
        "القواطع الأتوماتيكية في مدخل بيتك تفصل الخط آلياً فور تفطنها لفرط أحمال مخرجة مفرطة."
      ]
    }
  },
  "internet-packets": {
    bullets: {
      en: [
        "Data is chopped into standardized envelopes called packets.",
        "Routers act as traffic agents reading headers to direct flows.",
        "Bufferbloat and queueing delays cause packet drop under load.",
        "Transmission speed is restricted by the speed of light in fiber."
      ],
      ar: [
        "تُجزأ البيانات إلى مظاريف معيارية مرقمة تسمى حزم البيانات.",
        "الموجهات تعمل كرجال مرور يقرؤون ترويسة الحزم لتوجيه المسار تلقائياً.",
        "تخمة المخزن المؤقت والتأخير في الطوابير يسببان سقوط الحزم عند الضغط.",
        "سرعة النقل محكومة كلياً بسرعة الضوء في الألياف الزجاجية الناقلة."
      ]
    }
  },
  "bridge-forces": {
    bullets: {
      en: [
        "Bridges maintain stability through static mechanical equilibrium.",
        "Vertical weight load of traffic is converted to axial wire tension.",
        "Tension forces pull cables, while towers absorb heavy compression.",
        "Catenary cable curvature naturally shifts to parabolic under deck weight."
      ],
      ar: [
        "تحافظ الجسور على استقرارها بفضل قانون الاتزان الميكانيكي الساكن.",
        "يتحول الوزن الرأسي لحركة المرور إلى شد محوري في كابلات الفولاذ.",
        "قوى الشد تسحب الكابلات الرئيسية، بينما تمتص الأبراج الضغط الرأسي الساحق.",
        "يتحول المنحنى السلسلي للكابلات تلقائياً لقطع مكافئ عند تحميل بلاطات الطريق."
      ]
    }
  },
  "satellite-orbit": {
    bullets: {
      en: [
        "Orbiting is not escaping gravity, but a perpetual state of free fall.",
        "Tangential velocity matches the earth's curvature precisely.",
        "Satellite orbital speed is strictly governed by altitude, not mass.",
        "Small thrusters counteract thin atmospheric drag to keep station."
      ],
      ar: [
        "الدوران ليس هروباً من الجاذبية، بل هو سقوط حر مستمر ومنظم.",
        "السرعة المماسية توافق تماماً وتطابق درجة انحناء الكوكب الدائري.",
        "سرعة دوران القمر محكومة كلياً بارتفاع المدار، ومستقلة عن كتلة القمر نفسه.",
        "محركات الدفع الصغيرة تقاوم الاحتكاك الجوي الرقيق للحفاظ على الموقع المداري."
      ]
    }
  },
  "nuclear-reactor": {
    bullets: {
      en: [
        "Fission converts nuclear binding mass deficit into thermal energy.",
        "Water acts as a moderator to slow down neutrons for capture.",
        "Control rods absorb excess neutrons to maintain critical balance.",
        "Passive cooling safety loops utilize convection to prevent meltdowns."
      ],
      ar: [
        "الانشطار يحول العجز في كتلة الترابط النووي إلى طاقة حرارية هائلة.",
        "الماء يعمل كمهدئ لإبطاء سرعة النيوترونات الحرة لضمان اصطيادها.",
        "قضبان التحكم تمتص النيوترونات الزائدة للحفاظ على توازن الحالة الحرجة.",
        "حلقات التبريد السلبية تستخدم تيارات الحمل الطبيعي لمنع انصهار القلب."
      ]
    }
  },
  "submarine-diving": {
    bullets: {
      en: [
        "Buoyancy is governed by the weight of displaced fluid volume.",
        "Flooding ballast tanks with sea water increases density to submerge.",
        "Compressed air blows water out of tanks to restore positive buoyancy.",
        "Hydrostatic pressure scales linearly with depth, compressing the hull."
      ],
      ar: [
        "الطفو محكوم كلياً بوزن وحجم السائل المزاح بواسطة هيكل الغواصة.",
        "غمر خزانات الموازنة بماء البحر يرفع الكثافة الإجمالية للغوص للأسفل.",
        "الهواء المضغوط يطرد المياه خارج الخزانات لاستعادة الطفو الإيجابي والصعود.",
        "الضغط الهيدروستاتيكي يتزايد خطياً مع العمق ضاغطاً البدن الفولاذي بقوة."
      ]
    }
  },
  "gps-trilateration": {
    bullets: {
      en: [
        "GPS is passive; receivers compute positions via trilateration geometry.",
        "Precise atomic clocks in orbit keep timing errors within nanoseconds.",
        "Four satellites are required to resolve 3D space coordinates and clock drift.",
        "Einstein's relativistic time dilation must be constantly corrected."
      ],
      ar: [
        "نظام GPS نظام صامت؛ تحسب الهواتف موقعها بهندسة التقاطع الدائري.",
        "ساعات ذرية فائقة في المدار تحفظ زمن البث بدقة النانوثانية.",
        "يلزم أربعة أقمار على الأقل لحل إحداثيات الفراغ وانحراف ساعة الهاتف.",
        "يجب تصحيح التمدد الزمني لنسبية أينشتاين (الخاصة والعامة) باستمرار."
      ]
    }
  }
};

export default function App() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  
  // Track parameters of the active simulation
  const [simParams, setSimParams] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // AI Dynamic exploration tracking
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [showAICreator, setShowAICreator] = useState<boolean>(false);

  // Interactive Challenges and Q&A states
  const [activeQAIndex, setActiveQAIndex] = useState<number>(0);
  const [activeQASubTab, setActiveQASubTab] = useState<'short' | 'why' | 'example'>('short');
  const [quizSelection, setQuizSelection] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [hoveredSymbolNodeId, setHoveredSymbolNodeId] = useState<string | null>(null);

  // Sync state with HTML dir & lang attributes
  useEffect(() => {
    document.documentElement.dir = 'ltr'; // Lock global document viewport scrollbar strictly on the right side
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.classList.add('rtl-mode');
    } else {
      document.documentElement.classList.remove('rtl-mode');
    }
  }, [lang]);

  // Autoclear toast timer
  useEffect(() => {
    if (toastMsg) {
      const t = setTimeout(() => setToastMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMsg]);

  // Load preset topic on first render or populate default parameters when active topic changes
  useEffect(() => {
    if (activeTopic) {
      const defaults: Record<string, number> = {};
      activeTopic.simulation.params.forEach(p => {
        defaults[p.id] = p.defaultValue;
      });
      setSimParams(defaults);
      setCurrentStep(0);
      setSelectedNodeId(null);

      // Reset interactive state
      setActiveQAIndex(0);
      setActiveQASubTab('short');
      setQuizSelection(null);
      setQuizSubmitted(false);
    }
  }, [activeTopic]);

  const handleSelectTopic = (topic: Topic) => {
    setActiveTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHub = () => {
    setActiveTopic(null);
    setSelectedNodeId(null);
  };

  const handleAddQuery = (newq: string) => {
    if (!recentQueries.includes(newq)) {
      setRecentQueries(prev => [newq, ...prev].slice(0, 5));
    }
  };

  const localizedActiveTopic = activeTopic ? localizeTopic(activeTopic, lang) : null;

  // Identify nodes that are highlighted in the current causal step or hovered in the formula
  const highlightedNodeIds = [
    ...(localizedActiveTopic?.steps[currentStep]?.highlightNodes || []),
    ...(hoveredSymbolNodeId ? [hoveredSymbolNodeId] : [])
  ];

  // Icon mapping helper for categories (Sophisticated Dark Gold/Amber themed colors)
  const getTopicIcon = (name: string) => {
    switch (name) {
      case 'Plane': return <Plane className="text-amber-500" size={18} />;
      case 'Zap': return <Zap className="text-amber-500" size={18} />;
      case 'Globe': return <Globe className="text-amber-500" size={18} />;
      case 'Bridge': return <Layers className="text-amber-500" size={18} />;
      case 'Orbit': return <Orbit className="text-amber-500" size={18} />;
      case 'Sparkles': return <Sparkles className="text-amber-500" size={18} />;
      case 'Navigation': return <Navigation className="text-amber-500" size={18} />;
      case 'Map': return <Map className="text-amber-500" size={18} />;
      default: return <Compass className="text-amber-500" size={18} />;
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#050507] text-[#D1D1D1] flex flex-col font-sans" 
      id="mechanica_app_root"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      
      {/* Visual Navigation Header */}
      <header className="border-b border-white/10 bg-[#050507]/95 backdrop-blur sticky top-0 z-40 transition-all" id="app_header">
        <div className="w-[94%] sm:w-[90%] md:w-[85%] mx-auto px-4 md:px-6 h-16 flex items-center justify-between" dir="ltr">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToHub} id="brand_logo_title">
            <svg className="h-8 w-8 text-amber-500 animate-[pulse_4s_ease-in-out_infinite]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer axis ring with notches (gear-like structure) */}
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 6" className="animate-[spin_40s_linear_infinite]" style={{ transformOrigin: 'center' }} />
              <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="1" strokeDasharray="12 4" className="opacity-40" />
              
              {/* Absolute center axis hub */}
              <circle cx="50" cy="50" r="3.5" fill="currentColor" />
              
              {/* Radial axis guidelines */}
              <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />
              <line x1="12" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="opacity-30" />

              {/* Geometric M-structure integrated with the axes */}
              <path d="M 28 68 L 28 32 L 50 54 L 72 32 L 72 68" stroke="currentColor" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              
              {/* Accent dots at key intersections */}
              <circle cx="28" cy="32" r="2.5" fill="currentColor" />
              <circle cx="72" cy="32" r="2.5" fill="currentColor" />
            </svg>
            <div className="flex flex-col">
              <span className="text-xs font-serif uppercase tracking-[0.2em] text-white leading-none">
                {UI_STRINGS[lang].appName}
              </span>
              <span className="text-[7.5px] font-mono tracking-widest text-[#D1D1D1]/50 uppercase mt-1 hidden sm:inline">
                {UI_STRINGS[lang].appSlogan}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(prev => prev === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-mono tracking-wider bg-black border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-500 px-2 sm:px-3 py-1.5 sm:py-2 transition-all cursor-pointer"
              id="language_switcher_btn"
            >
              <Globe size={11} className="animate-spin-slow" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <button
              onClick={() => {
                setShowAICreator(!showAICreator);
                if (activeTopic) handleBackToHub();
              }}
              className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-widest px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-none transition-all duration-300 border cursor-pointer ${
                showAICreator 
                  ? 'bg-amber-500 text-black border-amber-500' 
                  : 'bg-black border-white/10 hover:border-amber-500/50 text-[#D1D1D1]'
              }`}
            >
              {UI_STRINGS[lang].systemSynthesizer}
            </button>
          </div>
        </div>
      </header>

      {/* Main Exploration Stage Container */}
      <main className="flex-1 w-[94%] sm:w-[90%] md:w-[85%] mx-auto px-4 md:px-6 py-6" id="app_main">
        {localizedActiveTopic ? (
          /* WORKSPACE VIEW: Single-screen interactive deconstruction of a topic */
          <div className="flex flex-col gap-6" id="topic_active_workspace">
            
            {/* Topic Header & Category info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#08080A] p-6 rounded-none border border-white/10" id="topic_status_bar">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToHub}
                  className="p-2.5 rounded-none border border-white/10 hover:border-amber-500/50 hover:bg-white/5 text-[#D1D1D1]/60 hover:text-white transition-all cursor-pointer"
                  title={lang === 'ar' ? 'العودة إلى الكتالوج' : 'Back to Catalog'}
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] uppercase font-mono tracking-widest text-amber-500">
                      {localizedActiveTopic.category}
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest flex items-center gap-1">
                      <Sparkle size={10} className="animate-spin-slow" />
                      {UI_STRINGS[lang].deconstructionModelActive}
                    </span>
                  </div>
                  <h1 className="text-sm md:text-base font-serif italic text-white tracking-widest uppercase mt-0.5">
                    {localizedActiveTopic.title}
                  </h1>
                </div>
              </div>
              
              <p className="text-xs text-[#D1D1D1] font-light max-w-md leading-relaxed select-text text-start">
                {localizedActiveTopic.summary}
              </p>
            </div>

            {/* PRIMARY DUAL PANEL STAGE: Blueprint vs Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 xl:gap-20" id="primary_interactive_row">
              {/* Left Panel: Visual Blueprint Diagram mapping */}
              <div className="bg-[#08080A] border border-white/10 p-6 md:p-8 rounded-none flex flex-col gap-5 shadow-xl text-start">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <BookOpen size={15} className="text-amber-500" />
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                    {UI_STRINGS[lang].blueprintLayer}
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center min-h-[360px]" id="blueprint_container">
                  <VisualBlueprint
                    nodes={localizedActiveTopic.nodes}
                    connections={localizedActiveTopic.connections}
                    activeNodeIds={highlightedNodeIds}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={setSelectedNodeId}
                    lang={lang}
                  />
                </div>
              </div>

              {/* Right Panel: Live Physics/Canvas Visualizer math loops */}
              <div className="bg-[#08080A] border border-white/10 p-6 md:p-8 rounded-none flex flex-col gap-5 shadow-xl text-start">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sliders size={15} className="text-amber-500" />
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                    {UI_STRINGS[lang].simulatorEngine}
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center min-h-[360px]" id="simulator_container">
                  <InteractiveSimulator
                    type={localizedActiveTopic.simulation.visualizerType || 'dynamic-generator'}
                    params={simParams}
                    activeStepNodeIds={highlightedNodeIds}
                    lang={lang}
                    visualTypeHint={(localizedActiveTopic.simulation as any).visualTypeHint}
                  />
                </div>
              </div>
            </div>

            {/* SECONDARY INTERACTIVE ROW: Controllers + Causality walk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 xl:gap-20" id="secondary_interactive_row">
              {/* Left: Dynamic range controls for physics simulation */}
              <div className="bg-[#08080A] border border-white/10 p-6 md:p-8 rounded-none flex flex-col gap-5 shadow-xl text-start" id="parameter_sliders_box">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Settings size={15} className="text-amber-500 animate-spin-slow" />
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                    {UI_STRINGS[lang].simulationControlPanel}
                  </h3>
                </div>

                <div className="flex flex-col gap-5">
                  {localizedActiveTopic.simulation.params.map(param => (
                    <div key={param.id} className="flex flex-col gap-1.5" id={`slider_group_${param.id}`}>
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-medium text-[#D1D1D1] uppercase tracking-wide text-[10px]">{param.label}</label>
                        <span className="font-mono bg-black px-2 py-0.5 rounded-none text-amber-500 border border-white/10 text-[9px]">
                          {(simParams[param.id] ?? param.defaultValue).toLocaleString()} {param.unit}
                        </span>
                      </div>
                      
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={simParams[param.id] ?? param.defaultValue}
                        onChange={(e) => setSimParams(prev => ({
                          ...prev,
                          [param.id]: parseFloat(e.target.value)
                        }))}
                        className="w-full h-1 bg-black rounded-none cursor-pointer accent-amber-500"
                        id={`simulator_slider_${param.id}`}
                      />
                      
                      <span className="text-[9px] text-[#D1D1D1]/50 font-light italic">
                        {param.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Steps progression timeliner */}
              <StepExploration
                steps={localizedActiveTopic.steps}
                currentStepIndex={currentStep}
                onStepChange={setCurrentStep}
                lang={lang}
              />
            </div>

            {/* BRAND NEW: Advanced Physics & Diagnostic Labs row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 xl:gap-20" id="advanced_physics_diagnostic_row">
              <InteractiveFormulaBreakdown
                topicId={activeTopic.id}
                lang={lang}
                onHoverSymbol={setHoveredSymbolNodeId}
              />
              <DiagnosticFailureSimulation
                topicId={activeTopic.id}
                lang={lang}
                simParams={simParams}
                activeTopic={activeTopic}
                onTriggerFault={(faultParams) => {
                  setSimParams(faultParams);
                  setToastMsg(
                    lang === 'ar'
                      ? '⚠️ تم تفعيل العطل الفيزيائي ومحاكاة الطوارئ بالكامل!'
                      : '⚠️ Critical system failure has been injected into active workspace!'
                  );
                }}
              />
            </div>

            {/* BRAND NEW: Comprehensive Academic Lecture Notes and Deep Theory Section */}
            <div id="deep_academic_theory_row">
              <TheoreticalLectureNotes
                topicId={activeTopic.id}
                lang={lang}
                customTheory={activeTopic.theory}
              />
            </div>

            {/* FLOATING SYSTEM TOAST FOR PARAMETER CHANGES */}
            {toastMsg && (
              <div className="fixed bottom-6 left-6 z-[999] bg-[#0c0a09] border-2 border-amber-500 p-4 rounded-none shadow-2xl flex items-center gap-3 animate-bounce max-w-sm text-start" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                <Sparkle className="text-amber-500 shrink-0 animate-spin-slow" size={20} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500">{UI_STRINGS[lang].systemStateModification}</span>
                  <p className="text-xs text-white leading-relaxed">{toastMsg}</p>
                </div>
              </div>
            )}

            {/* RETAINING SYSTEM VALUE ROW: Real-life & Q&A Curiosity loops */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 xl:gap-20" id="knowledge_retention_row">
              
              {/* BRAND NEW: Interactive Challenge Section (Localized Quiz) */}
              {INTERACTIVE_QUIZZES[activeTopic.id] && (
                <div className="bg-[#08080A] border border-amber-500/20 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start group relative overflow-hidden" id="interactive_challenge_box">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-500" />
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                        {UI_STRINGS[lang].interactiveChallenge}
                      </h3>
                    </div>
                    <span className="text-[8px] font-mono text-amber-500/70 border border-amber-500/30 px-1.5 py-0.5 uppercase">
                      {UI_STRINGS[lang].inquiry}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-serif italic text-white leading-relaxed">
                      {lang === 'ar' ? INTERACTIVE_QUIZZES[activeTopic.id].question.ar : INTERACTIVE_QUIZZES[activeTopic.id].question.en}
                    </p>

                    <div className="flex flex-col gap-2.5 mt-2">
                      {(lang === 'ar' ? INTERACTIVE_QUIZZES[activeTopic.id].options.ar : INTERACTIVE_QUIZZES[activeTopic.id].options.en).map((opt, i) => {
                        const isSelected = quizSelection === i;
                        const isCorrect = i === INTERACTIVE_QUIZZES[activeTopic.id].correctIndex;
                        let btnBg = 'bg-black border-white/10 text-[#cbd5e1] hover:border-amber-400/40';
                        if (quizSubmitted) {
                          if (isSelected) {
                            btnBg = isCorrect 
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-medium' 
                              : 'bg-red-500/10 border-red-500 text-red-400';
                          } else if (isCorrect) {
                            btnBg = 'bg-emerald-500/5 border-emerald-500/40 text-emerald-500';
                          } else {
                            btnBg = 'bg-black border-white/5 opacity-40';
                          }
                        } else if (isSelected) {
                          btnBg = 'bg-amber-500/10 border-amber-500 text-amber-400 font-medium';
                        }

                        return (
                          <button
                            key={i}
                            disabled={quizSubmitted}
                            onClick={() => setQuizSelection(i)}
                            className={`w-full p-3 text-xs text-start border transition-all duration-200 cursor-pointer rounded-none ${btnBg}`}
                          >
                            <span className="inline-block w-4 font-mono text-amber-500 mr-2 rtl:mr-0 rtl:ml-2">
                              {['A', 'B', 'C', 'D'][i]}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => quizSelection !== null && setQuizSubmitted(true)}
                        disabled={quizSelection === null}
                        className={`mt-3 py-3 w-full font-mono text-[10px] uppercase tracking-wider transition-all rounded-none ${
                          quizSelection !== null
                            ? 'bg-amber-500 text-black hover:bg-amber-400 font-bold cursor-pointer'
                            : 'bg-white/5 text-white/25 border border-white/5 cursor-not-allowed'
                        }`}
                      >
                        {UI_STRINGS[lang].submitAnswer}
                      </button>
                    ) : (
                      <div className="mt-3 p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-2 animate-fade-in text-start">
                        <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          quizSelection === INTERACTIVE_QUIZZES[activeTopic.id].correctIndex ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {quizSelection === INTERACTIVE_QUIZZES[activeTopic.id].correctIndex 
                            ? UI_STRINGS[lang].absolutelyCorrect 
                            : UI_STRINGS[lang].incorrectOutcome}
                        </span>
                        <p className="text-xs text-[#cbd5e1] font-light leading-relaxed">
                          {lang === 'ar' ? INTERACTIVE_QUIZZES[activeTopic.id].explanation.ar : INTERACTIVE_QUIZZES[activeTopic.id].explanation.en}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CURION_QA_BOX WITH DYNAMIC DESIGN RULE SUPPORT */}
              <div className="bg-[#08080A] border border-white/10 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start" id="curiosity_qa_box">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle size={15} className="text-amber-500" />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                      {UI_STRINGS[lang].curiosityDrill}
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 px-1 rounded-none border border-amber-500/20">
                    {UI_STRINGS[lang].cognitiveDesigned}
                  </span>
                </div>

                {/* Left/Right splitting in Q&A */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 min-h-[220px]">
                  
                  {/* Left checklist of questions inside Q&A */}
                  <div className="md:col-span-5 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-white/5 pr-0 md:pr-4 rtl:pr-0 rtl:pl-4 rtl:border-r-0 rtl:border-l">
                    {localizedActiveTopic.qAndA?.map((qa, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveQAIndex(index);
                          setActiveQASubTab('short');
                        }}
                        className={`p-3 text-xs text-start transition-all cursor-pointer rounded-none border ${
                          activeQAIndex === index 
                            ? 'bg-amber-500/10 border-amber-500 text-white font-medium shadow-md' 
                            : 'bg-black/30 border-white/5 text-[#cbd5e1]/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="font-serif italic text-amber-500 mr-1 rtl:mr-0 rtl:ml-1">
                          Q{index + 1}:
                        </span>
                        {qa.question.length > 50 ? qa.question.slice(0, 47) + '...' : qa.question}
                      </button>
                    ))}
                  </div>

                  {/* Right response details panel matching design requirements */}
                  <div className="md:col-span-7 flex flex-col gap-4 justify-between font-sans">
                    {localizedActiveTopic.qAndA?.[activeQAIndex] && (() => {
                      const activeQA = localizedActiveTopic.qAndA[activeQAIndex];
                      
                      return (
                        <div className="flex flex-col gap-3 h-full justify-between">
                          <div className="flex flex-col gap-2.5">
                            {/* Question Title */}
                            <h4 className="text-xs font-serif italic text-amber-500 leading-snug">
                              {activeQA.question}
                            </h4>

                            {/* Response details rendering block */}
                            {activeQASubTab === 'short' && (
                              <div className="text-xs text-[#cbd5e1] font-light leading-relaxed pl-3 border-l border-[#f59e0b]/20 rtl:pl-0 rtl:pr-3 rtl:border-l-0 rtl:border-r animate-fade-in text-start">
                                <span className="text-[10px] font-mono tracking-wider font-semibold text-amber-500 block mb-0.5 uppercase">
                                  {UI_STRINGS[lang].directSummaryLabel}
                                </span>
                                {activeQA.answer}
                              </div>
                            )}

                            {activeQASubTab === 'why' && (
                              <div className="text-xs text-[#cbd5e1] font-light leading-relaxed pl-3 border-l border-amber-500/30 rtl:pl-0 rtl:pr-3 rtl:border-l-0 rtl:border-r animate-fade-in text-start bg-amber-500/5 p-3">
                                <span className="text-[10px] font-mono tracking-wider font-semibold text-amber-400 block mb-1 uppercase">
                                  {UI_STRINGS[lang].deepCausalAnalysisLabel}
                                </span>
                                {activeQA.why || UI_STRINGS[lang].defaultWhyFallback}
                              </div>
                            )}

                            {activeQASubTab === 'example' && (
                              <div className="text-xs text-[#cbd5e1] font-light leading-relaxed pl-3 border-l border-emerald-500/30 rtl:pl-0 rtl:pr-3 rtl:border-l-0 rtl:border-r animate-fade-in text-start bg-emerald-500/5 p-3">
                                <span className="text-[10px] font-mono tracking-wider font-semibold text-emerald-400 block mb-1 uppercase">
                                  {UI_STRINGS[lang].realWorldScenariosLabel}
                                </span>
                                {activeQA.example || UI_STRINGS[lang].defaultExampleFallback}
                              </div>
                            )}
                          </div>

                          {/* Interactive Sub-tab action controls linking to simulation and deep analysis */}
                          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-3">
                            <button
                              onClick={() => setActiveQASubTab('short')}
                              className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none border transition-all cursor-pointer ${
                                activeQASubTab === 'short' 
                                  ? 'bg-amber-500 text-black border-amber-500' 
                                  : 'bg-black border-white/10 text-white hover:bg-white/5'
                              }`}
                            >
                              {UI_STRINGS[lang].summaryTab}
                            </button>

                            <button
                              onClick={() => setActiveQASubTab('why')}
                              className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none border transition-all cursor-pointer ${
                                activeQASubTab === 'why' 
                                  ? 'bg-amber-500 text-black border-amber-500' 
                                  : 'bg-black border-white/10 text-white hover:bg-white/5'
                              }`}
                            >
                              {UI_STRINGS[lang].whyTab}
                            </button>

                            <button
                              onClick={() => setActiveQASubTab('example')}
                              className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none border transition-all cursor-pointer ${
                                activeQASubTab === 'example' 
                                  ? 'bg-amber-500 text-black border-amber-500' 
                                  : 'bg-black border-white/10 text-white hover:bg-white/5'
                              }`}
                            >
                              {UI_STRINGS[lang].showExampleTab}
                            </button>

                            {/* Core Requirement No 5: Try It Yourself (Connects with Simulation Parameters) */}
                            <button
                              onClick={() => {
                                // Trigger actual state modification in simulation
                                if (activeQA.tryIt) {
                                  setSimParams(prev => ({
                                    ...prev,
                                    [activeQA.tryIt.paramId]: activeQA.tryIt.value
                                  }));
                                  const paramName = activeQA.tryIt.paramId === 'load' 
                                    ? (lang === 'ar' ? 'الحمل الكهربائي' : 'load') 
                                    : activeQA.tryIt.paramId;
                                  setToastMsg(
                                    UI_STRINGS[lang].toastCustomParamChanged
                                      .replace('{param}', paramName)
                                      .replace('{value}', activeQA.tryIt.value.toString())
                                  );
                                } else {
                                  // fallback trigger to alter first parameter
                                  const firstParam = activeTopic.simulation.params[0];
                                  if (firstParam) {
                                    setSimParams(prev => ({
                                      ...prev,
                                      [firstParam.id]: firstParam.max
                                    }));
                                    const paramLabel = lang === 'ar' ? (firstParam.label_ar || firstParam.label) : firstParam.label;
                                    setToastMsg(
                                      UI_STRINGS[lang].toastInteractiveSpikeParam
                                        .replace('{param}', paramLabel)
                                    );
                                  }
                                }
                              }}
                              className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:border-amber-400 cursor-pointer animate-pulse"
                            >
                              {UI_STRINGS[lang].tryItYourself}
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>
              </div>

              {/* Real World Applications list */}
              <div className="bg-[#08080A] border border-white/10 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start" id="real_world_apps_box">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Lightbulb size={15} className="text-amber-500" />
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                    {UI_STRINGS[lang].applicationsTitle}
                  </h3>
                </div>

                <ul className="flex flex-col gap-3">
                  {localizedActiveTopic.realWorldApplications?.map((app, index) => (
                    <li key={index} className="text-xs text-[#D1D1D1] flex items-start gap-3 leading-relaxed">
                      <span className="flex h-5 w-5 items-center justify-center rounded-none bg-amber-500/5 text-amber-500 text-[10px] font-mono shrink-0 border border-amber-500/20">
                        {index + 1}
                      </span>
                      <span className="font-light">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MENTAL MODEL COMPARATIVE BLOCK (SPECIFICALLY DEMANDED FOR HOUSEHOLD INFRASTRUCT) */}
              {activeTopic.id === 'electricity-home' && (
                <div className="bg-[#08080A] border border-amber-500/15 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start lg:col-span-2 relative overflow-hidden" id="mental_model_analogy_box">
                  {/* Decorative glowing background mesh */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                    <Sparkle size={15} className="text-amber-500 " />
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                      {UI_STRINGS[lang].mentalModelAnalogy}
                    </h3>
                  </div>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed">
                    {UI_STRINGS[lang].mentalModelIntro}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                    <div className="bg-white/5 border border-white/5 p-4 flex flex-col gap-1.5 rounded-none text-start">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold">
                        {UI_STRINGS[lang].tankTitle}
                      </span>
                      <h4 className="text-xs text-white font-medium">
                        {UI_STRINGS[lang].voltageGpmTitle}
                      </h4>
                      <p className="text-[11px] text-[#cbd5e1]/75 leading-relaxed">
                        {UI_STRINGS[lang].voltageGpmDesc}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 flex flex-col gap-1.5 rounded-none text-start">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold">
                        {UI_STRINGS[lang].gpmFlowRateTitle}
                      </span>
                      <h4 className="text-xs text-white font-medium">
                        {UI_STRINGS[lang].currentAmpsTitle}
                      </h4>
                      <p className="text-[11px] text-[#cbd5e1]/75 leading-relaxed">
                        {UI_STRINGS[lang].currentAmpsDesc}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 flex flex-col gap-1.5 rounded-none text-start">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold">
                        {UI_STRINGS[lang].pipeFrictionTitle}
                      </span>
                      <h4 className="text-xs text-white font-medium">
                        {UI_STRINGS[lang].resistanceOhmsTitle}
                      </h4>
                      <p className="text-[11px] text-[#cbd5e1]/75 leading-relaxed">
                        {UI_STRINGS[lang].resistanceOhmsDesc}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 flex flex-col gap-1.5 rounded-none text-start">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500 font-bold">
                        {UI_STRINGS[lang].irrigationTapTitle}
                      </span>
                      <h4 className="text-xs text-white font-medium">
                        {UI_STRINGS[lang].applianceLoadTitle}
                      </h4>
                      <p className="text-[11px] text-[#cbd5e1]/75 leading-relaxed">
                        {UI_STRINGS[lang].applianceLoadDesc}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CORE REQUIREMENT NO 8: ONE-SCREEN QUICK SUMMARY PANEL */}
              {(ONE_SCREEN_SUMMARIES[activeTopic.id] || activeTopic.theory) && (
                <div className="bg-[#08080A] border border-white/10 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start lg:col-span-2 relative overflow-hidden" id="one_screen_summary_box">
                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} className="text-amber-500" />
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
                        {UI_STRINGS[lang].oneScreenSummaryTitle}
                      </h3>
                    </div>
                    <span className="text-[8px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 uppercase border border-amber-500/20">
                      {UI_STRINGS[lang].capsule}
                    </span>
                  </div>

                  {(() => {
                    const preset = ONE_SCREEN_SUMMARIES[activeTopic.id];
                    let bullets: string[] = [];
                    if (preset) {
                      bullets = lang === 'ar' ? preset.bullets.ar : preset.bullets.en;
                    } else if (activeTopic.theory) {
                      const t = activeTopic.theory;
                      bullets = lang === 'ar'
                        ? [t.thesisAr, t.mathAr, t.historyAr, t.challengeAr]
                        : [t.thesisEn, t.mathEn, t.historyEn, t.challengeEn];
                    }
                    if (!bullets || bullets.length === 0) return null;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 font-sans">
                        {bullets.map((bullet, idx) => (
                          <div key={idx} className="bg-white/5 border-l-2 border-amber-500 p-4 rounded-none flex flex-col gap-2 relative">
                            <span className="text-[14px] font-mono font-bold text-amber-500/60 block">
                              0{idx + 1}
                            </span>
                            <p className="text-xs text-[#cbd5e1] font-light leading-relaxed line-clamp-4 hover:line-clamp-none transition-all duration-300">
                              {bullet}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>

          </div>
        ) : showAICreator ? (
          /* SHOW CUSTOM BLUEPRINTS SCRATCHPAD ONLY */
          <div className="flex flex-col gap-6 md:max-w-2xl mx-auto" id="custom_scratchpad_wrapper">
            <div className="flex justify-start">
              <button
                onClick={() => setShowAICreator(false)}
                className="text-[9px] font-mono uppercase tracking-widest text-[#D1D1D1] hover:text-white flex items-center gap-1.5 border border-white/10 px-4 py-2 rounded-none hover:bg-white/5 transition-all cursor-pointer"
              >
                &larr; {UI_STRINGS[lang].backToCatalogText}
              </button>
            </div>
            <AIPoweredExploration
              onSuggestTopic={handleSelectTopic}
              recentQueries={recentQueries}
              onAddQuery={handleAddQuery}
              lang={lang}
            />
          </div>
        ) : (
          /* CATALOG HOMESTEP: Exploration Jumbotron & Curated presets list grid */
          <div className="flex flex-col gap-10" id="explorer_hub_jumbo_frame">
            <HeroState 
              onSelectTopic={handleSelectTopic} 
              onExploreCustom={() => setShowAICreator(true)} 
              lang={lang}
            />

            {/* Custom builder preview right below the preset list */}
            <div className="bg-gradient-to-r from-black to-[#08080A] border border-white/10 p-8 rounded-none flex flex-col md:flex-row gap-6 justify-between items-start md:items-center shadow-lg text-start" id="concept_quick_cta">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[8px] font-mono tracking-widest text-amber-500 uppercase font-bold">
                  {UI_STRINGS[lang].unlimitedDynamicTitle}
                </span>
                <h2 className="text-sm font-serif uppercase tracking-widest text-white mt-1">
                  {UI_STRINGS[lang].designCustomTitle}
                </h2>
                <p className="text-xs text-[#D1D1D1] font-light leading-relaxed max-w-xl">
                  {UI_STRINGS[lang].designCustomDesc}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowAICreator(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase tracking-wider px-6 py-3.5 rounded-none flex items-center gap-2 shadow-xl transition-all cursor-pointer"
              >
                {UI_STRINGS[lang].synthesisButton}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Humble Elegant Footer page bar details */}
      <footer className="border-t border-white/10 bg-[#050507] py-8 mt-16" id="app_footer" dir="ltr">
        <div className="w-[94%] sm:w-[90%] md:w-[85%] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <div className="flex items-center gap-1.5 font-sans text-[10px] tracking-wide text-[#D1D1D1]/60">
            <span>{UI_STRINGS['en'].copyright} <strong className="text-amber-500">USEF ALY</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#D1D1D1]/40">
              {UI_STRINGS['en'].footerText}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
