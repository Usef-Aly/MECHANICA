import { useEffect, useState } from 'react';
import { ExplanationStep } from '../types';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { UI_STRINGS } from '../lib/translations';

interface StepExplorationProps {
  steps: ExplanationStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  lang?: 'en' | 'ar';
}

export default function StepExploration({
  steps,
  currentStepIndex,
  onStepChange,
  lang = 'en'
}: StepExplorationProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play interval timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      if (currentStepIndex < steps.length - 1) {
        onStepChange(currentStepIndex + 1);
      } else {
        onStepChange(0); // loop back
      }
    }, 5500); // 5.5 seconds per explanatory step

    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, steps.length, onStepChange]);

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      onStepChange(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    onStepChange(0);
  };

  return (
    <div className="bg-[#08080A] border border-white/10 p-6 rounded-none flex flex-col gap-5 shadow-xl" id="step_exploration_panel">
      {/* Playback Controls Panel */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-[#D1D1D1]/60 uppercase">
            {UI_STRINGS[lang].causalitySequence}
          </span>
          <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded-none text-amber-500 border border-white/10">
            {UI_STRINGS[lang].stageCount
              .replace('{current}', String(currentStepIndex + 1))
              .replace('{total}', String(steps.length))}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-none border border-white/10 hover:border-amber-500/50 text-[#D1D1D1] disabled:opacity-20 disabled:pointer-events-none hover:bg-white/5 transition-all cursor-pointer"
            title={UI_STRINGS[lang].prevStep}
          >
            {lang === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-none flex items-center justify-center transition-all border cursor-pointer ${
              isPlaying 
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                : 'bg-transparent border-white/10 hover:border-amber-500/50 text-[#D1D1D1]'
            }`}
            title={isPlaying ? UI_STRINGS[lang].pauseAuto : UI_STRINGS[lang].playAuto}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-1.5 rounded-none border border-white/10 hover:border-amber-500/50 text-[#D1D1D1] disabled:opacity-20 disabled:pointer-events-none hover:bg-white/5 transition-all cursor-pointer"
            title={UI_STRINGS[lang].nextStep}
          >
            {lang === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-none border border-white/10 hover:border-amber-500/50 text-[#D1D1D1]/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            title={UI_STRINGS[lang].resetStep}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main explanation body with animated transitions */}
      <div className="min-h-[110px] relative">
        {steps.map((step, idx) => {
          if (idx !== currentStepIndex) return null;
          return (
            <motion.div
              key={`step-${idx}`}
              initial={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: lang === 'ar' ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2.5 text-start"
              id={`step_card_content_${idx}`}
            >
              <h3 className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {step.title}
              </h3>
              <p className="text-sm text-[#F1F5F9] font-normal leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Numerical step node selection rail */}
      <div className="flex gap-1 h-1">
        {steps.map((_, idx) => (
          <button
            key={`bullet-${idx}`}
            onClick={() => {
              setIsPlaying(false);
              onStepChange(idx);
            }}
            className={`flex-1 h-1 rounded-none transition-all duration-300 cursor-pointer ${
              idx === currentStepIndex 
                ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

