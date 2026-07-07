import { useState } from 'react';
import { BookOpen, History, BrainCircuit, Lightbulb, GraduationCap } from 'lucide-react';

interface TheorySection {
  titleEn: string;
  titleAr: string;
  thesisEn: string;
  thesisAr: string;
  mathEn: string;
  mathAr: string;
  historyEn: string;
  historyAr: string;
  challengeEn: string;
  challengeAr: string;
}

const THEORY_DATABASE: Record<string, TheorySection> = {
  'airplane-flight': {
    titleEn: 'Aerodynamic Wing Physics & Navier-Stokes Mechanics',
    titleAr: 'فيزياء الأجنحة الأيروديناميكية وميكانيكا "نافييه-ستوكس"',
    thesisEn: 'Flight is governed by fluid dynamics. The wing profile (airfoil) is designed to create a pressure imbalance in a continuous fluid medium. While often simplified purely as the "Bernoulli principle," actual flight is a holistic synergy of momentum conservation, Navier-Stokes shear stress boundaries, and Newton\'s third law of motion. As air molecules pass around the asymmetric contour, they are deflected downward (downwash), creating an equal and opposite upward lifting force.',
    thesisAr: 'يخضع الطيران لقوانين ديناميكا السوائل والغازات. تم تصميم الجناح الانسيابي لصنع عدم اتزان في حقول الضغط الجوي ضمن وسط مائع مستمر. ورغم تبسيط هذه العملية تاريخياً في "مبدأ برنولي"، فإن الطيران الفعلي هو تآزر ميكانيكي متكامل بين قوانين حفظ الزخم، وإجهادات القص لجدران "نافييه-ستوكس"، وقانون نيوتن الثالث للحركة؛ حيث تُجبر جزيئات الهواء على الانحراف للأسفل (تيار الانجراف الهابط)، مولدةً رد فعل مساوٍ ومعاكس يرفع الطائرة للأعلى.',
    mathEn: 'The lifting force can be formalized by the Circulation Theory of Lift (Kutta-Joukowski theorem): L = ρ · v · Γ, where Γ represents fluid circulation around the closed boundary. When modeled as a parameter of airspeed and wing area, it takes the form L = ½ · ρ · v² · S · CL. This highlights that lift increases quadratically with speed, making takeoff velocity the most critical safety parameter during flight operations.',
    mathAr: 'يمكن صياغة قوة الرفع فيزيائياً عبر نظرية الدوران للرفع (مبرهنة كوتا-جوكوفسكي): L = ρ · v · Γ، حيث Γ يمثل دوران المائع حول المسار المغلق للجناح. وعند نمذجته بدلالة سرعة الهواء ومساحة الجناح، يأخذ الصيغة الرياضية: L = ½ · ρ · v² · S · CL. توضح هذه المعادلة أن قوة الرفع تتناسب طردياً مع مربع السرعة الجوية، مما يجعل سرعة الإقلاع المعيار الحرج الأول للأمان أثناء الملاحة.',
    historyEn: 'The scientific query of flight took centuries to mature. Sir George Cayley in 1799 first decoupled Lift from Thrust, establishing the modern configuration of fixed-wing aircraft. Later, Otto Lilienthal conducted over 2,000 glider flights, capturing the first empirical lift coefficients of curved wings, which directly enabled the Wright Brothers to design their first controllable wind-tunnel-proven aircraft in 1903.',
    historyAr: 'استغرق الاستفسار العلمي عن كيفية الطيران قروناً لينضج. كان السير جورج كايلي عام 1799 أول من فصل بين قوتي الرفع والدفع ميكانيكياً، واضعاً المخطط الهيكلي المعاصر للطائرات ذات الأجنحة الثابتة. لاحقاً، أجرى أوتو ليلينتال أكثر من 2000 رحلة طيران شراعي، مسجلاً أولى المعاملات التجريبية لرفع الأجنحة المنحنية، مما مكّن الأخوين رايت من تصميم أول طائرة مأهولة قابلة للتحكم عام 1903 بعد اختبارات نفق الرياح.',
    challengeEn: 'The supreme modern engineering challenge is mitigating boundary layer separation. At high angles of attack, the flow cannot adhere to the upper curve, inducing turbulent wake vortices. Engineers resolve this by adding micro-vortex generators, computer-controlled slats, and using super-critical airfoils that maintain laminar flow across transonic flight envelopes.',
    challengeAr: 'يتمثل التحدي الهندسي الأكبر في عصرنا الحالي في تجنب انفصال الطبقة الجدارية المتاخمة للهواء. فعند زوايا المواجهة الحادة، يعجز تدفق الهواء عن الالتصاق بالانحناء العلوي للجناح، مما يولد دوامات مضطربة تسبب الانهيار. يحل المهندسون ذلك بإضافة مولدات الدوامات الدقيقة، والقلابات التي تدار حاسوبياً، والأجنحة فائقة الحرج التي تحافظ على التدفق الصفائحي الهادئ.'
  },
  'electricity-flow': {
    titleEn: "Electrodynamics, Electron Drift & Ohm's Empirical Law",
    titleAr: "التحريك الكهربائي، انجراف الإلكترونات وقانون أوم التجريبي",
    thesisEn: "An electric circuit is an energetic corridor. Rather than 'creating' electrons, a battery acts as a non-conservative chemical pump that establishes a potential difference (voltage). This voltage produces an internal electromagnetic field propagating inside the metallic lattice of copper at 90% the speed of light, prompting all free conduction-band electrons to drift in unison toward the positive terminal.",
    thesisAr: "الدائرة الكهربائية هي ممر لنقل الطاقة الكهرومغناطيسية. لا تقوم البطارية بصنع إلكترونات جديدة، بل تعمل كمضخة كيميائية غير محافظة لتأسيس فارق جهد. هذا الجهد يولد مجالاً كهرومغناطيسياً داخلياً ينتشر بطول الشبكة البلورية للنحاس بسرعة تناهز 90% من سرعة الضوء، مما يجبر كامل الإلكترونات الحرة في نطاق التوصيل على الانجراف المتسق نحو القطب الموجب.",
    mathEn: "Ohm's Law (I = V / R) represents the macroscopic approximation of electrodynamics. At the microscopic level, it is expressed as J = σ · E, where J is current density, σ is electrical conductivity of the copper lattice, and E is the applied electric field vector. The collision of drifting electrons with copper atoms converts kinetic energy into thermal vibration, which is dissipated as Joule heating (P = I² · R).",
    mathAr: "يمثل قانون أوم (I = V / R) التقريب العياني لحركة الشحنات. أما على المستوى المجهري الدقيق، فيتم صياغته كالآتي: J = σ · E، حيث J هي كثافة التيار، وσ الموصلية الكهربائية لبلورة النحاس، وE هو متجه المجال الكهربائي المؤثر. تصادم الإلكترونات المنجرفة بذرات النحاس يحول طاقتها الحركية لاهتزازات ذرية حرارية تتشتت كحرارة جول الكهرومغناطيسية (P = I² · R).",
    historyEn: "Georg Simon Ohm published his groundbreaking treatise 'The Galvanic Circuit Investigated Mathematically' in 1827. Initially, his work was dismissed by the scientific establishment, who believed the math was too simple to describe invisible forces. Decades later, his formulation was recognized as the foundational pillar of circuit engineering, leading to the SI unit of resistance being named in his honor.",
    historyAr: "نشر عالم الفيزياء جورج سيمون أوم أطروحته الثورية 'تحليل الدوائر الجلفانية رياضياً' عام 1827. في البداية، قوبل عمله بالرفض والاستهجان من المؤسسات العلمية، لظنهم أن الرياضيات أبسط من أن تصف قوى خفية كهرومغناطيسية. ولكن بعد عقود، اعتُرِف بصيغته كعمود فقري لهندسة الدوائر، وسُميت وحدة المقاومة باسمه تقديراً له.",
    challengeEn: "The modern micro-electronics industry faces a massive challenge with quantum tunneling and thermal dissipation. As semiconductor gates shrink below 2 nanometers, electrons leak spontaneously through silicon oxide barriers, causing catastrophic current loss. Designers are turning to high-k dielectrics, FinFET 3D geometries, and superconducting materials to bypass standard resistive limits.",
    challengeAr: "تواجه صناعة الإلكترونيات الدقيقة تحدياً هائلاً يتمثل في 'النفقية الكمومية' والتبدد الحراري. فعندما تتقلص بوابات أشباه الموصلات لأقل من 2 نانومتر، تتسرب الإلكترونات تلقائياً عبر حواجز أكسيد السيليكون مسببة فقداً للتيار. يلجأ المصممون الآن إلى تكنولوجيا عوازل high-k، والترانزستورات ثلاثية الأبعاد (FinFET)، والموصلات الفائقة للتغلب على هذه العقبة."
  },
  'internet-packets': {
    titleEn: "Statistical Multiplexing & TCP/IP Congestion Control",
    titleAr: "التجميع الإحصائي المجزأ وأنظمة التحكم في ازدحام TCP/IP",
    thesisEn: "The internet does not allocate dedicated physical lines for individual communication. Instead, it relies on statistical multiplexing: splitting digital messages into standardized chunks called 'packets' (containing metadata headers and payload). These packets traverse a decentralized web of nodes independently, queued and forwarded based on real-time routing tables. This design maximizes bandwidth utilization but introduces latency and congestion bottlenecks when intermediate memory buffers overflow.",
    thesisAr: "لا تعتمد شبكة الإنترنت على تخصيص قنوات اتصال فيزيائية محجوزة لكل مستخدم. بدلاً من ذلك، تعتمد على 'التجميع الإحصائي': تجزئة الرسائل الرقمية إلى كتل معيارية تسمى 'حزم البيانات' (تحتوي على ترويسة معلوماتية وحمولة). تسافر هذه الحزم عبر شبكة لا مركزية بشكل مستقل، وتصطف في طوابير الموجهات وفقاً لجداول التوجيه الفورية. يضاعف هذا التصميم استغلال عرض النطاق ولكنه يتسبب في تأخر استجابة الشبكة عند فيضان ذاكرة المعالجة المؤقتة للموجهات.",
    mathEn: "Transmission latency (T) is calculated as the sum of several distinct components: T = d_proc + d_queue + d_trans + d_prop. Queueing delay (d_queue) follows queueing theory approximations (Kingman's formula) which show an exponential rise in delay as network utilization approaches 100%, causing packet drop and core TCP buffer overflow.",
    mathAr: "يُحسب زمن التأخير الإجمالي للنقل (T) بمجموع عدة عناصر متباينة: T = d_proc + d_queue + d_trans + d_prop (معالجة، طابور، بث، انتشار). ويتبع تأخير طابور الانتظار (d_queue) قوانين نظرية الصفوف (معادلة كينجمان) والتي توضح ارتفاعاً أسياً كارثياً في التأخر كلما اقترب معدل استغلال الشبكة من 100%، مما يؤدي لإسقاط الحزم وانهيار البث.",
    historyEn: "Packet switching was co-invented independently by Paul Baran in the US and Donald Davies in the UK during the 1960s to build resilient communication networks that could survive localized node destruction. Their research laid the foundation for ARPANET, which sent its first historical packet message in October 1969.",
    historyAr: "تم ابتكار تقنية 'تحويل الحزم' بشكل مستقل بواسطة بول باران في الولايات المتحدة ودونالد ديفيز في المملكة المتحدة خلال الستينات، بهدف بناء شبكات اتصال مرنة قادرة على البقاء في حال تدمير عقد جغرافية معينة. شكلت أبحاثهما حجر الأساس لشبكة ARPANET الشهيرة، والتي أرسلت أول رسالة حزم تاريخية في أكتوبر 1969.",
    challengeEn: "With global traffic soaring, routers must route packets at terabit speeds. Modern challenges include mitigating bufferbloat—excessive queuing in routers that ruins real-time latency. Net-engineers solve this via Active Queue Management (AQM) algorithms like CoDel (Controlled Delay) and BBR congestion algorithms designed by Google.",
    challengeAr: "مع تصاعد حركة المرور العالمية، يجب على المحولات معالجة وتوجيه الحزم بسرعات تيرابت في الثانية. تشمل التحديات المعاصرة معالجة ظاهرة 'تخمة المخزن المؤقت' (Bufferbloat) التي تدمر زمن الاستجابة الفوري للالعاب والاتصال. يحل مهندسو الشبكات ذلك بخوارزميات الإدارة النشطة للطوابير (AQM) مثل CoDel، وبروتوكولات التحكم بالازدحام الحديثة مثل BBR من جوجل."
  },
  'bridge-forces': {
    titleEn: "Mechanical Static Equilibrium & Suspension Catenary Tension",
    titleAr: "الاتزان الميكانيكي الساكن وتوزيع إجهادات الشد في الكابلات",
    thesisEn: "A suspension bridge is an exercise in static equilibrium where the net forces and net torques acting on the structure must equal zero (∑F = 0, ∑𝜏 = 0). It acts as a massive tension-compression transducer. The dead load of the road deck and live load of passing traffic push down, transferring force through vertical steel hangers. These hangers pull down on the main main cables, translating vertical gravitational load into pure axial tensile stress directed to the solid concrete anchors on either shore.",
    thesisAr: "يمثل الجسر المعلق تطبيقاً مثالياً لقوانين الاتزان الميكانيكي الساكن؛ حيث يجب أن يتلاشى صافي القوى وصافي عزوم الدوران المؤثرة على الهيكل الهندسي بالكامل (∑F = 0, ∑𝜏 = 0). يعمل الجسر كمحول ضخم لقوى الشد والضغط. الوزن الذاتي للجسر وحمولات السيارات الضاغطة للأسفل تنتقل عبر حبال التعليق الرأسية إلى الكابلات الرئيسية المنحنية، والتي تقوم بدورها بتحويل الحمل الرأسي إلى قوى شد محورية جافة يتم تشتيتها في المرابط الخرسانية الضخمة على الضفتين.",
    mathEn: "The shape of a perfectly uniform hanging cable under its own weight forms a mathematical catenary: y = a · cosh(x/a). However, when supporting a flat horizontal roadway deck of uniform weight, the curve transforms into a parabola. The maximum tension in the cable occurs at the highest tower peak and is modeled by Tc = (W · L) / (8 · d) · √(1 + 16·d²/L²), illustrating how lower sag depth (d) aggressively amplifies axial cable tension.",
    mathAr: "يتخذ كابل التعليق المنتظم شكلاً رياضياً يسمى 'المنحنى السلسلي' تحت تأثير وزنه الذاتي: y = a · cosh(x/a). ولكن عند تحميله ببلاطات طريق أفقي منبسط بوزن متناسق، يتحول المنحنى لقطع مكافئ (Parabola). وتحدث ذروة الشد في الكابل عند قمة البرج الخرساني وتحكمها المعادلة: Tc = (W · L) / (8 · d) · √(1 + 16·d²/L²)، مما يوضح أن تراجع عمق التدلي وانخفاض الترهل (d) يضاعف قوى الشد المحورية بشكل حاد.",
    historyEn: "Humanity built primitive rope suspension bridges for millennia, but the era of structural steel began in 1883 with John A. Roebling's design of the Brooklyn Bridge. Roebling pioneered the 'aerial spinning' of steel wire ropes, creating cables strong enough to sustain spans that traditional masonry or cast-iron architectures could never support without collapsing.",
    historyAr: "بنى البشر الجسور المعلقة البدائية من الحبال والألياف لآلاف السنين، ولكن عصر الفولاذ الهيكلي انطلق عام 1883 مع تصميم جون روبلنج لجسر بروكلين الشهير. ابتكر روبلنج تقنية 'الغزل الهوائي' للكابلات الفولاذية، مما خلق كابلات فائقة القوة قادرة على حمل مجازات عجزت العمارة الصخرية أو الحديد الصب عن حملها دون انهيار.",
    challengeEn: "The primary threat to long bridges is aerodynamic aeroelastic flutter—where wind forces couple with the structure's natural oscillation frequency, causing catastrophic self-excited twisting (as seen in the 1940 Tacoma Narrows Bridge disaster). Modern bridge decks use aerodynamic truss designs and tuned mass dampers to scatter wind energy safely.",
    challengeAr: "يتمثل التهديد الأكبر للجسور الطويلة في 'الرفرفة الكهروميكانيكية المرنة'؛ حيث تتوافق طاقة الرياح مع التردد الطبيعي لاهتزاز الجسر، مما يسبب التواءً تدميرياً ذاتي التغذية (كما حدث بكارثة جسر تاكوما ناروز عام 1940). تستخدم الجسور المعاصرة ممرات هوائية مفتوحة ومخمدات كتلة مهتزة لتبديد طاقة الرياح بسلام."
  },
  'satellite-orbit': {
    titleEn: "Newtonian Gravity, Orbital Mechanics & Keplerian Dynamics",
    titleAr: "الجاذبية النيوتونية، الميكانيكا المدارية والديناميكا الكيبلرية",
    thesisEn: "A satellite in orbit is not escaping Earth's gravity; it is in a state of perpetual, controlled free fall. According to Newton's shell theorem, Earth's massive gravity acts as a centripetal force pulling the spacecraft inward. However, because the satellite possesses a high tangential horizontal velocity, the curvature of its falling path matches the curvature of the spherical planet. As it falls toward Earth, the ground curves away from beneath it at the exact same rate.",
    thesisAr: "لا يهرب القمر الصناعي في مداره من جاذبية الأرض؛ بل هو في حالة سقوط حر مستمر ومنظم. وفقاً لقوانين نيوتن، تعمل جاذبية الأرض الهائلة كقوة جاذبة مركزية تسحب المركبة للداخل. ولكن لأن القمر يمتلك سرعة مماسية أفقية هائلة، فإن انحناء مسار سقوطه يطابق تماماً انحناء كوكب الأرض الكروي. فبينما يسقط القمر نحو الكوكب، يتقوس سطح الأرض مبتعداً من تحته بذات المعدل تماماً.",
    mathEn: "By equating gravitational force to centripetal force (G·M·m/r² = m·v²/r), we derive the formula for tangential orbital speed: v = √(G · M / r). This reveals a fundamental tenet of orbital mechanics: a satellite's speed is entirely dictated by its orbital radius, completely independent of the satellite's mass.",
    mathAr: "بمساواة قوة الجاذبية الكونية بالقوة الطاردة المركزية (G·M·m/r² = m·v²/r)، نستنتج معادلة السرعة المدارية المماسية: v = √(G · M / r). تكشف هذه المعادلة عن حقيقة مذهلة في الميكانيكا المدارية: سرعة القمر الصناعي يحددها حصرياً نصف قطر المدار والارتفاع، وهي مستقلة تماماً عن كتلة القمر نفسه.",
    historyEn: "Johannes Kepler formulated his three empirical laws of planetary motion in the early 17th century based on Tycho Brahe's rigorous astronomical observations. In 1687, Isaac Newton published his 'Principia,' showing that Kepler's ellipses were a direct mathematical consequence of his inverse-square law of universal gravitation.",
    historyAr: "صاغ يوهانس كيبلر قوانينه الثلاثة لحركة الكواكب في مطلع القرن السابع عشر بالاعتماد على أرصاد تايكو براهي الفلكية الدقيقة. وفي عام 1687، نشر إسحاق نيوتن كتابه الشهير 'المبادئ'، موضحاً أن مدارات كيبلر الإهليلجية هي نتاج رياضي مباشر لقانون الجاذبية العام ذي التربيع العكسي.",
    challengeEn: "Spacecraft operate in harsh vacuum environments but are still threatened by space debris and orbital decay in Low Earth Orbit (LEO) due to atmospheric drag. Satellites must utilize active thrusters (chemical or electric Hall-effect ion engines) to execute periodic station-keeping burns to raise altitude and avoid burning up in the atmosphere.",
    challengeAr: "تعمل المركبات في الفراغ القاسي ومع ذلك يهددها حطام الفضاء والاضمحلال المداري في المدارات المنخفضة (LEO) بفعل احتكاك الغلاف الجوي الرقيق. يجب على الأقمار استخدام محركات دفع نشطة (مثل محركات الأيونات ذات تأثير هول) للقيام بمناورات تصحيح المسار الدورية لرفع الارتفاع وتجنب السقوط المدمر."
  },
  'nuclear-reactor': {
    titleEn: "Nuclear Fission Physics, Neutron Cross-Section & Thermodynamic Loops",
    titleAr: "فيزياء الانشطار النووي، المقطع العرضي للنيوترونات والحلقات الديناميكية",
    thesisEn: "A nuclear reactor converts nuclear binding energy into thermal energy. The core relies on a self-sustaining chain reaction: heavy isotopes of Uranium-235 absorb a free thermal neutron, becoming unstable and splitting into two lighter fission fragments while releasing 2 to 3 energetic neutrons and massive heat. To maintain a steady reaction, these neutrons must be slowed down by a moderator (like water) to increase their capture probability, and control rods made of neutron-absorbing elements (cadmium or boron) must be inserted or extracted to manage the neutron population.",
    thesisAr: "يقوم المفاعل النووي بتحويل طاقة الترابط النووي داخل النواة إلى طاقة حرارية. يعتمد قلب المفاعل على تفاعل تسلسلي ذاتي التغذية: تمتص النظائر الثقيلة لليورانيوم-235 نيوتروناً حراً بطيئاً، فتصبح غير مستقرة وتنشطر لنواتين أخف وزناً مع تحرير نيوترونين أو ثلاثة نيوترونات إضافية وحرارة هائلة. وللحفاظ على انتظام التفاعل، يجب إبطاء هذه النيوترونات بواسطة مهدئ (كالماء) لزيادة احتمالية صيدها، بينما تُستخدم قضبان التحكم (الكادميوم أو البورون) لامتصاص النيوترونات الزائدة وتوجيه التفاعل.",
    mathEn: "The core multiplication factor (k) dictates reactor state: k = (neutrons produced in generation n) / (neutrons absorbed/lost in generation n). If k = 1, the reactor is critical (stable power). If k > 1, the power grows exponentially (supercritical). The heat power is modeled by P = Nf · Ef · (1 - Cd), demonstrating control rod insertion (Cd) as the primary braking coefficient.",
    mathAr: "يحدد معامل التضاعف للقلب (k) حالة استقرار المفاعل: k = (النيوترونات المنتجة في الجيل n) / (النيوترونات الممتصة أو المفقودة في الجيل n). فإذا كان k = 1، يكون المفاعل في حالة 'حرجة مستقرة' (إنتاج ثابت للقدرة). وإذا تخطى k > 1، يتضاعف التفاعل أسياً. وتُحسب القدرة الحرارية بالمعادلة: P = Nf · Ef · (1 - Cd)، حيث يمثل عمق قضبان الكادميوم (Cd) معامل الكبح الأساسي للتفاعل.",
    historyEn: "Enrico Fermi and his team built Chicago Pile-1 in December 1942, achieving the world's first artificial self-sustaining nuclear chain reaction. In 1954, Obninsk Nuclear Power Plant in the Soviet Union became the first utility-scale reactor to generate electricity for a civilian grid, opening the era of peaceful nuclear power.",
    historyAr: "بنى إنريكو فيرمي وفريقه مفاعل 'شيكاغو بايل-1' في ديسمبر 1942، محققين أول تفاعل تسلسلي انشطاري ذاتي التغذية من صنع البشر. وفي عام 1954، أصبحت محطة أوبنينسك في الاتحاد السوفيتي أول مفاعل نووي تجاري يولد الكهرباء لشبكة مدنية، فاتحةً الباب لعصر الطاقة النووية السلمية.",
    challengeEn: "Nuclear engineering demands absolute safety barriers. Meltdown risks are countered by passive safety designs—systems that cool the reactor core via natural convection without electricity or pump actions. Standard operating procedures dictate multiple deep redundant containments to prevent release of iodine-131 or cesium-137 isotopes under any casualty scenario.",
    challengeAr: "تتطلب الهندسة النووية حواجز أمان مطلقة وخطوط دفاع متعددة. تُعالج مخاطر الانصهار بأنظمة الأمان السلبية (Passive Safety)؛ وهي تبريد قلب المفاعل بالاعتماد على قوى الجاذبية والحث الحراري الطبيعي دون الحاجة للكهرباء أو تشغيل المضخات، مع وجود قباب احتواء خرسانية فولاذية لمنع تسرب النظائر المشعة تحت أي ظرف طارئ."
  },
  'submarine-diving': {
    titleEn: "Fluid Statics, Archimedes Principle & Hydrostatic Pressure",
    titleAr: "الاستاتيكا المائية، مبدأ أرخميدس والضغط الهيدروستاتيكي للنظام",
    thesisEn: "A submarine navigates a vertical fluid column by manipulating the Archimedes buoyancy principle. Any object submerged in a fluid experiences an upward buoyant force equal to the weight of the fluid it displaces. To submerge, the submarine floods its double-walled ballast tanks with seawater, increasing its net mass until it exceeds the constant upward buoyant force (negative buoyancy). To rise, high-pressure compressed air is blown into the tanks, forcing the water out and restoring positive buoyancy.",
    thesisAr: "تبحر الغواصة رأسياً في مياه المحيط بالاعتماد على قانون أرخميدس للطفو المائي. يواجه أي جسم مغمور في سائل قوة دفع رأسية صاعدة تعادل تماماً وزن السائل المزاح بواسطة الجسم. وللغوص للأسفل، تفتح الغواصة صمامات غمر خزانات الموازنة الجانبية ليدخل ماء البحر، مما يرفع كتلتها الإجمالية لتتفوق على قوة الطفو (طفو سالب). وللارتفاع، يتم ضخ هواء عالي الضغط داخل الخزانات لطرد المياه للخارج واستعادة طفو موجب.",
    mathEn: "The vertical force balance is given by Fb = ρ_water · V_sub · g - M_sub. Submarines achieve neutral buoyancy (hovering) when Fb = 0. Furthermore, structural design must withstand severe hydrostatic pressure at depth: Ph = ρ_water · g · h, where h is depth. This pressure compresses the steel hull, requiring high-strength cylindrical frames.",
    mathAr: "تُصاغ معادلة القوى الرأسية للطفو كالآتي: Fb = ρ_water · V_sub · g - M_sub. وتصل الغواصة للطفو المتوازن (Hovering) المعلق عند تلاشي القوة وصيرورتها صفراً Fb = 0. ويجب أن يتحمل الهيكل الفولاذي الضغط الهيدروستاتيكي الساحق في الأعماق: Ph = ρ_water · g · h، حيث h هو العمق، مما يضغط البدن الحديدي ويتطلب دعامات أسطوانية فولاذية فائقة الصلابة.",
    historyEn: "Archimedes of Syracuse discovered his displacement principle while sitting in his bath around 250 BC. The military realization of this concept came in 1775 with David Bushnell's 'Turtle' (the first combat submarine) and matured globally during WWI with diesel-electric fleet submarines capable of deep dive navigation.",
    historyAr: "اكتشف أرخميدس مبدأ الإزاحة المائية الشهير أثناء استحمامه في الإناء حوالي 250 قبل الميلاد. وتحقق التطبيق العسكري الفعلي لهذا القانون عام 1775 مع غواصة 'السلحفاة' لديفيد بوشنل (أول غواصة قتالية)، قبل أن ينضج عالمياً خلال الحرب العالمية الأولى بغواصات الديزل والكهرباء القابلة للغوص العميق والملاحة الطويلة.",
    challengeEn: "The extreme engineering constraint is the hull's 'crush depth.' At excessive depth, hydrostatic forces exceed the yield strength of the steel structure, leading to instantaneous elastic hull collapse (implosion). Submarine builders use advanced titanium alloys, HY-80 steel, and spherical pressure compartments to operate safely in the bathypelagic zone.",
    challengeAr: "تتمثل العقبة الكبرى في الهندسة البحرية في 'عمق السحق' (Crush Depth). فعند الأعماق الفائقة، تتجاوز قوى الضغط المائي قوة مرونة البدن المعدني، مما يؤدي لانفجار داخلي ساحق وفوري (Implosion). ولذا تستخدم صناعة الغواصات سبائك التيتانيوم المتطورة، وفولاذ HY-80، وقمرات الضغط الكروية للإبحار الآمن بظلمات البحار."
  },
  'gps-trilateration': {
    titleEn: "Trilateration Geometry, Relativity & Atomic Clock Resonance",
    titleAr: "هندسة التقاطع الدائري، قوانين النسبية والرنين الذري للساعات",
    thesisEn: "Your phone does not locate itself using GPS by sending signals to outer space; it is a passive listener. The GPS network consists of 24+ satellites broadcasting orbital position and time encoded on radio signals. By calculating the microsecond signal propagation delay from at least three satellites, your phone draws intersecting spheres of potential locations. A fourth satellite is mathematically required to align your handset's cheap quartz clock with the precise atomic clocks in space, locating you on Earth.",
    thesisAr: "لا يحدد هاتفك موقعه بإرسال إشارات للفضاء الخارجي؛ بل هو مستمع صامت لترددات الأقمار. يتكون نظام GPS من أكثر من 24 قمراً صناعياً تبث إحداثياتها المدارية والزمنية بدقة فائقة عبر موجات الراديو. وبحساب زمن تأخر انتقال الإشارة بالميكروثانية من ثلاثة أقمار على الأقل، يرسم الهاتف ثلاث دوائر تتقاطع في موقعك الجغرافي. ويتطلب الأمر قسراً قمرًا رابعاً لمعايرة ومزامنة ساعة هاتفك الرخيصة مع الساعات الذرية الفائقة للأقمار.",
    mathEn: "Distance (d) to satellite i is modeled by d_i = c · Δt_i, where c is speed of light. Because c is immense, a mere 1-nanosecond clock error drifts your location by 30 centimeters! To maintain accuracy, calculations must correct for Einstein's theories: Special Relativity causes satellites to lose 7 microseconds/day due to high velocity, while General Relativity causes them to gain 45 microseconds/day due to weaker gravity. Net correction: +38 microseconds/day.",
    mathAr: "تُحسب المسافة (d) للقمر i بالمعادلة: d_i = c · Δt_i، حيث c سرعة الضوء. ونظراً لسرعة الضوء الهائلة، فإن خطأً قدره نانوثانية واحدة في الساعة يحرف موقعك بـ 30 سنتيمتراً! ولذا، تصحح الحسابات آلياً وفقاً لنظريات أينشتاين: فالنسبية الخاصة تبطئ ساعات الأقمار بـ 7 ميكروثانية يومياً لسرعتها، بينما النسبية العامة تسرعها بـ 45 ميكروثانية يومياً لضعف الجاذبية بالمدار. صافي التعديل: +38 ميكروثانية يومياً.",
    historyEn: "The US Department of Defense launched the first experimental NAVSTAR satellite in 1978. Developed to guide intercontinental missiles, the system was opened to global civilian use in the 1980s, entirely transforming modern transportation, agriculture, and rescue operations.",
    historyAr: "أطلقت وزارة الدفاع الأمريكية أول قمر صناعي تجريبي لنظام NAVSTAR عام 1978. صُمم النظام لتوجيه الصواريخ العابرة للقارات بدقة، وأُتيح للاستخدام المدني العالمي في الثمانينات، مما أحدث ثورة شاملة في الملاحة الجوية والبحرية والزراعة وعمليات الإنقاذ.",
    challengeEn: "The modern challenge is maintaining positioning accuracy inside dense urban cities. Tall concrete skyscrapers reflect satellite radio waves, creating 'multipath interference' where the receiver gets multiple delayed versions of the same signal, throwing off time calculations. Device designers use multi-band GNSS chips and localized inertial sensors to bridge the gaps.",
    challengeAr: "يتمثل التحدي المعاصر في الحفاظ على دقة التموضع داخل المدن المكتظة ناطحات السحاب. تعكس المباني الخرسانية موجات الراديو، مسببة 'تداخلات المسارات المتعددة' (Multipath Interference)؛ حيث يستقبل الهاتف نسخاً متعددة ومتأخرة من ذات الإشارة مما يضلل الحسابات. يحل المصممون ذلك برقاقات الملاحة متعددة النطاقات والمستشعرات الذاتية المساعدة."
  },
  'electricity-home': {
    titleEn: "AC Power Grid Synthesis, Transformers & Grid Balancing",
    titleAr: "توليد شبكات التيار المتردد، محولات الجهد وموازنة الأحمال",
    thesisEn: "The household electrical grid is a sprawling, synchronized machine. Electricity is generated as Alternating Current (AC) because it oscillates sinusoidally, allowing magnetic induction. Since long copper transmission cables exhibit resistance, moving immense electric current causes substantial heat loss. To minimize this, step-up transformers raise voltage to super-high values (up to 500,000V) before transit, lowering current proportionally. Neighborhood step-down transformers then bring it back to safe levels (110-220V) for appliances.",
    thesisAr: "شبكة الكهرباء المنزلية هي آلة متزامنة عملاقة ممتدة عبر القارات. يتم توليد الكهرباء كتيار متردد (AC) لأنه يتذبذب جيبياً مما يسمح بظاهرة الحث المغناطيسي. ولأن كابلات النحاس الطويلة تبدي ممانعة مادية، فإن نقل تيار ضخم يتسبب في هدر حراري هائل. ولتقليص هذا الفقد، ترفع محولات الرفع الفولتية لقيم فائقة (تصل لـ 500,000 فولت) قبل بثها، مما يقلل شدة التيار الساري. ثم تقوم محولات الخفض بالأحياء بإعادة الجهد لمعدلات آمنة (110-220 فولت) لتشغيل المنازل.",
    mathEn: "Power loss (Pl) in transmission is modeled by Pl = I² · R. Since power is P = V · I, stepping up voltage (V) by a factor of 10 drops the required current (I) by a factor of 10, reducing transmission thermal losses by a factor of 100! At the household level, total grid capacity must constantly balance consumption in real-time to avoid thermal substation shutdown.",
    mathAr: "يُحسب فقد القدرة الكهربائية (Pl) بالمعادلة: Pl = I² · R. وبما أن القدرة الكلية هي P = V · I، فإن رفع الجهد (V) بمقدار 10 أضعاف يقلل شدة التيار (I) بمقدار 10 أضعاف، مما يخفض خسائر الفقد الحراري بالأسلاك بمقدار 100 ضعف! وعلى مستوى الاستهلاك، يجب أن تتوازن الطاقة المتولدة مع الأحمال الحقيقية فوراً لقطع حدوث فرط تيار وتوقف المحطات.",
    historyEn: "The famous 'War of the Currents' in the late 1880s pitted Thomas Edison's Direct Current (DC) against Nikola Tesla's Alternating Current (AC). Tesla's AC won because of its ability to utilize transformers designed by William Stanley Jr., enabling efficient long-distance power distribution that built the modern industrial world.",
    historyAr: "اندلعت 'حرب التيارات' الشهيرة في أواخر ثمانينات القرن التاسع عشر بين تيار توماس إديسون المستمر (DC) وتيار نيكولا تسلا المتردد (AC). وانتصر تيار تسلا المتردد لقدرته الفائقة على استخدام المحولات الحثية، مما سمح بتوزيع الطاقة لمسافات جغرافية شاسعة وتأسيس النهضة الصناعية الحديثة.",
    challengeEn: "The primary challenge in the modern smart grid is integrating intermittent renewable energy sources like wind and solar. Unlike fossil-fuel plants, solar power fluctuates rapidly with cloud cover. Grid operators utilize smart computer balancing nodes, high-capacity utility-scale chemical batteries, and grid-tied synchronous condensers to maintain precise 50/60 Hz frequency stability.",
    challengeAr: "التحدي الأكبر للشبكات الذكية المعاصرة هو دمج مصادر الطاقة المتجددة المتقطعة كالرياح والشمس. فعلى عكس محطات الغاز، تتقلب الطاقة الشمسية بمرور السحب. يستخدم مشغلو الشبكات عقد موازنة حاسوبية، وبطاريات كيميائية عملاقة للتخزين السريع، ومكثفات تزامنية لحفظ تذبذب تردد الشبكة بدقة عند 50/60 هرتز بوضع مستمر."
  }
};

