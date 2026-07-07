import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface FormulaSymbol {
  symbol: string;
  nameEn: string;
  nameAr: string;
  nodeId: string;
  descEn: string;
  descAr: string;
}

interface FormulaData {
  titleEn: string;
  titleAr: string;
  equation: string;
  symbols: FormulaSymbol[];
}

const FORMULA_DATABASE: Record<string, FormulaData> = {
  'airplane-flight': {
    titleEn: 'Governing Lift Formula',
    titleAr: 'معادلة الرفع الفيزيائية الحاكمة',
    equation: 'L = ½ · ρ · v² · S · CL',
    symbols: [
      {
        symbol: 'L',
        nameEn: 'Lift Force',
        nameAr: 'قوة الرفع',
        nodeId: 'trailing',
        descEn: 'The net upward aerodynamic force lifting the aircraft against gravity.',
        descAr: 'صافي القوة الديناميكية الهوائية الصاعدة التي ترفع الهيكل متغلبة على الوزن.'
      },
      {
        symbol: 'ρ',
        nameEn: 'Air Density',
        nameAr: 'كثافة الهواء',
        nodeId: 'intake',
        descEn: 'Mass of air molecules per unit volume, which provides substance for the wings.',
        descAr: 'كتلة جزيئات الهواء في وحدة الحجم الجوي، والتي تعطي مادة للرفع.'
      },
      {
        symbol: 'v²',
        nameEn: 'Airspeed (Squared)',
        nameAr: 'مربع السرعة الجوية',
        nodeId: 'engine',
        descEn: 'The forward velocity of the plane relative to the air. Lift increases quadratically with speed.',
        descAr: 'السرعة الأمامية للطائرة بالنسبة للرياح. يزداد الرفع بشكل تربيعي تضاعفي مع السرعة.'
      },
      {
        symbol: 'S',
        nameEn: 'Wing Surface Area',
        nameAr: 'مساحة سطح الجناح',
        nodeId: 'upper',
        descEn: 'The total planform area of the wing airfoil generating lift pressure.',
        descAr: 'إجمالي مساحة السطح الإيروديناميكي للجناح المسؤول عن توليد حقول الضغط.'
      },
      {
        symbol: 'CL',
        nameEn: 'Lift Coefficient',
        nameAr: 'معامل الرفع',
        nodeId: 'lower',
        descEn: 'Calculated efficiency coefficient determined by wing pitch (Angle of Attack) and curvature.',
        descAr: 'معامل الكفاءة الميكانيكية المحدد بواسطة زاوية ميل الجناح وانحنائه الهندسي.'
      }
    ]
  },
  'electricity-flow': {
    titleEn: "Ohm's Circuit Law",
    titleAr: 'قانون أوم للدائرة الكهربائية',
    equation: 'I = V / R',
    symbols: [
      {
        symbol: 'I',
        nameEn: 'Electric Current',
        nameAr: 'التيار الكهربائي',
        nodeId: 'wire',
        descEn: 'The flow rate of electric charge (electrons) running through the conductive path.',
        descAr: 'معدل سريان الشحنات الكهربائية وحركة الإلكترونات عبر الموصل النحاسي.'
      },
      {
        symbol: 'V',
        nameEn: 'Voltage (EMF)',
        nameAr: 'الجهد الكهربائي (القوة الدافعة)',
        nodeId: 'battery',
        descEn: 'The chemical potential difference or electromotive force driving electron pressure.',
        descAr: 'فارق الشحن الكيميائي الكامن أو القوة الدافعة الضاغطة لتسيير التيار.'
      },
      {
        symbol: 'R',
        nameEn: 'Resistance',
        nameAr: 'المقاومة الكلية',
        nodeId: 'bulb',
        descEn: 'The opposition to electrical flow, converting electron energy to heat and light friction.',
        descAr: 'الممانعة المادية لمرور التيار والتي تشتت الطاقة مصطدمة بالذرات ومفرزة لضوء وحرارة.'
      }
    ]
  },
  'internet-packets': {
    titleEn: 'Total Network Latency Math',
    titleAr: 'حساب زمن التأخير الكلي في الشبكة',
    equation: 'T = D / S + d_congestion',
    symbols: [
      {
        symbol: 'T',
        nameEn: 'Total Transmission Latency',
        nameAr: 'الزمن الكلي للنقل',
        nodeId: 'server',
        descEn: 'The end-to-end time required for all packets to reach the destination server.',
        descAr: 'الوقت الإجمالي المتطلب لوصول كامل الحزم المجزأة من العميل للمستضيف بنجاح.'
      },
      {
        symbol: 'D',
        nameEn: 'Packet Slicing Size (MSS)',
        nameAr: 'حجم حزم البيانات',
        nodeId: 'browser',
        descEn: 'Size of individual data packet slices encoded with IP headers.',
        descAr: 'حجم القطع واللفائف الإلكترونية المجزأة والمرفقة بعناوين ترويسة بروتوكول الإنترنت.'
      },
      {
        symbol: 'S',
        nameEn: 'Bandwidth Speed',
        nameAr: 'سرعة وعرض النطاق',
        nodeId: 'router1',
        descEn: 'Raw transmission capacity and processing throughput of local gateways.',
        descAr: 'القدرة الاستيعابية وسرعة التوصيل البصري للبوابة المحلية ومزود الخدمة.'
      },
      {
        symbol: 'd_congestion',
        nameEn: 'Congestion Delay',
        nameAr: 'تأخير الازدحام المروري',
        nodeId: 'router2',
        descEn: 'Delay caused by queued packet traffic inside intermediate backbone transit nodes.',
        descAr: 'زمن الانتظار والاحتجاز في طوابير الحزم بفعل الازدحام والضغط في محولات المسار الخلفي.'
      }
    ]
  },
  'bridge-forces': {
    titleEn: 'Main Cable Tension Formula',
    titleAr: 'قانون شد كابلات التعليق الهيكلية',
    equation: 'Tc = (W · L) / (8 · d)',
    symbols: [
      {
        symbol: 'Tc',
        nameEn: 'Cable Tension',
        nameAr: 'شد كابل التعليق',
        nodeId: 'cable',
        descEn: 'Tensile pulling force acting along the main curved suspension steel lines.',
        descAr: 'قوى الشد والتحميل الأفقي والرأسي السارية بطول خط الكابل الفولاذي المقوس الرئيسي.'
      },
      {
        symbol: 'W',
        nameEn: 'Deck Traffic Load',
        nameAr: 'وزن التحميل والسيارات',
        nodeId: 'deck',
        descEn: 'Static road bed weight and dynamic forces of passing vehicle weight loads.',
        descAr: 'الوزن الميت لهيكل الجسر والأحمال الحية الضاغطة العابرة للسيارات والحافلات.'
      },
      {
        symbol: 'L',
        nameEn: 'Bridge Span Length',
        nameAr: 'طول المجاز الأفقي',
        nodeId: 'tower',
        descEn: 'The physical horizontal distance between primary concrete support towers.',
        descAr: 'المسافة الأفقية الفاصلة بين الأعمدة الأساسية وبوابات الضغط الصخري.'
      },
      {
        symbol: 'd',
        nameEn: 'Catenary Sag Depth',
        nameAr: 'عمق تدلي الكابل',
        nodeId: 'hangers',
        descEn: 'The vertical curvature depth or droop of the main cables. Higher sag lowers cable tension.',
        descAr: 'العمق الرأسي لانحناء الكابل. زيادة الانحناء يقلل قوى الشد المحورية على الحساب العمودي.'
      }
    ]
  },
  'satellite-orbit': {
    titleEn: 'Tangential Orbital Velocity',
    titleAr: 'قانون السرعة المدارية المماسية',
    equation: 'v = √(G · M / r)',
    symbols: [
      {
        symbol: 'v',
        nameEn: 'Orbital Velocity',
        nameAr: 'السرعة المدارية المماسية',
        nodeId: 'velocity',
        descEn: 'Tangential horizontal speed needed to match Earth\'s curve and stay in orbit.',
        descAr: 'السرعة الأفقية الضرورية لمطابقة انحناء الأرض والبقاء معلقاً بالسقوط الحر دون تدمير.'
      },
      {
        symbol: 'G',
        nameEn: 'Gravitational Constant',
        nameAr: 'ثابت الجاذبية الكوني العام',
        nodeId: 'gravity',
        descEn: 'Universal constant defining gravitational attraction strength.',
        descAr: 'ثابت فيزيائي كوني يصف قوى الترابط والجاذبية للأجسام والكتل في الفضاء.'
      },
      {
        symbol: 'M',
        nameEn: 'Planet Mass',
        nameAr: 'كتلة كوكب الأرض',
        nodeId: 'gravity',
        descEn: 'The mass of the central planet generating the gravitational acceleration field.',
        descAr: 'كتلة الجرم السماوي الجاذب المسؤول عن تشكيل بئر الجاذبية المتسارعة.'
      },
      {
        symbol: 'r',
        nameEn: 'Orbital Radius (Altitude)',
        nameAr: 'نصف القطر المداري الكلي',
        nodeId: 'thruster',
        descEn: 'The radial distance from satellite to the center of Earth (Altitude + Earth radius).',
        descAr: 'المسافة الإجمالية لمركز الكوكب (الارتفاع فوق الغلاف + نصف القطر الصخري لغلاف الأرض).'
      }
    ]
  },
  'nuclear-reactor': {
    titleEn: 'Fission Core Heat Equation',
    titleAr: 'معادلة الحرارة الانشطارية بالقلب',
    equation: 'P = Nf · Ef · (1 - Cd)',
    symbols: [
      {
        symbol: 'P',
        nameEn: 'Thermal Power Generated',
        nameAr: 'القدرة الحرارية المتولدة',
        nodeId: 'coolant',
        descEn: 'Net thermal energy transferred to primary water coolant loop in megawatts.',
        descAr: 'الطاقة الحرارية الكلية المنتقلة لخط تدوير المياه الأولي بالميجاواط.'
      },
      {
        symbol: 'Nf',
        nameEn: 'Uranium Fission Rate',
        nameAr: 'معدل الانشطارات النووية',
        nodeId: 'core',
        descEn: 'The rate of uranium atoms split per second by neutron bombardment.',
        descAr: 'سرعة كسر وانشطار ذرات اليورانيوم في المفاعل تحت وابل قذائف النيوترونات الحرة.'
      },
      {
        symbol: 'Ef',
        nameEn: 'Energy released per Fission',
        nameAr: 'طاقة الانشطار الواحد',
        nodeId: 'core',
        descEn: 'Subatomic binding energy released per single atom fission event.',
        descAr: 'طاقة الترابط دون الذري المحررة فور كسر نواة ذرة يورانيوم واحدة.'
      },
      {
        symbol: 'Cd',
        nameEn: 'Control Rod Insertion Depth',
        nameAr: 'عمق إدراج قضبان التحكم',
        nodeId: 'rods',
        descEn: 'Percentage depth of cadmium absorption rods pushed inside active fuel channels.',
        descAr: 'عمق تغلغل قضبان الكادميوم بالقلب لامتصاص فائض النيوترونات وتثبيط التفاعل.'
      }
    ]
  },
  'submarine-diving': {
    titleEn: 'Archimedes Net Buoyancy Force',
    titleAr: 'قانون صافي قوة الطفو لأرخميدس',
    equation: 'Fb = ρ · V · g - M',
    symbols: [
      {
        symbol: 'Fb',
        nameEn: 'Net Buoyancy Force',
        nameAr: 'صافي قوة الطفو الرأسية',
        nodeId: 'ballast',
        descEn: 'Vertical force pushing submarine up. If negative, the sub sinks.',
        descAr: 'القوة الرأسية الدافعة لأعلى. إذا كانت القيمة سالبة، تكتسح الجاذبية وتغوص الغواصة لأسفل.'
      },
      {
        symbol: 'ρ',
        nameEn: 'Ocean Water Density',
        nameAr: 'كثافة مياه البحر',
        nodeId: 'seavalve',
        descEn: 'Seawater density factor, which is slightly higher than fresh river water.',
        descAr: 'كتلة السائل النوعية، وهي أعلى نسبياً في البحر المالح مقارنة بالأنهار العذبة.'
      },
      {
        symbol: 'V',
        nameEn: 'Submarine Displaced Volume',
        nameAr: 'حجم إزاحة الغواصة المائية',
        nodeId: 'ballast',
        descEn: 'The volume of seawater displaced by the hull of the submarine.',
        descAr: 'حجم الماء الإجمالي المزاح والمبعد بواسطة جدران وهيكل الغواصة الحديدي.'
      },
      {
        symbol: 'g',
        nameEn: 'Standard Gravity',
        nameAr: 'عجلة الجاذبية المعيارية',
        nodeId: 'seavalve',
        descEn: 'The gravitational acceleration pulls mass downwards (approx. 9.81 m/s²).',
        descAr: 'معدل تسارع الجاذبية في سحب كتل الأجسام نحو قاع الكوكب.'
      },
      {
        symbol: 'M',
        nameEn: 'Total Submarine Mass',
        nameAr: 'الكتلة الكلية للغواصة',
        nodeId: 'compressor',
        descEn: 'Mass of the submarine including steel structure, crew, and water flooded in ballast tanks.',
        descAr: 'كتلة البدن الحديدي والوقود مضافاً إليه حجم مياه الفيضان في صهاريج الموازنة.'
      }
    ]
  },
  'gps-trilateration': {
    titleEn: 'Radio Transit Distance calculation',
    titleAr: 'رياضيات مسافة عبور الإشارات اللاسلكية',
    equation: 'di = c · Δti',
    symbols: [
      {
        symbol: 'di',
        nameEn: 'Calculated Radial Distance',
        nameAr: 'المسافة المقدرة الممسوحة',
        nodeId: 'handset',
        descEn: 'The spatial sphere radius computed from satellite i coordinates to handset receiver.',
        descAr: 'نصف قطر دائرة التطابق والتموضع المحسوب من إحداثيات القمر الصادر حتى الهاتف.'
      },
      {
        symbol: 'c',
        nameEn: 'Constant Speed of Light',
        nameAr: 'سرعة انتشار الضوء الفائقة',
        nodeId: 'handset',
        descEn: 'Velocity of electromagnetic wave transmissions (approx. 299,792 km/s).',
        descAr: 'السرعة الثابتة لانتشار وعبور الموجات الكهرومغناطيسية واللاسلكية عبر الهواء والفضاء.'
      },
      {
        symbol: 'Δti',
        nameEn: 'Signal Transit Time Delay',
        nameAr: 'زمن تأخر واستغراق الإشارة',
        nodeId: 'satA',
        descEn: 'Precise nanosecond offset between satellite clock broadcast timestamp and device receipt.',
        descAr: 'الفارق الزمني الفائق بالنانوثانية بين لحظة بث الساعة الذرية للحزمة واستقبال الهاتف لها.'
      }
    ]
  },
  'electricity-home': {
    titleEn: 'Transmission Line Power Loss',
    titleAr: 'الفقد الحراري والكهربائي في خطوط النقل',
    equation: 'Pl = I² · R',
    symbols: [
      {
        symbol: 'Pl',
        nameEn: 'Power Loss (Thermal Waste)',
        nameAr: 'القدرة المشتتة والضائعة كحرارة',
        nodeId: 'transmission',
        descEn: 'Heat energy wasted in long-distance copper cables due to atomic electrical friction.',
        descAr: 'الطاقة المفقودة والمنبعثة للجو كحرارة داخل الموصلات النحاسية بفعل الاحتكاك الإلكتروني.'
      },
      {
        symbol: 'I²',
        nameEn: 'Transmission Current (Squared)',
        nameAr: 'مربع شدة التيار الساري',
        nodeId: 'conversion',
        descEn: 'Current intensity squared. High transmission voltage decreases current, lowering loss dramatically.',
        descAr: 'مربع حجم التدفق الإلكتروني. الجهد الفائق يقلص التيار لدرجات متدنية جداً فتنعدم خسائر الفقد.'
      },
      {
        symbol: 'R',
        nameEn: 'Cable Line Resistance',
        nameAr: 'المقاومة والممانعة للخطوط',
        nodeId: 'substation',
        descEn: 'The ohmic resistance of cross-country copper or aluminum cables stretching miles.',
        descAr: 'المقاومة الكلية لمعدن الكابل الممتد لعشرات الكيلومترات من محطات الرفع حتى المستهلك.'
      }
    ]
  }
};

