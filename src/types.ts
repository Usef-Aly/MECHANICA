export interface TopicComponentNode {
  id: string;
  label: string;
  description: string;
  x: number; // Percentage x coordinate (0 to 100)
  y: number; // Percentage y coordinate (0 to 100)
  type: 'input' | 'process' | 'output' | 'control' | 'storage';
  statusLabel?: string;
}

export interface NodeConnection {
  fromId: string;
  toId: string;
  label?: string;
  flowDirection?: 'forward' | 'backward' | 'none';
  flowSpeedMultiplier?: number;
}

export interface SimulationParam {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  description: string;
}

export interface SimulationConfig {
  params: SimulationParam[];
  visualizerType: 
    | 'aerodynamics' 
    | 'electricity' 
    | 'network' 
    | 'bridge-forces' 
    | 'satellite-orbit' 
    | 'nuclear-reactor' 
    | 'submarine-ballast' 
    | 'gps-trilateration' 
    | 'elevator-forces'
    | 'electricity-home'
    | 'dynamic-generator'; // For AI-powered dynamic topics
  // For dynamic generators
  formula?: string; // High-level metadata
  customRenderScript?: string; // Hints for generic renderer
}

export interface ExplanationStep {
  title: string;
  description: string;
  highlightNodes?: string[]; // IDs of nodes to pulse
  highlightConnections?: string[]; // Connections to animate
  visualAction?: string; // specific visual state
}

export interface AcademicTheory {
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

export interface Topic {
  id: string;
  title: string;
  category: string;
  summary: string;
  iconName: string; // lucide icon name
  nodes: TopicComponentNode[];
  connections: NodeConnection[];
  simulation: SimulationConfig;
  steps: ExplanationStep[];
  realWorldApplications?: string[];
  theory?: AcademicTheory;
  qAndA?: {
    question: string;
    answer: string;
    why?: string;
    example?: string;
    tryIt?: { paramId: string; value: number; comment?: string };
  }[];
}

// Format for the AI-generated topic schemas
export interface AIDynamicTopicResponse {
  title: string;
  category: string;
  summary: string;
  iconName: string;
  nodes: TopicComponentNode[];
  connections: NodeConnection[];
  simulation: {
    params: SimulationParam[];
    visualTypeHint: string; // e.g. "wave", "transfer", "flow", "lever"
    description: string;
  };
  steps: ExplanationStep[];
  realWorldApplications: string[];
  theory?: AcademicTheory;
  qAndA: { question: string; answer: string }[];
}