import { AcademicTheory } from '../types';

interface TheoreticalLectureNotesProps {
  topicId: string;
  lang: 'en' | 'ar';
  customTheory?: AcademicTheory;
}

export default function TheoreticalLectureNotes({
  topicId,
  lang,
  customTheory
}: TheoreticalLectureNotesProps) {
  const theory = customTheory || THEORY_DATABASE[topicId];
  const [activeTab, setActiveTab] = useState<'thesis' | 'math' | 'history' | 'challenge'>('thesis');

  if (!theory) return null;

  return (
    <div
      className="bg-[#08080A] border border-white/10 p-6 md:p-8 xl:p-10 rounded-none flex flex-col gap-6 shadow-2xl text-start relative overflow-hidden lg:col-span-2"
      id="deep_theory_notes_panel"
    >
      {/* Decorative Blueprint Lines Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="flex items-center gap-2 border-b border-white/10 pb-4 justify-between relative z-10 flex-wrap gap-y-3">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="text-amber-500 shrink-0" size={18} />
          <div className="flex flex-col">
            <h3 className="text-xs uppercase tracking-widest font-bold text-white">
              {lang === 'ar' ? 'المكتبة الأكاديمية وكراسة النظرية المعمقة' : "Physicist's Notebook & Academic Lecture Notes"}
            </h3>
            <span className="text-[10px] text-slate-400 font-serif italic mt-0.5">
              {lang === 'ar' ? theory.titleAr : theory.titleEn}
            </span>
          </div>
        </div>

        <span className="text-[8px] font-mono text-amber-500 border border-amber-500/30 bg-amber-500/5 px-2.5 py-1 uppercase tracking-wider">
          {lang === 'ar' ? 'دراسة أكاديمية متقدمة' : 'Advanced Academic Research'}
        </span>
      </div>

      {/* Tabs navigation for depth */}
      <div className="flex flex-wrap border-b border-white/5 relative z-10" id="theory_tabs_bar">
        <button
          onClick={() => setActiveTab('thesis')}
          className={`px-4 py-3 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'thesis'
              ? 'border-amber-500 text-amber-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <BrainCircuit size={11} />
            <span>{lang === 'ar' ? 'الأطروحة الفيزيائية' : 'The Thesis'}</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('math')}
          className={`px-4 py-3 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'math'
              ? 'border-amber-500 text-amber-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <BookOpen size={11} />
            <span>{lang === 'ar' ? 'النمذجة والمعادلات' : 'Math Modeling'}</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-3 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'border-amber-500 text-amber-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <History size={11} />
            <span>{lang === 'ar' ? 'السياق التاريخي' : 'Historical Context'}</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('challenge')}
          className={`px-4 py-3 text-[10px] font-mono uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'challenge'
              ? 'border-amber-500 text-amber-400 bg-white/5'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Lightbulb size={11} />
            <span>{lang === 'ar' ? 'التحديات المعاصرة' : 'Modern Challenges'}</span>
          </div>
        </button>
      </div>

      {/* Deep text body content */}
      <div className="relative z-10 min-h-[140px]" id="theory_tab_content_container">
        {activeTab === 'thesis' && (
          <div className="flex flex-col gap-3 animate-fade-in text-start">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
              {lang === 'ar' ? 'تفسير الظواهر الفيزيائية الطبيعية الكامنة' : 'Decoupling Underlying Natural Physics Phenomena'}
            </span>
            <p className="text-sm text-[#F1F5F9] leading-relaxed font-normal">
              {lang === 'ar' ? theory.thesisAr : theory.thesisEn}
            </p>
          </div>
        )}

        {activeTab === 'math' && (
          <div className="flex flex-col gap-3 animate-fade-in text-start">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
              {lang === 'ar' ? 'الصيغ الحاكمة ومعاملات الأنظمة الرياضية' : 'Governing Equations & Mathematical System Coefficients'}
            </span>
            <p className="text-sm text-[#F1F5F9] leading-relaxed font-normal font-sans">
              {lang === 'ar' ? theory.mathAr : theory.mathEn}
            </p>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col gap-3 animate-fade-in text-start">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
              {lang === 'ar' ? 'قصة الاستكشاف العلمي ونشأة النظريات' : 'The Narrative of Scientific Discoveries & Origins'}
            </span>
            <p className="text-sm text-[#F1F5F9] leading-relaxed font-normal">
              {lang === 'ar' ? theory.historyAr : theory.historyEn}
            </p>
          </div>
        )}

        {activeTab === 'challenge' && (
          <div className="flex flex-col gap-3 animate-fade-in text-start">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">
              {lang === 'ar' ? 'العقبات الهندسية المعاصرة وتطوير التكنولوجيا' : 'Contemporary Engineering Constraints & Technological Frontiers'}
            </span>
            <p className="text-sm text-[#F1F5F9] leading-relaxed font-normal">
              {lang === 'ar' ? theory.challengeAr : theory.challengeEn}
            </p>
          </div>
        )}
      </div>

      {/* Decorative quotation badge */}
      <div className="border-t border-white/5 pt-4 flex justify-between items-center relative z-10 text-[9px] font-mono text-slate-500">
        <span>
          {lang === 'ar' ? 'دفتر الملاحظات المتقدم © ٢٠٢٦' : "Advanced Physicist's Archive © 2026"}
        </span>
        <span className="italic uppercase">
          {lang === 'ar' ? 'المعرفة تُبنى بالتأمل والملاحظة' : 'Knowledge is built on observation'}
        </span>
      </div>
    </div>
  );
}
