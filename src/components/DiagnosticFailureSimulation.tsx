import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, RefreshCw, Activity, HeartCrack } from 'lucide-react';
import { Topic } from '../types';

interface FailureScenario {
  id: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  initialParams: Record<string, number>;
  checkResolved: (params: Record<string, number>) => boolean;
  instructionEn: string;
  instructionAr: string;
  successEn: string;
  successAr: string;
}

const FAILURE_SCENARIOS: Record<string, FailureScenario> = {
  'airplane-flight': {
    id: 'airplane-flight',
    nameEn: 'Critical Aerodynamic Wing Stall',
    nameAr: 'انهيار الجناح وفقد الرفع الهوائي',
    descEn: 'The plane is losing altitude rapidly! The angle of attack is too steep, causing turbulent airflow over the wing and destroying lift.',
    descAr: 'الطائرة تفقد الارتفاع بسرعة خطيرة! زاوية مواجهة الجناح حادة جداً، مما تسبب في اضطراب الهواء وتدمير كامل لقوة الرفع.',
    initialParams: { attack: 24, speed: 120 },
    checkResolved: (params) => (params.attack ?? 24) <= 15 && (params.speed ?? 120) >= 250,
    instructionEn: 'Reduce Angle of Attack below 15° and increase Airspeed to 250 kts or higher to restore clean airflow.',
    instructionAr: 'قلل زاوية المواجهة لأقل من 15 درجة وزد سرعة الهواء لـ 250 عقدة على الأقل لإعادة تدفق الهواء بشكل سليم والتعافي.',
    successEn: 'Aero flow stabilized! Clean lift has been restored, and the aircraft is soaring safely.',
    successAr: 'تم تثبيت التدفق الهوائي! عادت قوة الرفع بسلام، والطائرة تحلق الآن بوضع مستقر بالكامل.'
  },
  'electricity-flow': {
    id: 'electricity-flow',
    nameEn: 'Short Circuit Filament Burnout',
    nameAr: 'ماس كهربائي حاد واحتراق فتيل المصباح',
    descEn: 'High battery voltage combined with almost zero resistance is forcing too much current through the circuit, endangering the bulb.',
    descAr: 'الجهد الفولت المفرط مع المقاومة المنعدمة تقريباً يجبر تياراً هائلاً على التدفق، مما يهدد باحتراق فوري لفتيل المصباح.',
    initialParams: { voltage: 22, resistance: 5 },
    checkResolved: (params) => {
      const v = params.voltage ?? 22;
      const r = params.resistance ?? 5;
      return r >= 35 || (v / r <= 0.6);
    },
    instructionEn: 'Increase Resistance to 35 Ω or reduce battery Voltage to keep the electrical current under 0.6 Amps.',
    instructionAr: 'زد المقاومة الكلية لـ 35 أوم على الأقل أو خفّض جهد الفولت لتأمين تيار يسري بأقل من 0.6 أمبير.',
    successEn: 'Circuit saved! Electron drift has slowed to a safe pace, preventing thermal blowout.',
    successAr: 'تم إنقاذ الدائرة بنجاح! تراجع تدفق الإلكترونات لمعدلات آمنة، مما يحمي المصباح من الانفجار الحراري.'
  },
  'internet-packets': {
    id: 'internet-packets',
    nameEn: 'ISP Core Backbone Buffer Overflow',
    nameAr: 'تخمة وازدحام الشبكة وفقد كلي لحزم البيانات',
    descEn: 'Extremely high congestion is causing routers to overflow their memory buffers and drop vital TCP/IP data packets.',
    descAr: 'الازدحام الهائل في الخوادم يؤدي لفيضان الذاكرة المؤقتة للموجهات وإسقاط حزم البيانات الضرورية.',
    initialParams: { congestion: 90, packetSize: 1500 },
    checkResolved: (params) => (params.congestion ?? 90) <= 30,
    instructionEn: 'Reduce Network Congestion load below 30% to stabilize intermediate transit hubs.',
    instructionAr: 'قلل حجم الازدحام بالشبكة لأقل من 30% لتحقيق الاستقرار الكلي في عُقد النقل ومحاور الارتكاز.',
    successEn: 'Packets flowing seamlessly! BGP routes have cleared, and the client message is assembled instantly.',
    successAr: 'حزم البيانات تتدفق بسلاسة تامة! تم تصفية مسارات التوجيه، وإعادة تركيب رسالة المستخدم فوراً.'
  },
  'bridge-forces': {
    id: 'bridge-forces',
    nameEn: 'Critical Steel Catenary Overstrain',
    nameAr: 'إجهاد مفرط وتهديد بانهيار كابلات الجسر',
    descEn: 'Excessive traffic load combined with extremely tight cables (low sag) is pushing tensile forces to structural boundary limits.',
    descAr: 'الحمل المفرط لسيارات المرور مع الشد الجاف للكابلات يدفع إجهادات الشد لحدود ميكانيكية خطيرة تهدد بتمزق الكابل.',
    initialParams: { load: 180, cableSlack: 15 },
    checkResolved: (params) => {
      const l = params.load ?? 180;
      const s = params.cableSlack ?? 15;
      return l <= 80 || s >= 40;
    },
    instructionEn: 'Decrease Traffic Load below 80 tons or relax Cable Sag (Slack) above 40% to lower tensile stresses.',
    instructionAr: 'خفّض حجم حمولة السيارات لـ 80 طناً أو أقل أو زد نسبة ترهل/ارتخاء الكابل لأكثر من 40% لتخفيف الجهد.',
    successEn: 'Tensile equilibrium achieved! Steel cables are operating safely within design safety margins.',
    successAr: 'تم تحقيق الاتزان الميكانيكي! تعمل الكابلات الآن بسلامة وأمان ضمن الحدود الهندسية المصممة.'
  },
  'satellite-orbit': {
    id: 'satellite-orbit',
    nameEn: 'Atmospheric Air Drag Orbital Decay',
    nameAr: 'اضمحلال مداري مهدد بالاحتراق بالغلاف الجوي',
    descEn: 'Low satellite speed combined with thick air molecules at low altitude is causing gravity to pull the satellite to destruction.',
    descAr: 'السرعة الجانبية المنخفضة للقمر مع الهواء الكثيف بالارتفاع المنخفض يجعل الجاذبية تسحب القمر للاحتراق الكلي.',
    initialParams: { orbitalSpeed: 4500, altitude: 300 },
    checkResolved: (params) => (params.orbitalSpeed ?? 4500) >= 7500 && (params.altitude ?? 300) >= 700,
    instructionEn: 'Increase Tangential Speed above 7500 m/s and adjust Altitude above 700 km to escape atmospheric decay.',
    instructionAr: 'زد السرعة المدارية لأكثر من 7500 م/ث واضبط الارتفاع ليتخطى 700 كم للفرار من سحب الغلاف الجوي.',
    successEn: 'Circular orbit locked! The satellite is falling around Earth infinitely in friction-free space.',
    successAr: 'تم تأمين المدار المستقر! القمر الصناعي يدور الآن حول الأرض بوضع اتزان كامل بلا احتكاك.'
  },
  'nuclear-reactor': {
    id: 'nuclear-reactor',
    nameEn: 'Uranium Core Thermal Meltdown Overheat',
    nameAr: 'احترار مفرط وتهديد بانصهار قلب المفاعل النووي',
    descEn: 'Control rods are pulled out too far, creating an unchecked exponential chain reaction and boiling coolant dangerously.',
    descAr: 'تم سحب قضبان الكادميوم بشكل مفرط، مما خلق تفاعلاً تسلسلياً متسارعاً يغلي مياه التبريد لمستويات تدميرية.',
    initialParams: { rodDepth: 10, coolantFlow: 20 },
    checkResolved: (params) => (params.rodDepth ?? 10) >= 65 && (params.coolantFlow ?? 20) >= 60,
    instructionEn: 'Insert Control Rods deeper (above 65%) and speed up Coolant Water Pumps above 60% to cool the core.',
    instructionAr: 'أدخل قضبان التحكم لعمق أكبر من 65% وافتح مضخات سائل التبريد لأكثر من 60% لتهدئة القلب.',
    successEn: 'Reactor stabilized! Temperature returned to safe parameters and power generation remains steady.',
    successAr: 'تم تثبيت استقرار المفاعل! عادت درجات الحرارة للمعدلات الآمنة وتوليد الطاقة يسير بانتظام.'
  },
  'submarine-diving': {
    id: 'submarine-diving',
    nameEn: 'Ballast Valve Vent Failure & Rapid Sinking',
    nameAr: 'عطل صمامات الغمر وهبوط مفرط مهدد بالانفجار',
    descEn: 'The submarine vents are stuck wide open, letting ocean water flood continuously and dragging the hull past the crush depth.',
    descAr: 'صمامات الغواصة مفتوحة بشكل كامل مما يغرق خزانات الموازنة بالمياه ويسحب البدن لعمق ساحق يهدد بالانفجار.',
    initialParams: { ventOpen: 100, blowAir: 10 },
    checkResolved: (params) => (params.ventOpen ?? 100) <= 10 && (params.blowAir ?? 10) >= 70,
    instructionEn: 'Shut the Vent Valve to 10% or less and apply Compressed Air cylinders above 70% to eject ballast water.',
    instructionAr: 'أغلق صمام تفريغ الهواء لنسبة 10% أو أقل واضخ الهواء المضغوط لأكثر من 70% لطرد مياه الغمر.',
    successEn: 'Neutral buoyancy reached! Balast tanks cleared, and the submarine leveled off safely.',
    successAr: 'تم استعادة توازن الطفو! صُرِفت مياه الخزانات بنجاح، والغواصة تبحر الآن بعمق آمن وبثبات.'
  },
  'gps-trilateration': {
    id: 'gps-trilateration',
    nameEn: 'Relativistic Nanosecond Clock Drift',
    nameAr: 'تشتت توقيت النانو وانحراف التموضع الجغرافي',
    descEn: 'The satellite signals have desynchronized due to time dilation, throwing trilateration calculations off by several kilometers.',
    descAr: 'إشارات القمر الصناعي تشتتت بفعل التمدد النسبي للزمن، مما حرف حسابات التموضع الجغرافي لعدة كيلومترات.',
    initialParams: { timeLagA: 84, timeLagB: 81 },
    checkResolved: (params) => {
      const a = params.timeLagA ?? 84;
      const b = params.timeLagB ?? 81;
      return a >= 68 && a <= 73 && b >= 66 && b <= 71;
    },
    instructionEn: 'Adjust and sync Signal Transit Lag A between 68-73ms and Lag B between 66-71ms to re-align.',
    instructionAr: 'اضبط وبث تأخر إشارة الراديو A بين 68-73 مللي ثانية وB بين 66-71 مللي ثانية لمزامنة التوقيت.',
    successEn: 'Handset locked! Relativistic drift has been corrected, pinpointing coordinate location under 1 meter.',
    successAr: 'تم إقفال الإحداثيات! صُحِّح الانحراف النسبي، والتموضع يعمل الآن بدقة تقل عن متر واحد.'
  },
  'electricity-home': {
    id: 'electricity-home',
    nameEn: 'Substation Thermal Overload Outage',
    nameAr: 'تحميل زائد وحرارة قاتلة بمحطة توزيع الكهرباء',
    descEn: 'The town is drawing excessive electrical load simultaneously, overheating lines and tripping municipal security breakers.',
    descAr: 'البلدة تستهلك أحمالاً تفوق سعة محطة التحويل، مما يسخن الخطوط ويفصل قواطع الأمان الكلية بشكل طارئ.',
    initialParams: { load: 4 },
    checkResolved: (params) => (params.load ?? 4) <= 2,
    instructionEn: 'Reduce the Home Grid Load level to 2 (Normal) or 1 (Stable) to reset the tripped safety breakers.',
    instructionAr: 'خفّض حمولة الاستهلاك المنزلي للمستوى 2 (طبيعي) أو 1 (مستقر) لإعادة ضبط القواطع وإرجاع الطاقة.',
    successEn: 'Grid power restored! Substation thermal stress subsided, and stable AC electricity is streaming into homes.',
    successAr: 'عادت التغذية الكهربائية للشبكة! تلاشت الحرارة المفرطة بالمحولات، والتيار المتردد يسري بالمنازل بسلام.'
  }
};

