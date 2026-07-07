import { TopicComponentNode, NodeConnection } from '../types';
import { motion } from 'motion/react';
import { Info, HelpCircle } from 'lucide-react';
import { UI_STRINGS } from '../lib/translations';

interface VisualBlueprintProps {
  nodes: TopicComponentNode[];
  connections: NodeConnection[];
  activeNodeIds?: string[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  lang?: 'en' | 'ar';
}

export default function VisualBlueprint({
  nodes,
  connections,
  activeNodeIds = [],
  selectedNodeId,
  onSelectNode,
  lang = 'en'
}: VisualBlueprintProps) {
  // Find currently hovered/selected component details to render a technical sidecar sheet
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const getLocalizedNodeType = (type: string) => {
    if (lang === 'en') return type;
    switch (type) {
      case 'input': return 'مدخل نظام / حافّة';
      case 'control': return 'عضو تحكم / تنظيم';
      case 'output': return 'مخرجات / ناتج';
      case 'storage': return 'مستودع / خزان كيميائي';
      default: return 'عُقدة داخلية / دمج';
    }
  };

  return (
    <div className="flex flex-col gap-6" id="visual_blueprint_container">
      <div className="relative w-full h-[360px] bg-[#050507] border border-white/10 rounded-none overflow-hidden backdrop-blur-md" id="blueprint_blueprint_stage">
        {/* Technical blueprints graph watermark background lines with luxury amber touch */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid-sub" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-sub)" />
          </svg>
        </div>

        {/* Live SVG connection conduits with dynamic drifting flows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" id="blueprint_conduits_grid" viewBox="0 0 100 100" preserveAspectRatio="none">
          {connections.map((c, idx) => {
            const fromNode = nodes.find(n => n.id === c.fromId);
            const toNode = nodes.find(n => n.id === c.toId);
            if (!fromNode || !toNode) return null;

            // Map absolute node positioning coordinates on stage (calculating layout on runtime width/height)
            const x1 = `${fromNode.x}%`;
            const y1 = `${fromNode.y}%`;
            const x2 = `${toNode.x}%`;
            const y2 = `${toNode.y}%`;

            // Draw clean arc lines instead of standard straight ones for systemic aesthetic look
            const cx = (fromNode.x + toNode.x) / 2;
            const cy = (fromNode.y + toNode.y) / 2 - 8; // slight arc lift
            const dPath = `M ${fromNode.x} ${fromNode.y} Q ${cx} ${cy} ${toNode.x} ${toNode.y}`;

            const isActivePath = activeNodeIds.includes(c.fromId) && activeNodeIds.includes(c.toId);

            return (
              <g key={`conduit-${idx}`} className="transition-all duration-300">
                {/* Background Shadow line */}
                <path
                  d={dPath}
                  className="fill-none stroke-black/80"
                  strokeWidth="6"
                  pathLength="100"
                />
                
                {/* Connecting wire trunk */}
                <path
                  d={dPath}
                  className={`fill-none transition-all duration-300 ${
                    isActivePath 
                      ? 'stroke-amber-500/70' 
                      : 'stroke-white/10'
                  }`}
                  strokeWidth="1.5"
                  pathLength="100"
                />

                {/* Animated Flow Particles */}
                {c.flowDirection !== 'none' && (
                  <path
                    d={dPath}
                    className={`fill-none stroke-amber-400 stroke-dasharray-[14,24] ${
                      isActivePath ? 'animate-[dash_2.5s_linear_infinite]' : 'animate-[dash_6s_linear_infinite]'
                    }`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    pathLength="100"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive functional system nodes */}
        {nodes.map(node => {
          const isActive = activeNodeIds.includes(node.id);
          const isSelected = selectedNodeId === node.id;
          
          let nodeTypeColor = "border-white/10 hover:border-amber-500/50 bg-[#08080A]/80";
          if (node.type === "input") nodeTypeColor = "border-amber-500/20 hover:border-amber-500 bg-[#08080A]/90 hover:bg-black";
          if (node.type === "control") nodeTypeColor = "border-amber-500/20 hover:border-amber-500 bg-[#08080A]/90 hover:bg-black";
          if (node.type === "output") nodeTypeColor = "border-amber-500/20 hover:border-amber-500 bg-[#08080A]/90 hover:bg-black";
          if (node.type === "storage") nodeTypeColor = "border-amber-500/20 hover:border-amber-500 bg-[#08080A]/90 hover:bg-black";

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              onClick={() => onSelectNode(isSelected ? null : node.id)}
              id={`blueprint_node_${node.id}`}
            >
              <div
                className={`relative flex flex-col p-1 sm:p-2.5 rounded-none border text-center transition-all ${nodeTypeColor} ${
                  isSelected 
                    ? 'ring-1 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] border-amber-500' 
                    : isActive 
                      ? 'shadow-[0_0_12px_rgba(245,158,11,0.1)] border-white/20' 
                      : ''
                } w-[75px] sm:w-[120px]`}
              >
                {/* Node Label Display */}
                <div className="text-[7.5px] sm:text-[10px] uppercase font-bold tracking-wider text-white line-clamp-2 leading-tight sm:leading-normal">
                  {node.label}
                </div>

                {/* Micro Category Tag */}
                <div className="mt-0.5 sm:mt-1 text-[5.5px] sm:text-[7px] font-mono uppercase tracking-widest text-amber-500/60">
                  {getLocalizedNodeType(node.type)}
                </div>

                {/* Real-time floating status lamp */}
                <div className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isActive ? 'bg-amber-500' : 'bg-white/20'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    isActive ? 'bg-amber-500' : 'bg-white/30'
                  }`}></span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Quick instruction notice */}
        <div className={`absolute bottom-3 ${lang === 'ar' ? 'right-3' : 'left-3'} flex items-center gap-1.5 bg-black border border-white/10 px-2.5 py-1 rounded-none text-[9px] uppercase tracking-wider text-[#D1D1D1]/60 pointer-events-none select-none`}>
          <Info size={11} className="text-amber-500" />
          {UI_STRINGS[lang].clickNodesGuide}
        </div>
      </div>

      {/* Selected Component Drawer/Details Board Panels */}
      {selectedNode ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#08080A] border border-white/10 p-5 rounded-none flex flex-col gap-2 relative shadow-xl"
          id="node_details_panel"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">{selectedNode.label}</h4>
            </div>
            <span className="text-[8px] font-mono px-2 py-0.5 rounded-none bg-white/5 text-amber-500 uppercase tracking-widest border border-white/10">
              {getLocalizedNodeType(selectedNode.type)}
            </span>
          </div>
          
          <p className="text-xs text-[#D1D1D1] font-light leading-relaxed">
            {selectedNode.description}
          </p>

          {selectedNode.statusLabel && (
            <div className="mt-2 text-[10px] font-mono text-amber-500 bg-amber-500/5 px-2.5 py-2 rounded-none flex items-center gap-2 border border-amber-500/10">
              <span className="inline-block w-1 h-1 rounded-full bg-amber-500 animate-ping" />
              <span>{UI_STRINGS[lang].principleFunction}: {selectedNode.statusLabel}</span>
            </div>
          )}

          <button
            onClick={() => onSelectNode(null)}
            className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} text-[#D1D1D1]/65 hover:text-white text-[9px] uppercase tracking-widest border border-white/10 hover:border-white/30 px-2 py-0.5 rounded-none transition`}
          >
            {UI_STRINGS[lang].clearButton}
          </button>
        </motion.div>
      ) : (
        <div className="bg-[#08080A]/40 border border-white/5 border-dashed p-4 rounded-none text-center text-[10px] uppercase tracking-wider text-[#D1D1D1]/40 flex items-center justify-center gap-2">
          <HelpCircle size={14} className="text-white/25" />
          {UI_STRINGS[lang].selectNodePrompt}
        </div>
      )}
    </div>
  );
}