interface InteractiveFormulaBreakdownProps {
  topicId: string;
  lang: 'en' | 'ar';
  onHoverSymbol: (nodeId: string | null) => void;
}

export default function InteractiveFormulaBreakdown({
  topicId,
  lang,
  onHoverSymbol
}: InteractiveFormulaBreakdownProps) {
  const formulaInfo = FORMULA_DATABASE[topicId];
  const [activeSymbol, setActiveSymbol] = useState<FormulaSymbol | null>(null);

  if (!formulaInfo) return null;

  // Split equation into tokens to render interactive items
  // We can match symbols in the equation and render them as hoverable spans
  const renderInteractiveEquation = () => {
    const eq = formulaInfo.equation;
    // Highlightable symbols list ordered by length to prevent partial matches
    const sortedSymbols = [...formulaInfo.symbols].sort((a, b) => b.symbol.length - a.symbol.length);

    // Let's render the equation by splitting it carefully or rendering pieces
    // To keep it simple and robust, let's build the formula string by matching known symbols and separators
    // We can parse the equation string using regex
    const symbolMap = new Map<string, FormulaSymbol>();
    formulaInfo.symbols.forEach(s => {
      symbolMap.set(s.symbol, s);
    });

    // Create a dynamic pattern matching any of the symbols in the equation
    const patternStr = formulaInfo.symbols
      .map(s => escapeRegExp(s.symbol))
      .join('|');
    const regex = new RegExp(`(${patternStr})`, 'g');

    const parts = eq.split(regex);

    return parts.map((part, index) => {
      const matchingSymbol = symbolMap.get(part);
      if (matchingSymbol) {
        const isHovered = activeSymbol?.symbol === matchingSymbol.symbol;
        return (
          <span
            key={index}
            className={`inline-block px-1.5 sm:px-2.5 py-1 sm:py-1.5 font-mono text-sm sm:text-lg font-bold rounded-none border transition-all cursor-pointer ${
              isHovered
                ? 'bg-amber-500/20 text-amber-400 border-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'bg-black/60 text-white border-white/10 hover:border-amber-500/40 hover:text-amber-400'
            }`}
            onMouseEnter={() => {
              setActiveSymbol(matchingSymbol);
              onHoverSymbol(matchingSymbol.nodeId);
            }}
            onMouseLeave={() => {
              setActiveSymbol(null);
              onHoverSymbol(null);
            }}
            onClick={() => {
              if (activeSymbol?.symbol === matchingSymbol.symbol) {
                setActiveSymbol(null);
                onHoverSymbol(null);
              } else {
                setActiveSymbol(matchingSymbol);
                onHoverSymbol(matchingSymbol.nodeId);
              }
            }}
            id={`formula_token_${matchingSymbol.symbol}`}
          >
            {matchingSymbol.symbol}
          </span>
        );
      }

      // Plain spacer or operator
      return (
        <span key={index} className="mx-0.5 text-slate-400 font-mono text-xs sm:text-base">
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className="bg-[#08080A] border border-white/10 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start"
      id="formula_breakdown_section"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-amber-500" />
          <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
            {lang === 'ar' ? 'مفسّر المعادلات الفيزيائية التفاعلي' : 'Interactive Formula Breakdown'}
          </h3>
        </div>
        <span className="text-[8px] font-mono text-amber-500/70 border border-amber-500/30 px-1.5 py-0.5 uppercase">
          {lang === 'ar' ? 'نموذج رياضي' : 'Math Model'}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[11px] text-slate-400 font-mono tracking-wide">
          {lang === 'ar'
            ? 'ضع مؤشر الفأرة على رموز المعادلة لتسليط الضوء على العقد المرتبطة بالمخطط الإرشادي والمحاكي الفيزيائي:'
            : 'Hover over the equation symbols to flash and locate their physical counterparts in the blueprint and simulator:'}
        </p>

        {/* Dynamic Interactive Equation Display */}
        <div 
          className="flex flex-wrap items-center justify-center gap-1.5 p-4 sm:p-6 bg-black border border-white/5 rounded-none relative overflow-hidden select-none"
          id="formula_interactive_display"
        >
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
          
          <div className="flex items-center gap-1">
            {renderInteractiveEquation()}
          </div>
        </div>

        {/* Dynamic Detail Sheet for hovered Symbol */}
        <div className="min-h-[100px] transition-all" id="formula_hover_details_box">
          {activeSymbol ? (
            <div className="bg-[#0f0e13]/80 border border-amber-500/20 p-4 rounded-none flex flex-col gap-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-amber-400">
                  {activeSymbol.symbol} &mdash; {lang === 'ar' ? activeSymbol.nameAr : activeSymbol.nameEn}
                </span>
                <span className="text-[7px] font-mono text-amber-500 uppercase tracking-widest bg-amber-500/5 border border-amber-500/20 px-1.5 py-0.5">
                  {lang === 'ar' ? 'عُقدة فيزيائية مرتبطة' : 'Linked Physics Node'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                {lang === 'ar' ? activeSymbol.descAr : activeSymbol.descEn}
              </p>
            </div>
          ) : (
            <div className="bg-[#08080A]/40 border border-white/5 border-dashed p-4 rounded-none text-center text-[10px] uppercase tracking-wider text-slate-500 flex items-center justify-center h-full min-h-[85px]">
              {lang === 'ar'
                ? 'مرر الفأرة فوق أي رمز بالمعادلة الرياضية أعلاه لتفكيك المعنى ودوره الهيكلي'
                : 'Hover over any math symbol above to analyze its underlying physical meaning'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