function getDynamicScenario(topic: Topic, lang: 'en' | 'ar'): FailureScenario | null {
  if (!topic || !topic.simulation || !topic.simulation.params || topic.simulation.params.length === 0) {
    return null;
  }
  const params = topic.simulation.params;
  const p1 = params[0];
  const p2 = params[1] || params[0];

  const p1Name = p1.label;
  const p2Name = p2.label;
  const p1Unit = p1.unit || '';
  const p2Unit = p2.unit || '';

  const targetVal1 = p1.defaultValue;
  const targetVal2 = p2.defaultValue;

  return {
    id: topic.id,
    nameEn: `Unstable ${topic.title} Critical Resonance`,
    nameAr: `رنين واختلال حرج في منظومة ${topic.title}`,
    descEn: `The system parameters for "${topic.title}" have fluctuated wildly outside safe operating limits, triggering extreme friction spikes and vector desynchronization.`,
    descAr: `تذبذبت معايير تشغيل نظام "${topic.title}" بعنف خارج الحدود الآمنة، مما أدى لقفزة حادة في قوى الاحتكاك واختلال التزامن المتجهي للمنظومة.`,
    initialParams: {
      [p1.id]: p1.max,
      [p2.id]: p2.min
    },
    checkResolved: (currentParams) => {
      const v1 = currentParams[p1.id] ?? p1.max;
      const v2 = currentParams[p2.id] ?? p2.min;
      const range1 = (p1.max - p1.min) * 0.35;
      const range2 = (p2.max - p2.min) * 0.35;
      return Math.abs(v1 - targetVal1) <= range1 && Math.abs(v2 - targetVal2) <= range2;
    },
    instructionEn: `Adjust "${p1Name}" closer to ${targetVal1}${p1Unit} and "${p2Name}" closer to ${targetVal2}${p2Unit} to restore harmonic balance in the physics engine.`,
    instructionAr: `اضبط معيار "${p1Name}" ليكون قريباً من ${targetVal1} ${p1Unit} ومعيار "${p2Name}" قريباً من ${targetVal2} ${p2Unit} لاستعادة التوازن التوافقي في محرك الفيزياء.`,
    successEn: `Harmonic alignment locked! The dynamic physics engine reports completely stable operating margins.`,
    successAr: `تم إقفال الموازنة التوافقية بنجاح! يسجل محرك الفيزياء الآن هوامش تشغيلية مستقرة تماماً وبلا أي إجهاد حراري.`
  };
}

