import { Topic } from '../types';
import { 
  Compass, 
  Plane, 
  Zap, 
  Globe, 
  Layers, 
  Orbit, 
  Sparkles, 
  Navigation, 
  Map, 
  Binary, 
  Settings, 
  CheckCircle2, 
  Search 
} from 'lucide-react';
import { PRESET_TOPICS } from '../data/presetTopics';
import { localizeTopic, UI_STRINGS } from '../lib/translations';

interface HeroStateProps {
  onSelectTopic: (topic: Topic) => void;
  onExploreCustom: () => void;
  lang?: 'en' | 'ar';
}

export default function HeroState({
  onSelectTopic,
  onExploreCustom,
  lang = 'en'
}: HeroStateProps) {

  // Dynamic Icon selector mappings based on preset identifiers
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
      default: return <Compass className="text-slate-400" size={18} />;
    }
  };

  return (
    <div className="flex flex-col gap-10 py-4" id="mechanica_hero_landing_view">
      
      {/* Title & Philosophy Jumbotron Header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center bg-[#08080A]/80 p-5 sm:p-8 md:p-10 rounded-none border border-white/10 backdrop-blur-md relative overflow-hidden text-start" id="hero_jumbotron">
        <div className="absolute top-0 right-0 p-8 text-right opacity-5 pointer-events-none select-none">
          <span className="text-8xl font-sans tracking-widest text-white">AXIS</span>
        </div>

        <div className="flex-1 flex flex-col gap-4 z-10">
          <div className="inline-flex max-w-max items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-none text-amber-500 text-[10px] font-mono tracking-widest uppercase border border-amber-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            {lang === 'ar' ? 'محاكي مبادئ الميكانيكا والفيزياء الهندسية التفاعلي' : 'SYSTEM ARCHITECTURE & PHYSICS SIMULATOR'}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-semibold tracking-tight text-white leading-tight">
            {lang === 'ar' ? (
              <>كيف يعمل <span className="font-serif italic text-amber-400 decoration-amber-400/30 underline decoration-1">العالم</span> من حولنا بالفعل؟</>
            ) : (
              <>How does the <span className="font-serif italic text-amber-400 decoration-amber-400/30 underline decoration-1">world</span> actually work?</>
            )}
          </h1>
          
          <p className="text-[15px] text-[#F1F5F9] font-normal leading-relaxed max-w-xl">
            {lang === 'ar' ? (
              'دعك من تلقين الكتب المدرسية التقليدية. فكك وحلل قوى الطيران الإيروديناميكي، الدوائر الكهرومغناطيسية المباشرة، الجسور الإنشائية، وميكانيكا الفضاء المدارية عبر مخططات تفاعلية، خطوط زمنية سببية عِلية، ومتحكمات مرنة لتهيئة المتغيرات والديناميكيات.'
            ) : (
              'Forget traditional textbooks. Deconstruct atmospheric flight, electromagnetic grids, mechanics, and computational models via real-time interactive schematics, causality timelines, and live modular parameters.'
            )}
          </p>
        </div>

        <button 
          onClick={onExploreCustom}
          className="w-full md:w-auto text-center bg-white hover:bg-amber-500 hover:text-black text-black font-semibold text-[10px] md:text-[11px] uppercase tracking-widest px-6 md:px-8 py-3.5 md:py-4 rounded-none shadow-2xl shrink-0 transition-all duration-300 z-10 cursor-pointer"
        >
          {lang === 'ar' ? 'فكّك موضوعاً ونظرة مخصصة' : 'Deconstruct Custom Subject'}
        </button>
      </div>

      {/* Philosophy core banners in gorgeous list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start" id="philosophy_grid">
        <div className="bg-[#08080A]/40 border border-white/5 p-4 sm:p-6 rounded-none flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-medium">
            {lang === 'ar' ? '٠١ / تشريح المخططات الإرشادية' : '01 / COGNITIVE BLUEPRINTING'}
          </span>
          <h3 className="text-sm font-semibold text-white tracking-widest uppercase">
            {lang === 'ar' ? 'شبكات متجهة حية' : 'Interactive Vectors'}
          </h3>
          <p className="text-[13px] text-[#CBD5E1] font-normal leading-relaxed">
            {lang === 'ar' ? (
              'يتم تشريح كل بنية تقنية وفيزيائية لشبكة من الروابط والصمامات الحركية. اضغط على أي عُقدة توضيحية لمعاينة دورها وهندستها.'
            ) : (
              'Every concept is dissected into an live interactive SVG conduit network. Click any node to analyze dynamic operational parameters.'
            )}
          </p>
        </div>

        <div className="bg-[#08080A]/40 border border-white/5 p-4 sm:p-6 rounded-none flex flex-col gap-3 text-white">
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-medium">
            {lang === 'ar' ? '٠٢ / المحاكاة الفورية المباشرة' : '02 / DYNAMIC SIMULATION'}
          </span>
          <h3 className="text-sm font-semibold text-white tracking-widest uppercase">
            {lang === 'ar' ? 'تعديل المعايير والفيزياء' : 'Active Parameters'}
          </h3>
          <p className="text-[13px] text-[#CBD5E1] font-normal leading-relaxed">
            {lang === 'ar' ? (
              'تحكّم بقيم الضغط، السرعة، الجهد، وأوزان الشحنات الإنشائية؛ وشاهد كيف تترجم الرياضيات لتمثيلات بيانية تفاعلية وفورية على لوحة الرسم.'
            ) : (
              'Manipulate core values—velocity, compression ratios, electrical voltage, or thrust—and observe live mathematical results rendered on canvas.'
            )}
          </p>
        </div>

        <div className="bg-[#08080A]/40 border border-white/5 p-4 sm:p-6 rounded-none flex flex-col gap-3">
          <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-medium">
            {lang === 'ar' ? '٠٣ / المعالجة والتخليق التوليدي' : '03 / GENERATIVE DECONSTRUCTION'}
          </span>
          <h3 className="text-sm font-semibold text-white tracking-widest uppercase">
            {lang === 'ar' ? 'معالجة وتصميم بالذكاء الاصطناعي' : 'Synthesis Engine'}
          </h3>
          <p className="text-[13px] text-[#CBD5E1] font-normal leading-relaxed">
            {lang === 'ar' ? (
              'اكتب أي فكرة ميكانيكية أو ظاهرة راديوية من حركات الساعات والعدسات البصرية إلى الانشطار. يقوم المعالج بصياغة نموذج متكامل تفاعلي لك.'
            ) : (
              'Input queries from mechanical watches to nuclear fission turbines. The integrated dynamic parser builds customizable blueprints and math layers instantly.'
            )}
          </p>
        </div>
      </div>

      {/* Catalog of Curated Preschool topics - updated aesthetic */}
      <div className="flex flex-col gap-6 text-start" id="curated_catalog_area">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xs font-mono tracking-widest uppercase font-bold text-white/50">
            {lang === 'ar' ? 'مكتبات ومخططات النمذجة الرياضية والفيزيائية النشطة' : 'LOADED MATHEMATICAL & PHYSICAL LIBRARIES'}
          </h2>
          <span className="text-[10px] font-mono text-amber-500/80 uppercase">
            {lang === 'ar' ? `${PRESET_TOPICS.length} دراسة فيزيائية نشطة` : `${PRESET_TOPICS.length} blueprints active`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bento_catalog_grid">
          {PRESET_TOPICS.map((topic) => {
            // Localize the preset card dynamic fields instantly!
            const localizedTopic = localizeTopic(topic, lang);

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className="group cursor-pointer bg-[#08080A]/90 hover:bg-black border border-white/10 hover:border-amber-500/50 p-4 sm:p-6 rounded-none flex flex-col justify-between gap-4 sm:gap-6 transition-all duration-300 shadow-md relative overflow-hidden"
                id={`preset_card_${topic.id}`}
              >
                {/* Highlight background gradient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/5 to-transparent rounded-bl-full group-hover:from-amber-400/10 transition-all" />

                <div className="flex flex-col gap-4 z-10">
                  <div className="h-10 w-10 bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all">
                    {getTopicIcon(topic.iconName)}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-500">
                      {localizedTopic.category}
                    </span>
                    <h3 className="text-sm font-semibold text-white tracking-wider group-hover:text-amber-500 transition-colors mt-1">
                      {localizedTopic.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#D1D1D1]/80 font-light leading-relaxed line-clamp-3">
                    {localizedTopic.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-1 border-t border-white/5 pt-4 text-[10px] text-white/40 font-mono">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[9px]">
                    <CheckCircle2 size={11} className="text-amber-500" />
                    {lang === 'ar' ? 'مخطط وبنية حية' : 'Active schematic'}
                  </span>
                  <span className="text-amber-500/70 group-hover:text-amber-400 group-hover:translate-x-1 hover:translate-x-1 transition-all flex items-center gap-0.5 uppercase tracking-wider text-[9px]">
                    {lang === 'ar' ? 'أطلق المحاكي ←' : 'Simulate \u2192'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

