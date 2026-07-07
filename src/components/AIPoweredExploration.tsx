import { useState } from 'react';
import { Topic } from '../types';
import { Search, Loader2, Sparkles, HelpCircle, History } from 'lucide-react';
import { motion } from 'motion/react';
import { UI_STRINGS } from '../lib/translations';

interface AIPoweredExplorationProps {
  onSuggestTopic: (topic: Topic) => void;
  recentQueries: string[];
  onAddQuery: (query: string) => void;
  lang?: 'en' | 'ar';
}

export default function AIPoweredExploration({
  onSuggestTopic,
  recentQueries,
  onAddQuery,
  lang = 'en'
}: AIPoweredExplorationProps) {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [errorStatus, setErrorStatus] = useState<string>('');

  const loadingLinesEn = [
    "Contacting Mechanics Engine...",
    "Assembling physical components...",
    "Formulating structural nodes...",
    "Calibrating visual coordinate matrices...",
    "Designing particle streamline paths...",
    "Drafting interactive simulator guidelines...",
    "Assembling core structural Q&A..."
  ];

  const loadingLinesAr = [
    "جاري الاتصال بمحرّك الميكانيكا الهندسية...",
    "جاري مواءمة وتجميع الهياكل والكتل الإنشائية...",
    "جاري صياغة الروابط الصمامية ومصفوفة العُقد الفيزيائية...",
    "جاري ضبط إحداثيات ومسارات المخطط التفاعلي...",
    "جاري رسم التدفق الانسيابي لجزيئات المحاكاة...",
    "جاري تهيئة معايير وديناميكيات واجهة المحاكي الرياضية...",
    "جاري صياغة مستودع الأسئلة والنموذج المعرفي المفسر..."
  ];

  const suggestionsEn = [
    "How do noise-canceling headphones work",
    "How does hydraulic brakes work",
    "How does a compass work",
    "How do solar panels capture energy"
  ];

  const suggestionsAr = [
    "كيف تعمل سماعات إلغاء الضوضاء؟",
    "كيف تعمل المكابح الهيدروليكية؟",
    "كيف تعمل البوصلة المغناطيسية لمسح الاتجاه؟",
    "كيف تلتقط الخلايا وسكاكين الألواح الشمسية الطاقة؟"
  ];

  const loadingLines = lang === 'ar' ? loadingLinesAr : loadingLinesEn;
  const suggestions = lang === 'ar' ? suggestionsAr : suggestionsEn;

  const handleSearch = async (targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setIsLoading(true);
    setErrorStatus('');
    
    // Cycle loading status text to keep user engaged
    let lineIdx = 0;
    setLoadingStatus(loadingLines[0]);
    const timer = setInterval(() => {
      lineIdx = (lineIdx + 1) % loadingLines.length;
      setLoadingStatus(loadingLines[lineIdx]);
    }, 1200);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: targetQuery, lang })
      });

      if (!res.ok) {
        throw new Error(lang === 'ar' ? "فشل الاتصال بخادم التوليد بالذكاء الاصطناعي." : "Server refused or failed connection stream.");
      }

      const data = await res.json();
      if (data && data.nodes && data.nodes.length > 0) {
        // Enforce a unique generated ID
        const dynamicTopic: Topic = {
          ...data,
          id: `ai-${Date.now()}`
        };
        onAddQuery(targetQuery);
        onSuggestTopic(dynamicTopic);
        setQuery('');
      } else {
        throw new Error(lang === 'ar' ? "المخطط المستلم لا يطابق مواصفات هيكل البنية." : "Returned blueprint did not meet structural nodes specification.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorStatus(e.message || (lang === 'ar' ? "حدث خطأ غير متوقع أثناء تخليق المنظومة." : "Something went wrong generating the visualizer."));
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  const handleSuggestions = (topicIdea: string) => {
    setQuery(topicIdea);
    handleSearch(topicIdea);
  };

  return (
    <div className="bg-[#08080A] border border-white/10 p-6 rounded-none shadow-xl flex flex-col gap-5 text-start" id="mechanica_explorer_card">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-amber-500" />
        <h2 className="text-xs uppercase tracking-wider font-semibold text-white">
          {lang === 'ar' ? 'محرك تفكيك وتخليق الأنظمة والظواهر' : 'SYSTEM DECONSTRUCTION ENGINE'}
        </h2>
      </div>

      <p className="text-sm text-[#F1F5F9] font-normal leading-relaxed -mt-2">
        {lang === 'ar' ? (
          'اكتب أي مفهوم ميكانيكي، إيكولوجي، برمجي، أو نظام فيزيائي. سيقوم المحرك التوليفي فوراً بدمقرطة وتخليق مخططات تفاعلية، عُقد ترابطية، ومحاكي رياضي كامل خصيصاً لك.'
        ) : (
          'Enter any mechanical, ecological, software or physical system. The synthesis engine will dynamically compile structural layouts, interconnected nodes, and mathematical simulators on-demand.'
        )}
      </p>

      {/* Input box */}
      <div className="flex flex-col sm:flex-row gap-2 relative mt-1" id="query_input_capsule">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={lang === 'ar' ? "مثال: كيف تعمل مكابح القطار المغناطيسية السريعة؟" : "e.g. How does noise-canceling headphones work?"}
          disabled={isLoading}
          className="flex-1 bg-black border border-white/10 focus:border-amber-500 rounded-none px-4 py-3 text-xs text-white placeholder-white/30 outline-none transition-all w-full"
        />
        <button
          onClick={() => handleSearch(query)}
          disabled={isLoading || !query.trim()}
          className="w-full sm:w-auto justify-center bg-amber-500 hover:bg-amber-400 disabled:opacity-35 disabled:pointer-events-none text-black font-bold text-[10px] uppercase tracking-wider px-5 py-3 rounded-none flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {isLoading ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Search size={13} />
          )}
          <span>{lang === 'ar' ? 'تخليق' : 'Compile'}</span>
        </button>
      </div>

      {/* Loading Scan Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/95 border border-amber-500/10 p-6 rounded-none flex flex-col items-center justify-center text-center gap-4 animate-pulse"
          id="visualizer_generation_loader"
        >
          <div className="relative flex items-center justify-center h-12 w-12">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-20"></span>
            <Loader2 className="animate-spin text-amber-500 relative" size={24} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-[#D1D1D1] font-medium">
              {lang === 'ar' ? 'جاري فك وتخليق بنية وهندسة المنظومة' : 'Deconstructing Model Architecture'}
            </span>
            <span className="text-[9px] font-mono text-amber-500">{loadingStatus}</span>
          </div>
        </motion.div>
      )}

      {/* Error Output */}
      {errorStatus && (
        <div className="bg-red-950/20 border border-red-500/20 p-3 rounded-none text-[10px] text-red-400 leading-relaxed uppercase tracking-wider">
          <strong>{lang === 'ar' ? 'خطأ في التهيئة:' : 'Initialization Error:'}</strong> {errorStatus} {lang === 'ar' ? 'جاري استخدام المعالج المحلي كمنقذ.' : '. Using local fallback.'}
        </div>
      )}

      {/* Recommended seed prompts layout */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono tracking-wider text-[#D1D1D1]/60 uppercase flex items-center gap-1">
          <HelpCircle size={11} className="text-amber-500" />
          {lang === 'ar' ? 'أطلق شرارة شغفك المعرفي' : 'Spark your curiosity'}
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((idea, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleSuggestions(idea)}
              className="text-[10px] text-[#D1D1D1] hover:text-[#050507] hover:bg-amber-500 bg-black border border-white/10 px-3 py-1.5 rounded-none transition-all text-left cursor-pointer"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Search history cache panel */}
      {recentQueries.length > 0 && (
        <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
          <span className="text-[10px] font-mono tracking-wider text-[#D1D1D1]/60 uppercase flex items-center gap-1">
            <History size={11} className="text-amber-500" />
            {lang === 'ar' ? 'أرشيف التخليق والفك الهندسي' : 'Deconstructed archives'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {recentQueries.map((q, qIdx) => (
              <button
                key={qIdx}
                disabled={isLoading}
                onClick={() => handleSearch(q)}
                className="text-[10px] text-amber-500 hover:text-[#050507] hover:bg-amber-500 bg-black border border-white/10 px-2.5 py-1 rounded-none truncate max-w-[200px] cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