interface DiagnosticFailureSimulationProps {
  topicId: string;
  lang: 'en' | 'ar';
  simParams: Record<string, number>;
  onTriggerFault: (faultParams: Record<string, number>) => void;
  activeTopic?: Topic;
}

export default function DiagnosticFailureSimulation({
  topicId,
  lang,
  simParams,
  onTriggerFault,
  activeTopic
}: DiagnosticFailureSimulationProps) {
  const scenario = FAILURE_SCENARIOS[topicId] || (activeTopic ? getDynamicScenario(activeTopic, lang) : null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  // Auto reset resolution state when topic changes
  useEffect(() => {
    setIsResolved(false);
    setIsActive(false);
  }, [topicId]);

  // Auto detect if the user has met the solution conditions during active failure mode
  useEffect(() => {
    if (isActive && scenario) {
      const solved = scenario.checkResolved(simParams);
      if (solved) {
        setIsResolved(true);
        setIsActive(false);
      }
    }
  }, [simParams, isActive, scenario]);

  if (!scenario) return null;

  const handleStartDiagnostics = () => {
    setIsResolved(false);
    setIsActive(true);
    onTriggerFault(scenario.initialParams);
  };

  return (
    <div
      className={`p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-xl text-start relative overflow-hidden transition-all duration-300 border ${
        isActive
          ? 'bg-[#150a0a] border-red-500/30'
          : isResolved
          ? 'bg-[#0a1510] border-emerald-500/30'
          : 'bg-[#08080A] border-white/10'
      }`}
      id="diagnostic_failure_box"
    >
      {/* Dynamic background mesh matching alarm state */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full pointer-events-none opacity-20 ${
        isActive
          ? 'bg-gradient-to-br from-red-500/30 to-transparent animate-pulse'
          : isResolved
          ? 'bg-gradient-to-br from-emerald-500/30 to-transparent'
          : 'bg-gradient-to-br from-amber-500/5 to-transparent'
      }`} />

      <div className="flex items-center gap-2 border-b border-white/10 pb-3 justify-between">
        <div className="flex items-center gap-2">
          {isActive ? (
            <AlertTriangle className="text-red-500 animate-bounce shrink-0" size={16} />
          ) : isResolved ? (
            <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
          ) : (
            <Activity className="text-amber-500 shrink-0" size={16} />
          )}
          <h3 className="text-xs uppercase tracking-wider font-semibold text-white">
            {lang === 'ar' ? 'محاكاة الأعطال وحل المشكلات الفيزيائية' : 'Diagnostic & Failure Simulation'}
          </h3>
        </div>
        <span className={`text-[8px] font-mono border px-1.5 py-0.5 uppercase tracking-widest ${
          isActive
            ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
            : isResolved
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-500'
        }`}>
          {isActive
            ? (lang === 'ar' ? 'إنذار: عطل فيزيائي نشط' : 'ALARM: CRITICAL FAULT')
            : isResolved
            ? (lang === 'ar' ? 'تم الإصلاح والإنقاذ' : 'SYSTEM HEALTHY')
            : (lang === 'ar' ? 'جاهز للاختبار' : 'READY TO TRIGGER')}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-serif italic text-white font-bold leading-tight uppercase">
            {lang === 'ar' ? scenario.nameAr : scenario.nameEn}
          </h4>
          <p className="text-xs text-slate-300 font-light leading-relaxed">
            {lang === 'ar' ? scenario.descAr : scenario.descEn}
          </p>
        </div>

        {/* Action Button & Interface States */}
        {!isActive && !isResolved && (
          <button
            onClick={handleStartDiagnostics}
            className="flex items-center justify-center gap-2 bg-black border border-amber-500/40 text-amber-500 hover:border-amber-500 hover:bg-amber-500/10 text-[9px] uppercase tracking-widest font-mono py-3 px-4 rounded-none transition cursor-pointer"
            id="trigger_fault_btn"
          >
            <HeartCrack size={12} className="animate-pulse" />
            <span>{lang === 'ar' ? 'تنشيط عطل ومحاكاة حالة الطوارئ' : 'Inject System Critical Fault'}</span>
          </button>
        )}

        {isActive && (
          <div className="flex flex-col gap-4 animate-fade-in" id="active_fault_guidance">
            {/* Mission Objective Instructions */}
            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-none flex flex-col gap-2 relative">
              <span className="text-[8px] font-mono tracking-widest text-red-500 uppercase font-semibold">
                {lang === 'ar' ? 'الهدف الميكانيكي الفوري للإصلاح:' : 'IMMEDIATE REPAIR TASK:'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                {lang === 'ar' ? scenario.instructionAr : scenario.instructionEn}
              </p>
              
              {/* Dynamic flashing indicators */}
              <div className="absolute top-3 right-3 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-between">
              <span className="text-[10px] font-mono text-slate-400 italic">
                {lang === 'ar' ? 'قم بضبط أزرار التحكم ولوحة المنزلقات للحل...' : 'Adjust simulation sliders below to achieve goals...'}
              </span>
              <button
                onClick={handleStartDiagnostics}
                className="text-[8px] font-mono border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 px-2.5 py-1 text-slate-400 hover:text-red-400 transition cursor-pointer"
                title={lang === 'ar' ? 'إعادة ضبط المحاكاة' : 'Reset failure scenario'}
              >
                <RefreshCw size={10} className="inline mr-1" />
                {lang === 'ar' ? 'إعادة البدء' : 'Reset'}
              </button>
            </div>
          </div>
        )}

        {isResolved && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-none flex flex-col gap-3 animate-fade-in" id="fault_resolved_celebration">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500 animate-[bounce_1s_infinite]" size={20} />
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                {lang === 'ar' ? '✓ تم الموازنة وإصلاح النظام بأمان!' : '✓ EMERGENCY RESOLVED SUCCESSFULLY!'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">
              {lang === 'ar' ? scenario.successAr : scenario.successEn}
            </p>
            
            <button
              onClick={() => {
                setIsResolved(false);
                setIsActive(false);
              }}
              className="self-start text-[8px] font-mono border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 px-3 py-1.5 transition uppercase cursor-pointer"
            >
              {lang === 'ar' ? 'فصل المحاكاة والعودة للوضع الحر' : 'Dismiss & Return to Free Mode'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
