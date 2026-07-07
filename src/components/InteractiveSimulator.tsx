import { useEffect, useRef, useState } from 'react';
import { SimulationConfig } from '../types';

interface InteractiveSimulatorProps {
  type: SimulationConfig['visualizerType'];
  params: Record<string, number>;
  activeStepNodeIds?: string[];
  lang?: 'en' | 'ar';
  visualTypeHint?: string;
}

export default function InteractiveSimulator({
  type,
  params,
  activeStepNodeIds = [],
  lang = 'en',
  visualTypeHint
}: InteractiveSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [infoOverlay, setInfoOverlay] = useState<string>('');
  const [submarineWaterLevel, setSubmarineWaterLevel] = useState(25);
  const submarineWaterRef = useRef(25);

  // Calculate dynamic info fields for the horizontal bottom info bar
  const loadVal = params.load ?? 2;
  let statusText = '';
  let statusColor = '#f59e0b';
  let currentInAmps = 15;

  if (loadVal === 1) {
    statusText = lang === 'ar' ? 'حمل منخفض: النظام مستقر وآمن' : 'LOW LOAD: SYSTEM STABLE';
    statusColor = '#10b981';
    currentInAmps = 5;
  } else if (loadVal === 2) {
    statusText = lang === 'ar' ? 'حمل متوسط: ضغط طبيعي وسلس كلياً' : 'MEDIUM LOAD: SYSTEM OPTIMAL';
    statusColor = '#f59e0b';
    currentInAmps = 15;
  } else if (loadVal === 3) {
    statusText = lang === 'ar' ? 'حمل مرتفع: حرارة الأسلاك والتحمل ترتفع!' : 'HIGH LOAD: WIRE TEMPERATURE RISING';
    statusColor = '#f97316';
    currentInAmps = 32;
  } else {
    statusText = lang === 'ar' ? 'انقطاع كهرباء: فرط الحمل وتحفيز قواطع الأمان!' : 'OVERLOAD: BREAKERS TRIPPED OUTAGE';
    statusColor = '#ef4444';
    currentInAmps = 0;
  }

  // Pure deterministic calculations for React-based Bottom Info Bar
  // 1. Aerodynamics
  const aeroSpeed = params.speed || 300;
  const aeroAttack = params.attack || 8;
  const aeroLiftCoeff = Math.sin((aeroAttack * Math.PI) / 180) * 1.5;
  const aeroLift = Math.round(aeroSpeed * aeroSpeed * aeroLiftCoeff * 0.003);
  const aeroDrag = Math.round(aeroSpeed * aeroSpeed * (1 - Math.cos((aeroAttack * Math.PI) / 180)) * 0.01 + aeroSpeed * 0.1);
  const aeroStalled = aeroAttack > 18;

  // 2. Simple Circuit Electricity
  const elecVoltage = params.voltage || 9;
  const elecResistance = params.resistance || 20;
  const elecCurrent = elecVoltage / elecResistance;

  // 3. Network BGP
  const netCongestion = params.congestion ?? 20;
  const netPacketSize = params.packetSize ?? 512;

  // 4. Bridge Forces
  const bridgeLoad = params.load || 50;
  const bridgeCableSlack = params.cableSlack || 30;
  const bridgeDeflection = bridgeLoad * 0.15;
  const bridgeAnchorPull = bridgeLoad * 14.5 * (bridgeCableSlack / 30);

  // 5. Satellite Orbit
  const satSpeed = params.orbitalSpeed ?? 7800;
  const satAltitude = params.altitude ?? 800;
  const satCrashing = satSpeed < 5500;
  const satEscaping = satSpeed > 10500;

  // 6. Nuclear Reactor
  const reactRodDepth = params.rodDepth ?? 60;
  const reactCoolantFlow = params.coolantFlow ?? 50;
  const reactFissionPower = Math.max(5, (100 - reactRodDepth) * 1.5);
  const reactTemp = Math.round(50 + (reactFissionPower * 5) - (reactCoolantFlow * 2));

  // 7. Submarine Ballast Depth
  const subDepth = Math.round(submarineWaterLevel * 2.8);

  // 8. GPS Trilateration
  const gpsTransitA = params.timeLagA ?? 72;
  const gpsTransitB = params.timeLagB ?? 67;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number; color?: string; angle?: number; type?: string }> = [];
    let frameCount = 0;

    // Responsive sizing using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width || 600;
        canvas.height = height || 360;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize specific simulation particle pools
    if (type === 'aerodynamics') {
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 4 + Math.random() * 2,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.5
      }));
    } else if (type === 'electricity') {
      particles = Array.from({ length: 40 }, (_, i) => ({
        x: (i / 40) * (canvas.width - 40) + 20,
        y: 0,
        speed: 2,
        size: 3,
        alpha: 1
      }));
    } else if (type === 'network') {
      particles = [];
    } else if (type === 'nuclear-reactor') {
      particles = Array.from({ length: 25 }, () => ({
        x: 100 + Math.random() * 80,
        y: 150 + Math.random() * 100,
        speed: 1 + Math.random() * 2,
        size: 2,
        alpha: 0.8,
        angle: Math.random() * Math.PI * 2
      }));
    }

    const render = () => {
      frameCount++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Dark background with technical grids
      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Render simulator models by type
      if (type === 'aerodynamics') {
        renderAerodynamics(ctx, w, h, params, particles, activeStepNodeIds);
      } else if (type === 'electricity') {
        renderElectricity(ctx, w, h, params, particles, frameCount);
      } else if (type === 'network') {
        renderNetwork(ctx, w, h, params, frameCount);
      } else if (type === 'bridge-forces') {
        renderBridgeForces(ctx, w, h, params);
      } else if (type === 'satellite-orbit') {
        renderSatelliteOrbit(ctx, w, h, params, frameCount);
      } else if (type === 'nuclear-reactor') {
        renderNuclearReactor(ctx, w, h, params, particles, frameCount);
      } else if (type === 'submarine-ballast') {
        const ventPercent = params.ventOpen ?? 0;
        const blowPercent = params.blowAir ?? 0;
        const changeRate = (ventPercent * 0.005) - (blowPercent * 0.015);
        submarineWaterRef.current = Math.min(100, Math.max(0, submarineWaterRef.current + changeRate));
        if (frameCount % 6 === 0) {
          setSubmarineWaterLevel(Math.round(submarineWaterRef.current));
        }
        renderSubmarineBallast(ctx, w, h, params, frameCount, submarineWaterRef.current);
      } else if (type === 'gps-trilateration') {
        renderGPSTrilateration(ctx, w, h, params);
      } else if (type === 'electricity-home') {
        renderElectricityHome(ctx, w, h, params, frameCount);
      } else {
        // Fallback or Dynamic AI representation
        renderDynamicGenerator(ctx, w, h, params, frameCount);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [type, params, activeStepNodeIds, visualTypeHint]);

  // AERO DYNAMICS RENDERER
  const renderAerodynamics = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    particles: any[],
    activeStepNodeIds: string[]
  ) => {
    const airspeed = params.speed || 300;
    const angleOfAttack = params.attack || 8;

    const wingX = w / 2;
    const wingY = h / 2 + 10;
    const wingLen = w * 0.45;
    const thickness = 28;

    // Drag forces calculations & Display vectors
    const liftCoeff = Math.sin((angleOfAttack * Math.PI) / 180) * 1.5;
    const calculatedLift = Math.round(airspeed * airspeed * liftCoeff * 0.003);
    const calculatedDrag = Math.round(airspeed * airspeed * (1 - Math.cos((angleOfAttack * Math.PI) / 180)) * 0.01 + airspeed * 0.1);

    // Dynamic warning if angles exceed stall bounds
    const isStalled = angleOfAttack > 18;

    // Draw lift and drag vectors on the wing
    ctx.shadowBlur = 0;
    const angleRad = (angleOfAttack * Math.PI) / 180;

    // Airfoil profile lines relative to wing angle
    ctx.save();
    ctx.translate(wingX, wingY);
    ctx.rotate(-angleRad);

    // Draw the actual airfoil shape
    ctx.beginPath();
    ctx.ellipse(0, 0, wingLen / 2, thickness, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = isStalled ? '#ef4444' : '#10b981';
    ctx.stroke();

    // Tungsten reference chord line
    ctx.beginPath();
    ctx.moveTo(-wingLen / 2 - 10, 0);
    ctx.lineTo(wingLen / 2 + 10, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();

    // Forces Arrows (Physics vectors)
    ctx.shadowColor = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.strokeStyle = isStalled ? '#ef4444' : '#3b82f6';
    ctx.fillStyle = isStalled ? '#ef4444' : '#3b82f6';

    const renderForceArrow = (fx: number, fy: number, dx: number, dy: number, len: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + dx * len, fy + dy * len);
      ctx.stroke();

      // arrowhead
      const arrowSize = 8;
      ctx.beginPath();
      ctx.moveTo(fx + dx * len, fy + dy * len);
      ctx.lineTo(fx + dx * len - dy * arrowSize - dx * arrowSize, fy + dy * len + dx * arrowSize - dy * arrowSize);
      ctx.lineTo(fx + dx * len + dy * arrowSize - dx * arrowSize, fy + dy * len - dx * arrowSize - dy * arrowSize);
      ctx.closePath();
      ctx.fill();
      
      // Text
      ctx.font = 'bold 11px system-ui';
      ctx.fillText(label, fx + dx * (len + 15) - 30, fy + dy * (len + 15) + 4);
    };

    if (!isStalled) {
      renderForceArrow(wingX, wingY - thickness, 0, -1, Math.max(10, Math.min(100, calculatedLift * 0.15)), '#10b981', `LIFT: ${calculatedLift} kN`);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 14px "JetBrains Mono"';
      ctx.fillText("⚠️ AIRFOIL STALL (LOSS OF LIFT)", wingX - 110, wingY - h / 3.5);
    }
    renderForceArrow(wingX + wingLen / 10, wingY, 1, 0, Math.max(15, Math.min(80, calculatedDrag * 0.3)), '#f59e0b', `DRAG: ${calculatedDrag} kN`);

    // Streamline particle simulation
    const streamSpeed = airspeed / 55;
    particles.forEach(p => {
      p.x += streamSpeed;
      if (p.x > w) {
        p.x = 0;
        p.y = Math.random() * h;
      }

      // Airflow warping around wing coordinates
      const dx = p.x - wingX;
      const dy = p.y - wingY;
      const chordHalf = wingLen / 2;

      if (p.x > wingX - chordHalf && p.x < wingX + chordHalf) {
        // Relative x from -chordHalf to chordHalf
        const rx = p.x - wingX;
        
        // Calculate the elevation of top/bottom boundary of wing
        const ratio = Math.sqrt(Math.max(0, 1 - (rx * rx) / (chordHalf * chordHalf)));
        const wingTopY = wingY - thickness * ratio - rx * Math.sin(angleRad);
        const wingBottomY = wingY + thickness * ratio - rx * Math.sin(angleRad);

        if (p.y < wingY) {
          // Upper flow - squeezed upwards, speed accelerates
          const factor = (chordHalf - Math.abs(rx)) / chordHalf;
          p.y = wingTopY - (wingY - p.y) * 0.25 * (isStalled ? 1.5 : 1.0);
          ctx.fillStyle = '#60a5fa';
          p.size = 2.0;
        } else {
          // Lower flow - slowed pressure area
          p.y = wingBottomY + (p.y - wingY) * 0.3;
          ctx.fillStyle = '#f87171';
          p.size = 1.0;
        }
      } else {
        ctx.fillStyle = '#cbd5e1';
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

  };

  // CIRCUIT ELECTRICITY RENDERER
  const renderElectricity = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    particles: any[],
    frameCount: number
  ) => {
    const voltage = params.voltage || 9;
    const resistance = params.resistance || 20;

    const circuitPadding = 60;
    const cx = w / 2;
    const cy = h / 2;

    const rectW = w - circuitPadding * 2;
    const rectH = h - circuitPadding * 2;
    const startX = circuitPadding;
    const startY = circuitPadding;

    // Draw continuous wire bounds
    ctx.beginPath();
    ctx.rect(startX, startY, rectW, rectH);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Electron current flow velocity based strictly on Ohms Law: I = V/R
    const current = voltage / resistance; // Amperes
    const speed = current * 12;

    // Draw battery source (Left side)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(startX - 20, cy - 40, 40, 80);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX - 20, cy - 40, 40, 80);

    // Terminals (+) (-)
    ctx.fillStyle = '#ef4444'; // Red (+)
    ctx.fillRect(startX - 15, cy - 35, 30, 20);
    ctx.fillStyle = '#3b82f6'; // Blue (-)
    ctx.fillRect(startX - 15, cy + 15, 30, 20);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "JetBrains Mono"';
    ctx.fillText('+', startX - 5, cy - 20);
    ctx.fillText('-', startX - 4, cy + 30);

    // Draw Bulb Filament / Load unit (Right side)
    const bulbX = startX + rectW;
    const bulbY = cy;

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(bulbX, bulbY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Bulb glow intensity proportional to I²R (Joule heating rate: Power = I²R)
    const power = current * current * resistance;
    const glowIntensity = Math.min(100, power * 5); // caps value for visually hot bulbs
    
    if (glowIntensity > 5) {
      const grad = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, 40 + glowIntensity * 0.8);
      grad.addColorStop(0, `rgba(245, 158, 11, ${Math.min(0.9, glowIntensity / 100)})`);
      grad.addColorStop(0.5, `rgba(245, 158, 11, ${Math.min(0.3, glowIntensity / 250)})`);
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 40 + glowIntensity * 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Tungsten filament wire inside the bulb
      ctx.beginPath();
      ctx.moveTo(bulbX - 10, bulbY + 15);
      ctx.lineTo(bulbX - 5, bulbY - 5);
      ctx.lineTo(bulbX + 5, bulbY - 5);
      ctx.lineTo(bulbX + 10, bulbY + 15);
      ctx.strokeStyle = `rgb(255, ${Math.min(255, 150 + power * 35)}, ${Math.min(255, power * 15)})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(bulbX - 10, bulbY + 15);
      ctx.lineTo(bulbX - 5, bulbY - 5);
      ctx.lineTo(bulbX + 5, bulbY - 5);
      ctx.lineTo(bulbX + 10, bulbY + 15);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Toggle switch gateway (Bottom side)
    const swX = startX + rectW / 2;
    const swY = startY + rectH;
    ctx.fillStyle = '#0a0f1d';
    // Clear the switch area wire
    ctx.fillRect(swX - 25, swY - 10, 50, 20);

    // Draw active switch contacts
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(swX - 15, swY, 5, 0, Math.PI * 2);
    ctx.arc(swX + 15, swY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Diagonal gate
    ctx.beginPath();
    ctx.moveTo(swX - 15, swY);
    ctx.lineTo(swX + 13, swY - 3); // closed circuit
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Flow electrons along wire perimeter path: CCW from Negative (-) (bottom-left) to Positive (+) (top-left)
    // Perimeter length: 2 * (rectW + rectH)
    particles.forEach((p, idx) => {
      // Advance along loop
      let dist = (idx / particles.length) * (rectW * 2 + rectH * 2) + frameCount * speed;
      dist = dist % (rectW * 2 + rectH * 2);

      // Map 1D distance along rectangle parameter to physical canvas coordinates
      let px = 0;
      let py = 0;

      if (dist < rectW) {
        // Bottom side (moving right from battery negative corner)
        px = startX + dist;
        py = startY + rectH;
      } else if (dist < rectW + rectH) {
        // Right side (moving up from bottom-right corner to bulb)
        px = startX + rectW;
        py = startY + rectH - (dist - rectW);
      } else if (dist < rectW * 2 + rectH) {
        // Top side (moving left from top-right corner back to battery positive corner)
        px = startX + rectW - (dist - (rectW + rectH));
        py = startY;
      } else {
        // Left side (moving down from top-left corner back down through battery)
        px = startX;
        py = startY + (dist - (rectW * 2 + rectH));
      }

      ctx.fillStyle = '#fec007';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = Math.min(20, voltage * 1.5);
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;

  };

  // INTERNET DATA ROUTING SIMULATION
  const renderNetwork = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    frameCount: number
  ) => {
    const congestion = params.congestion ?? 20;
    const packetSize = params.packetSize ?? 512;

    const sourceX = 60;
    const serverX = w - 60;
    const cy = h / 2;

    // Draw Source device laptop icon representation
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sourceX - 35, cy - 25, 50, 40);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(sourceX - 35, cy - 25, 50, 40);
    // Keyboard baseline
    ctx.fillRect(sourceX - 45, cy + 15, 70, 8);
    ctx.strokeRect(sourceX - 45, cy + 15, 70, 8);

    // Draw Target Enterprise server stack representation
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(serverX - 25, cy - 40, 50, 80);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(serverX - 25, cy - 40, 50, 80);
    // Light blinking lines on servers
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = (frameCount + i * 20) % 60 < 25 ? '#10b981' : '#047857';
      ctx.beginPath();
      ctx.arc(serverX + 15, cy - 25 + i * 24, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Router intermediate nodes arranged as distributed diamond web
    const routers = [
      { id: 'R1', x: w * 0.35, y: h * 0.28, label: 'Node Alpha (Edge)' },
      { id: 'R2', x: w * 0.35, y: h * 0.72, label: 'Node Beta (Edge)' },
      { id: 'R3', x: w * 0.65, y: h * 0.50, label: 'Node Gateway' }
    ];

    // Render connection pathways representing optical fiber channels
    const drawFiberChannel = (fx: number, fy: number, tx: number, ty: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const fiberColor = 'rgba(56, 189, 248, 0.2)';
    drawFiberChannel(sourceX + 25, cy, routers[0].x, routers[0].y, fiberColor);
    drawFiberChannel(sourceX + 25, cy, routers[1].x, routers[1].y, fiberColor);
    drawFiberChannel(routers[0].x, routers[0].y, routers[2].x, routers[2].y, fiberColor);
    drawFiberChannel(routers[1].x, routers[1].y, routers[2].x, routers[2].y, fiberColor);
    drawFiberChannel(routers[2].x, routers[2].y, serverX - 25, cy, 'rgba(16, 185, 129, 0.25)');

    // Render mechanical router chassis nodes
    routers.forEach(r => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px "JetBrains Mono"';
      ctx.fillText(r.id, r.x - 5, r.y + 3);
    });

    // Animate flow of packets (MSS bytes) crossing fibers
    // Rate of packet spawning based on MSS size (smaller size, more frequent packets)
    const frequency = Math.max(10, Math.round(packetSize / 20));
    const isDropInFolder = congestion > 60; // Flag simulating dropped buffers in high traffic

    if (frameCount % frequency === 0) {
      // Spawn packet targeting router pathways randomly
      const routeChoice = Math.random() > 0.5 ? 0 : 1;
      const payloadLabel = Math.random() > 0.4 ? 'TCP_DATA' : 'TTL_PING';
    }

    // Packet drawing ticker helper
    const packetPeriod = 120; // Frames to make absolute crossing
    const numPackets = 5;
    for (let pIdx = 0; pIdx < numPackets; pIdx++) {
      const pOffset = (frameCount + pIdx * (packetPeriod / numPackets)) % packetPeriod;
      const progressRatio = pOffset / packetPeriod;
      
      let px = sourceX;
      let py = cy;
      const isUpper = pIdx % 2 === 0;
      const isDropped = isDropInFolder && pIdx === 3 && progressRatio > 0.5;

      if (progressRatio < 0.35) {
        // Stage 1: Browser to R1/R2
        const localRatio = progressRatio / 0.35;
        const targetRouter = isUpper ? routers[0] : routers[1];
        px = sourceX + (targetRouter.x - sourceX) * localRatio;
        py = cy + (targetRouter.y - cy) * localRatio;
      } else if (progressRatio < 0.75) {
        // Stage 2: R1/R2 to R3
        const localRatio = (progressRatio - 0.35) / 0.40;
        const startRouter = isUpper ? routers[0] : routers[1];
        px = startRouter.x + (routers[2].x - startRouter.x) * localRatio;
        py = startRouter.y + (routers[2].y - startRouter.y) * localRatio;
      } else {
        // Stage 3: R3 to host server
        const localRatio = (progressRatio - 0.75) / 0.25;
        px = routers[2].x + (serverX - routers[2].x) * localRatio;
        py = routers[2].y + (cy - routers[2].y) * localRatio;
      }

      if (!isDropped) {
        ctx.fillStyle = isDropped ? '#ef4444' : '#38bdf8';
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur = 4;
        ctx.fillRect(px - 5, py - 4, 10, 8);
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#0f172a';
        ctx.font = '6px "JetBrains Mono"';
        ctx.fillText('#' + pIdx, px - 3, py + 3);
      } else {
        // Dropped particle explosion
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.beginPath();
        ctx.arc(px, py, 6 + Math.sin(frameCount * 0.1) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px system-ui';
        ctx.fillText('DROP', px - 8, py + 2);
      }
    }

  };

  // BRIDGE STRUCTURAL LOADING RENDERER
  const renderBridgeForces = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>
  ) => {
    const load = params.load || 50;
    const cableSag = params.cableSlack || 30;

    const marginY = h - 60;
    const bridgeBegin = 40;
    const bridgeEnd = w - 40;
    const spanW = bridgeEnd - bridgeBegin;

    // Support pillars coordinates
    const pier1X = bridgeBegin + spanW * 0.25;
    const pier2X = bridgeBegin + spanW * 0.75;
    const towerH = h * 0.7;
    const towerTopY = h - towerH;

    // Draw foundational rocks bedrock
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, marginY + 4, w - 16, 60);

    // Render Concrete support pillars taking Compression (Force downwards)
    ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;

    // Pier columns
    ctx.fillRect(pier1X - 15, towerTopY, 30, towerH);
    ctx.strokeRect(pier1X - 15, towerTopY, 30, towerH);

    ctx.fillRect(pier2X - 15, towerTopY, 30, towerH);
    ctx.strokeRect(pier2X - 15, towerTopY, 30, towerH);

    // Compression vector lines drawn down the towers
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(pier1X, towerTopY + 10);
    ctx.lineTo(pier1X, marginY - 10);
    ctx.moveTo(pier2X, towerTopY + 10);
    ctx.lineTo(pier2X, marginY - 10);
    ctx.stroke();

    // Arrows on pillars
    ctx.font = 'bold 9px Arial';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('▼ COMPRESSION ▼', pier1X - 38, towerTopY + 45);
    ctx.fillText('▼ COMPRESSION ▼', pier2X - 38, towerTopY + 45);

    // Draw horizontal steel roadbed deck, experiencing structural bend proportional to vehicle weight load
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(bridgeBegin, marginY);

    // Curve representing the slight deflection/bend of the bridge under load
    const deflectionScale = load * 0.15;
    ctx.quadraticCurveTo(w / 2, marginY + deflectionScale, bridgeEnd, marginY);
    ctx.stroke();

    // Anchor blocks on sides
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(15, marginY - 10, 30, 40);
    ctx.strokeRect(15, marginY - 10, 30, 40);
    ctx.fillRect(bridgeEnd - 5, marginY - 10, 30, 40);
    ctx.strokeRect(bridgeEnd - 5, marginY - 10, 30, 40);

    // Trace Main cable system: anchors -> towers peak -> central sag -> towers peak -> anchor
    const sagDepth = towerTopY + (marginY - towerTopY) * (cableSag / 100);

    ctx.beginPath();
    ctx.moveTo(30, marginY);
    ctx.lineTo(pier1X, towerTopY);
    ctx.quadraticCurveTo(w / 2, sagDepth, pier2X, towerTopY);
    ctx.lineTo(bridgeEnd + 10, marginY);
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = '#fbbf24';// Tension cable colored yellow/gold
    ctx.stroke();

    // Side tension lines to anchor points
    ctx.font = 'bold 9px system-ui';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('▲ TENSION ▲', w / 2 - 30, sagDepth - 10);

    // Vertical supporting Hangers representing structural wires pulling deck UP
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
    ctx.lineWidth = 1.5;
    const numHangers = 14;
    for (let i = 1; i < numHangers; i++) {
      const hx = bridgeBegin + (spanW / numHangers) * i;
      // Interpolate main cable coordinates at hx to connect hanger
      let cyY = towerTopY;
      if (hx < pier1X) {
        // Linear slope from anchor to pillar 1
        const t = (hx - 30) / (pier1X - 30);
        cyY = marginY + (towerTopY - marginY) * t;
      } else if (hx > pier2X) {
        // linear slope from pillar 2 to anchor
        const t = (hx - pier2X) / (bridgeEnd + 10 - pier2X);
        cyY = towerTopY + (marginY - towerTopY) * t;
      } else {
        // Quadratic bezier approximation for central span
        const t = (hx - pier1X) / (pier2X - pier1X);
        cyY = (1 - t) * (1 - t) * towerTopY + 2 * (1 - t) * t * sagDepth + t * t * towerTopY;
      }
      
      // Deflected deck coordinates
      const tDeck = (hx - bridgeBegin) / spanW;
      const dyY = marginY + deflectionScale * (4 * tDeck * (1 - tDeck)); // parabolic deflection

      ctx.beginPath();
      ctx.moveTo(hx, cyY);
      ctx.lineTo(hx, dyY);
      ctx.stroke();
    }

    // Draw little floating vehicle load cursor moving on the deck
    const carX = bridgeBegin + 45 + ((load * 123) % (spanW - 90));
    const carDeflection = marginY + deflectionScale * (4 * ((carX - bridgeBegin) / spanW) * (1 - ((carX - bridgeBegin) / spanW)));
    
    ctx.fillStyle = '#10b981';
    ctx.fillRect(carX - 10, carDeflection - 14, 20, 10);
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.arc(carX - 6, carDeflection - 4, 3, 0, Math.PI * 2);
    ctx.arc(carX + 6, carDeflection - 4, 3, 0, Math.PI * 2);
    ctx.fill();

  };

  // SATELLITE ORBIT COSMIC SIMULATION
  const renderSatelliteOrbit = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    frameCount: number
  ) => {
    const orbitalSpeed = params.orbitalSpeed ?? 7800; // m/s
    const altitude = params.altitude ?? 800; // km

    const earthX = w / 2;
    const earthY = h / 2 + 10;
    const earthRadius = 60; // constant visual earth size

    // Physics parameters mapped to spacecraft orbit geometry
    // Normal Low-Earth-Orbit stable speed is roughly 7500 - 7800 m/s
    const velocityScale = orbitalSpeed / 7800;
    const altitudeFactor = altitude / 800; // altitude of 800 maps to 1.0 multiplier

    // Satellite coordinate calculations
    // Angle in radians moving over frameCount
    const orbitalPeriod = Math.max(100, Math.min(600, 360 / (velocityScale * 0.8)));
    const angle = (frameCount * 2 * Math.PI) / orbitalPeriod;

    // Radius of path from center of Earth
    const pathRadius = earthRadius + 45 * altitudeFactor;

    // Draw gravity gradient field background
    const gradient = ctx.createRadialGradient(earthX, earthY, earthRadius, earthX, earthY, pathRadius + 40);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
    gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.02)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, pathRadius + 40, 0, Math.PI * 2);
    ctx.fill();

    // Draw earth body card grid
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // continents outline representation
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.ellipse(earthX - 15, earthY - 5, 20, 15, Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(earthX + 22, earthY + 12, 18, 12, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Air glow perimeter (stating atmosphere limits at 200km)
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius + 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)'; // atmospheric glow
    ctx.lineWidth = 2;
    ctx.stroke();

    // Orbit ellipse path
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(earthX, earthY, pathRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Check physics threshold mapping:
    // If orbital speed is too low (< 6000 m/s), satellite crashes inward
    // If too fast (> 11000 m/s), satellite escapes orbit entirely
    const isCrashing = orbitalSpeed < 5500;
    const isEscaping = orbitalSpeed > 10500;

    let satX = earthX;
    let satY = earthY;

    if (isCrashing) {
      // Spiral of decay path collapsing onto earth
      const decayFactor = Math.min(1.0, (frameCount % 180) / 180);
      const spiralRadius = pathRadius * (1 - decayFactor * 0.9);
      satX = earthX + Math.cos(angle * 2.2) * spiralRadius;
      satY = earthY + Math.sin(angle * 2.2) * spiralRadius;
      
      // Fire explosion if landing
      if (spiralRadius < earthRadius + 5) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(satX, satY, 15 + Math.sin(frameCount) * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px system-ui';
        ctx.fillText('CRASH', satX - 14, satY + 3);
      }
    } else if (isEscaping) {
      // Escape hyperbolic path floating up and out of frame
      const escCounter = (frameCount % 200);
      const escRadius = pathRadius + escCounter * 1.8;
      satX = earthX + Math.cos(angle * 0.25) * escRadius;
      satY = earthY + Math.sin(angle * 0.25) * escRadius;
    } else {
      // Stable orbit path coordinates
      satX = earthX + Math.cos(angle) * pathRadius;
      satY = earthY + Math.sin(angle) * pathRadius;
    }

    // Render Satellite body visual chassis
    if (!isCrashing || (pathRadius * (1 - ((frameCount % 180) / 180) * 0.9) >= earthRadius + 5)) {
      ctx.fillStyle = '#cb322a';
      // core box
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(satX - 6, satY - 6, 12, 12);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(satX - 6, satY - 6, 12, 12);

      // Blue solar solar wings
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(satX - 18, satY - 2, 12, 4);
      ctx.fillRect(satX + 6, satY - 2, 12, 4);
      ctx.strokeRect(satX - 18, satY - 2, 12, 4);
      ctx.strokeRect(satX + 6, satY - 2, 12, 4);

      // Direction vector arrow (Velocity VS Gravity)
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(satX, satY);
      // Tangent direction vectors
      const tx = -Math.sin(angle);
      const ty = Math.cos(angle);
      ctx.lineTo(satX + tx * 25, satY + ty * 25);
      ctx.stroke();
    }

  };

  // NUCLEAR REACTOR THERMAL POWER CORE
  const renderNuclearReactor = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    particles: any[],
    frameCount: number
  ) => {
    const rodDepth = params.rodDepth ?? 60; // rods inserted %
    const coolantFlow = params.coolantFlow ?? 50; // pump %

    // Dimensions
    const coreX = 130;
    const coreY = h / 2 + 10;
    const vesselW = 90;
    const vesselH = 150;

    // Temperature & Power calculations
    // Pulling rod out increases reactivity: fission power scales as rods% decreases
    const fissionPower = Math.max(5, (100 - rodDepth) * 1.5); // 0 to 150
    // Temperature determined by Fission rate and safely countered by Coolant Pump speed
    const coreTemp = Math.round(50 + (fissionPower * 5) - (coolantFlow * 2)); // Celcius

    // Vessel housing
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(coreX - vesselW / 2, coreY - vesselH / 2, vesselW, vesselH);
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.8)';
    ctx.lineWidth = 3;
    ctx.strokeRect(coreX - vesselW / 2, coreY - vesselH / 2, vesselW, vesselH);

    // Pressurized water coolant inside (glowing hot proportional to coreTemp)
    const hotMelt = Math.min(0.7, (coreTemp - 50) / 400); // maps up to 0.7 max alpha
    ctx.fillStyle = `rgba(239, 68, 68, ${hotMelt})`; // hotter is redder
    ctx.fillRect(coreX - vesselW / 2 + 3, coreY - vesselH / 2 + 3, vesselW - 6, vesselH - 6);

    // Draw Fuel rod rods
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#cb322a';
    ctx.lineWidth = 2.5;

    const numRods = 3;
    const rodW = 8;
    const maxInsertionLength = vesselH * 0.75; // maximum vertical slide reach
    const actualInsertion = maxInsertionLength * (rodDepth / 100);

    for (let i = 0; i < numRods; i++) {
      const rx = coreX - vesselW / 3 + i * (vesselW / 3);
      // Rod insertion shaft container
      ctx.fillStyle = '#475569';
      ctx.fillRect(rx - 5, coreY - vesselH / 2 - 20, 10, 20);

      // Slide metal rod downwards
      ctx.fillStyle = '#10b981'; // neutron absorbers are green
      ctx.fillRect(rx - 4, coreY - vesselH / 2 + actualInsertion - 25, 8, maxInsertionLength);
      ctx.strokeRect(rx - 4, coreY - vesselH / 2 + actualInsertion - 25, 8, maxInsertionLength);
    }

    // Fission reaction spark dynamics inside Core vessel
    if (fissionPower > 10) {
      particles.forEach(p => {
        // Move fission spark particle inside boundary walls
        p.x += Math.cos(p.angle) * p.speed * (fissionPower / 40);
        p.y += Math.sin(p.angle) * p.speed * (fissionPower / 40);

        if (
          p.x < coreX - vesselW / 2 + 5 ||
          p.x > coreX + vesselW / 2 - 5 ||
          p.y < coreY - vesselH / 2 + 5 ||
          p.y > coreY + vesselH / 2 - 5
        ) {
          p.x = coreX - vesselW / 3 + Math.random() * (vesselW * 0.6);
          p.y = coreY - vesselH / 3 + Math.random() * (vesselH * 0.6);
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + (fissionPower / 50), 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Heat Exchanger (Primary Loop to Secondary clean water turbine flask)
    const exchangerX = w - 120;
    const exchangerY = h / 2 + 10;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(exchangerX - 45, exchangerY - 60, 90, 120);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(exchangerX - 45, exchangerY - 60, 90, 120);

    // Primary circulating loops bridging core to exchanger
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 5;
    // Top connection
    ctx.beginPath();
    ctx.moveTo(coreX + vesselW / 2, coreY - 40);
    ctx.lineTo(exchangerX - 45, exchangerY - 40);
    ctx.stroke();

    // Bottom connection
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
    ctx.beginPath();
    ctx.moveTo(exchangerX - 45, exchangerY + 40);
    ctx.lineTo(coreX + vesselW / 2, coreY + 40);
    ctx.stroke();

    // Turbine spins proportionate to fissionPower steam output
    const spinSpeed = (fissionPower / 100) * 0.25;
    const spinAngle = frameCount * spinSpeed;

    // Draw rotating turbine fan representation
    ctx.save();
    ctx.translate(w - 50, exchangerY);
    ctx.rotate(spinAngle);
    ctx.fillStyle = '#94a3b8';
    for (let j = 0; j < 4; j++) {
      ctx.rotate(Math.PI / 2);
      ctx.fillRect(-6, -26, 12, 26);
    }
    ctx.restore();

  };

  // SUBMARINE BALLAST DUG-IN FLOAT RENDERER
  const renderSubmarineBallast = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    frameCount: number,
    waterLevel: number
  ) => {
    const ventPercent = params.ventOpen ?? 0;
    const blowPercent = params.blowAir ?? 0;

    // Submarine vertical depth on the canvas proportional to overall ballast tank weight
    // Full water sinks sub to bottom; full air floats sub to surface
    const targetY = h / 2.5 + (waterLevel / 100) * (h * 0.4);

    // Draw ocean levels (Sky VS Sea baseline)
    ctx.fillStyle = '#1e3a5f';
    ctx.fillRect(0, 48, w, h);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, 48);

    // Sea depth coordinate line
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 48);
    ctx.lineTo(w, 48);
    ctx.stroke();

    const subX = w / 2;
    const subY = targetY;

    // Render beautiful submarine cylindrical hull steel skeleton
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(subX - 90, subY - 20, 180, 40, 20);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sail Conning Tower
    ctx.fillStyle = '#334155';
    ctx.fillRect(subX - 15, subY - 42, 35, 24);
    ctx.strokeRect(subX - 15, subY - 42, 35, 24);

    // Propeller rotor blades spinning
    const spinFactor = 1.2;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(subX - 100, subY - 12 + Math.sin(frameCount * spinFactor) * 12, 6, 8);
    ctx.fillRect(subX - 100, subY - 4 - Math.sin(frameCount * spinFactor) * 12, 6, 8);

    // Draw double sandwich hulls representing Ballast Tank tanks
    const leftBallast = subX - 70;
    const rightBallast = subX + 50;
    const bW = 20;
    const bH = 34;
    const bY = subY - 17;

    const renderSingleBallast = (bx: number) => {
      // Background outline (Air portion is empty glass-blue)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(bx, bY, bW, bH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, bY, bW, bH);

      // Water level filling up from bottom
      const waterH = bH * (waterLevel / 100);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.85)'; // Water level colored blue
      ctx.fillRect(bx, bY + bH - waterH, bW, waterH);
    };

    renderSingleBallast(leftBallast);
    renderSingleBallast(rightBallast);

    // Render bubble arrays if venting gas or blowing pressure
    if (ventPercent > 10 && frameCount % 3 === 0) {
      // Draw exhaust bubble trails ascending from conning tower / vents
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(leftBallast + 10, subY - 25 - (frameCount % 45), 2.5, 0, Math.PI * 2);
      ctx.arc(rightBallast + 10, subY - 25 - ((frameCount + 20) % 45), 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (blowPercent > 10 && frameCount % 3 === 0) {
      // Draw air flushing seawater bubbles escaping out bottom flood gates
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.arc(leftBallast + 10, subY + 22 + (frameCount % 30), 3, 0, Math.PI * 2);
      ctx.arc(rightBallast + 10, subY + 22 + ((frameCount + 15) % 30), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // GPS TRILATERATION INTERSECTION POINT COMPUTING
  const renderGPSTrilateration = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>
  ) => {
    // Standard satellites coordinates: Sat A, Sat B, Sat C
    const satA = { x: w * 0.22, y: 70, label: 'SAT-A' };
    const satB = { x: w * 0.78, y: 70, label: 'SAT-B' };
    const satC = { x: w * 0.50, y: h - 90, label: 'SAT-C' };

    // Set Radius constraints based on transit times multipliers
    const transitA = params.timeLagA ?? 72;
    const transitB = params.timeLagB ?? 67;
    const radiusA = transitA * 2.1;
    const radiusB = transitB * 1.95;
    const radiusC = 120; // fixed C distance

    // Sat body icons drawing
    const drawSatChassis = (sat: typeof satA, color: string) => {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sat.x, sat.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // solar wings
      ctx.fillRect(sat.x - 18, sat.y - 2, 10, 4);
      ctx.fillRect(sat.x + 8, sat.y - 2, 10, 4);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px system-ui';
      ctx.fillText(sat.label, sat.x - 14, sat.y - 12);
    };

    drawSatChassis(satA, '#38bdf8');
    drawSatChassis(satB, '#a855f7');
    drawSatChassis(satC, '#10b981');

    // Draw expanding microwave distance constraint circles
    const drawDottedHorizonCirc = (x: number, y: number, r: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawDottedHorizonCirc(satA.x, satA.y, radiusA, 'rgba(56, 189, 248, 0.4)');
    drawDottedHorizonCirc(satB.x, satB.y, radiusB, 'rgba(168, 85, 247, 0.4)');
    drawDottedHorizonCirc(satC.x, satC.y, radiusC, 'rgba(16, 185, 129, 0.35)');

    // Estimate receiver intersection cursor coordinate
    // Solve overlap center point
    const intersectX = w / 2 + (radiusA - radiusB) * 0.8;
    const intersectY = h / 2.5 - 10;

    // Micro receiver module phone icon
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(intersectX - 10, intersectY - 14, 20, 28);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(intersectX - 10, intersectY - 14, 20, 28);
    
    // blinking radar dot
    ctx.fillStyle = '#4cd137';
    ctx.beginPath();
    ctx.arc(intersectX, intersectY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Radial beam rings flashing from receiver handset outwards
    ctx.strokeStyle = 'rgba(76, 209, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(intersectX, intersectY, 20, 0, Math.PI * 2);
    ctx.stroke();

  };

  // FALLBACK OR DYNAMIC AI RENDERER
  const renderDynamicGenerator = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    frameCount: number
  ) => {
    // Determine which paradigm we are showing
    const paradigm = visualTypeHint || 'wave';

    const paramKeys = Object.keys(params);
    const p1Key = paramKeys[0] || 'frequency';
    const p2Key = paramKeys[1] || 'damping';
    const p1Val = params[p1Key] ?? 40;
    const p2Val = params[p2Key] ?? 4;

    // Normalizing slider values to percentages (assuming standard min/max or scaling)
    const scale1 = p1Val / 100; // rough 0-1 scale
    const scale2 = p2Val / 10; // rough 0-1 scale

    const midY = h / 2 + 10;

    if (paradigm === 'transfer') {
      // 2. TRANSFER PARADIGM: shooting packets or pulses across nodes
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(lang === 'ar' ? "نموذج انتقال النبضات الديناميكي" : "DYNAMIC PULSE TRANSFER SIMULATION", w / 2 - 130, 30);

      // Draw transmitting node, processing node, receiving node
      const n1 = { x: w * 0.25, y: h / 2 + 10 };
      const n2 = { x: w * 0.5, y: h / 2 + 10 };
      const n3 = { x: w * 0.75, y: h / 2 + 10 };

      // Draw connection lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.lineTo(n3.x, n3.y);
      ctx.stroke();

      // Draw node spheres
      const pulseSpeed = 1 + scale1 * 4;
      const pulseSize = 4 + scale2 * 6;

      [n1, n2, n3].forEach((node, idx) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a0c';
        ctx.strokeStyle = idx === 1 ? '#f59e0b' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Node core
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = idx === 1 ? '#f59e0b' : '#38bdf8';
        ctx.fill();
      });

      // Moving packets
      const totalLen = n3.x - n1.x;
      const currentProgress = (frameCount * pulseSpeed) % totalLen;
      const px = n1.x + currentProgress;
      const py = h / 2 + 10;

      ctx.beginPath();
      ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw active parameter info
      ctx.fillStyle = '#64748b';
      ctx.font = '9px "JetBrains Mono"';
      ctx.fillText(`${p1Key.toUpperCase()}: ${p1Val}`, w * 0.2, h - 30);
      ctx.fillText(`${p2Key.toUpperCase()}: ${p2Val}`, w * 0.6, h - 30);

    } else if (paradigm === 'flow') {
      // 3. FLOW PARADIGM: fluid pipeline streaming
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(lang === 'ar' ? "محاكاة تدفق الجسيمات بالقنوات" : "FLUID CONDUIT FLOW SIMULATION", w / 2 - 120, 30);

      const speed = 0.5 + scale1 * 6;
      const viscosity = scale2 * 10; // affecting flow rate or particle density

      // Draw dynamic conduit pipeline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 32;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h / 2);
      ctx.bezierCurveTo(w * 0.4, h / 2 - 60, w * 0.6, h / 2 + 60, w * 0.9, h / 2);
      ctx.stroke();

      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 26;
      ctx.stroke();

      // Flow particles inside pipeline
      const numParticles = 25;
      for (let i = 0; i < numParticles; i++) {
        const offset = (i / numParticles) * 1.0;
        const progress = (offset + (frameCount * speed * 0.003)) % 1.0;

        // Bezier formula to find position
        const t = progress;
        const p0 = { x: w * 0.1, y: h / 2 };
        const p1 = { x: w * 0.4, y: h / 2 - 60 };
        const p2 = { x: w * 0.6, y: h / 2 + 60 };
        const p3 = { x: w * 0.9, y: h / 2 };

        const px = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        const py = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;

        ctx.fillStyle = `hsla(${200 - viscosity * 10}, 85%, 60%, 0.8)`;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Parameters labels
      ctx.fillStyle = '#64748b';
      ctx.font = '9px "JetBrains Mono"';
      ctx.fillText(`${p1Key.toUpperCase()} (SPEED): ${p1Val}`, w * 0.15, h - 30);
      ctx.fillText(`${p2Key.toUpperCase()} (FRICTION): ${p2Val}`, w * 0.55, h - 30);

    } else if (paradigm === 'lever') {
      // 4. LEVER PARADIGM: pivoting physics balance beam
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(lang === 'ar' ? "توازن العزوم والرافعة الميكانيكية" : "STATIC BALANCE & LEVER TORQUE MECHANICAL MODEL", w / 2 - 200, 30);

      const pivotX = w / 2;
      const pivotY = h / 2 + 40;
      const leverLen = w * 0.6;

      // Tilt angle based on parameter ratio
      const forceLeft = p1Val;
      const forceRight = p2Val * 15; // balance comparison
      const tiltAngle = Math.min(0.35, Math.max(-0.35, (forceLeft - forceRight) * 0.005));

      ctx.save();
      ctx.translate(pivotX, pivotY);
      ctx.rotate(tiltAngle);

      // Draw lever beam
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-leverLen / 2, 0);
      ctx.lineTo(leverLen / 2, 0);
      ctx.stroke();

      // Left Load box
      const boxSizeLeft = Math.min(30, 10 + forceLeft * 0.2);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-leverLen / 2 - boxSizeLeft / 2, -boxSizeLeft, boxSizeLeft, boxSizeLeft);

      // Right Load box
      const boxSizeRight = Math.min(30, 10 + forceRight * 0.02);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(leverLen / 2 - boxSizeRight / 2, -boxSizeRight, boxSizeRight, boxSizeRight);

      ctx.restore();

      // Draw stable pivot triangle base
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX - 15, pivotY + 30);
      ctx.lineTo(pivotX + 15, pivotY + 30);
      ctx.closePath();
      ctx.fill();

      // Ground plane line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, pivotY + 30);
      ctx.lineTo(w * 0.9, pivotY + 30);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#ef4444';
      ctx.font = '9px "JetBrains Mono"';
      ctx.fillText(`${p1Key.toUpperCase()}: ${p1Val}`, w * 0.15, h - 30);

      ctx.fillStyle = '#3b82f6';
      ctx.fillText(`${p2Key.toUpperCase()}: ${p2Val}`, w * 0.65, h - 30);

    } else if (paradigm === 'rotational') {
      // 5. ROTATIONAL PARADIGM: spinning interlocking gears
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(lang === 'ar' ? "توليف تروس السرعة والدوران الميكانيكي" : "INTERLOCKING GEARS & ROTATIONAL SPEED VECTOR", w / 2 - 190, 30);

      const gear1X = w * 0.35;
      const gear1Y = h / 2 + 10;
      const r1 = 60;

      const gear2X = w * 0.65;
      const gear2Y = h / 2 + 10;
      const r2 = 40;

      const spinSpeed = scale1 * 0.08;
      const gearRatio = r1 / r2;

      // Draw gear helper
      const drawGear = (cx: number, cy: number, r: number, angle: number, color: string, teethCount: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Core Circle
        ctx.beginPath();
        ctx.arc(0, 0, r - 8, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Draw teeth
        for (let i = 0; i < teethCount; i++) {
          const tAngle = (i / teethCount) * Math.PI * 2;
          ctx.save();
          ctx.rotate(tAngle);
          ctx.fillStyle = color;
          ctx.fillRect(-6, -r - 4, 12, 10);
          ctx.restore();
        }

        // Hub axle center hole
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#334155';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        ctx.restore();
      };

      const g1Angle = frameCount * spinSpeed;
      const g2Angle = -frameCount * spinSpeed * gearRatio + 0.15; // align teeth

      drawGear(gear1X, gear1Y, r1, g1Angle, '#10b981', 18);
      drawGear(gear2X, gear2Y, r2, g2Angle, '#f59e0b', 12);

      // Print RPM and gear metrics
      ctx.fillStyle = '#10b981';
      ctx.font = '9px "JetBrains Mono"';
      ctx.fillText(`${p1Key.toUpperCase()}: ${p1Val}`, w * 0.15, h - 30);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`${p2Key.toUpperCase()}: ${p2Val}`, w * 0.55, h - 30);

    } else if (paradigm === 'gauge') {
      // 6. GAUGE PARADIGM: dial needle indicators showing metrics
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(lang === 'ar' ? "مؤشرات قياس الضغط والتحميل التفاعلية" : "DIAL RADIAL INSTRUMENTS & PERFORMANCE GAUGE", w / 2 - 200, 30);

      // Two gauges side by side
      const drawRadialDial = (cx: number, cy: number, radius: number, val: number, minVal: number, maxVal: number, title: string, color: string) => {
        // Outer arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI * 0.8, Math.PI * 2.2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Color gauge fill segment
        const pct = (val - minVal) / (maxVal - minVal);
        const endAngle = Math.PI * 0.8 + pct * (Math.PI * 1.4);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI * 0.8, endAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.stroke();

        // Needle line
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(endAngle);
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(0, -radius + 15);
        ctx.lineTo(5, 0);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Hub cap
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#334155';
        ctx.fill();

        // Title text
        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(title, cx, cy + radius - 5);
        ctx.fillText(`${Math.round(val)}`, cx, cy + 25);
        ctx.textAlign = 'left';
      };

      const g1Max = p1Val > 100 ? p1Val * 1.5 : 100;
      const g2Max = p2Val > 10 ? p2Val * 1.5 : 10;

      drawRadialDial(w * 0.3, h / 2 + 10, 50, p1Val, 0, g1Max, p1Key.toUpperCase(), '#e11d48');
      drawRadialDial(w * 0.7, h / 2 + 10, 50, p2Val, 0, g2Max, p2Key.toUpperCase(), '#06b6d4');

    } else {
      // 1. DEFAULT: WAVEFORM
      ctx.beginPath();
      ctx.moveTo(0, midY);
      for (let x = 0; x < w; x++) {
        // Sine wave multiplied with dynamic damping factor
        const freq = p1Val * 0.0006 * x;
        const decay = Math.exp((-p2Val * 0.003 * x));
        const wy = midY + Math.sin(frameCount * 0.12 + freq) * 45 * decay;
        ctx.lineTo(x, wy);
      }
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Moving signal particles along the wave path
      for (let i = 0; i < 3; i++) {
        const px = ((frameCount * 2.5 + i * w / 3) % w);
        const freq = p1Val * 0.0006 * px;
        const decay = Math.exp((-p2Val * 0.003 * px));
        const py = midY + Math.sin(frameCount * 0.12 + freq) * 45 * decay;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#4ae171';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillText(lang === 'ar' ? "تكامل أمواج تذبذب التردد الإرشادي" : "LIVE SCHEMATIC WAVE MODEL GENERATIVE STREAM", w / 2 - 170, 40);
    }
  };

  const renderElectricityHome = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    params: Record<string, number>,
    frameCount: number
  ) => {
    const loadVal = params.load ?? 2;
    
    // Define States
    let statusText = '';
    let statusColor = '#f59e0b';
    let flowSpeed = 2.0;
    let bulbGlow = 0;
    let isWiresHeating = false;
    let isBreakerTripped = false;
    let currentInAmps = 15;

    if (loadVal === 1) {
      statusText = lang === 'ar' ? 'حمل منخفض: النظام مستقر وآمن' : 'LOW LOAD: SYSTEM STABLE';
      statusColor = '#10b981';
      flowSpeed = 1.0;
      bulbGlow = 15;
      currentInAmps = 5;
    } else if (loadVal === 2) {
      statusText = lang === 'ar' ? 'حمل متوسط: ضغط طبيعي وسلس كلياً' : 'MEDIUM LOAD: SYSTEM OPTIMAL';
      statusColor = '#f59e0b';
      flowSpeed = 2.2;
      bulbGlow = 35;
      currentInAmps = 15;
    } else if (loadVal === 3) {
      statusText = lang === 'ar' ? 'حمل مرتفع: حرارة الأسلاك والتحمل ترتفع!' : 'HIGH LOAD: WIRE TEMPERATURE RISING';
      statusColor = '#f97316';
      flowSpeed = 4.2;
      bulbGlow = 60;
      isWiresHeating = true;
      currentInAmps = 32;
    } else {
      statusText = lang === 'ar' ? 'انقطاع كهرباء: فرط الحمل وتحفيز قواطع الأمان!' : 'OVERLOAD: BREAKERS TRIPPED OUTAGE';
      statusColor = '#ef4444';
      flowSpeed = 0;
      bulbGlow = 0;
      isBreakerTripped = true;
      currentInAmps = 0;
    }

    // Node coordinate anchors
    const n1 = { x: w * 0.12, y: h * 0.62, label: lang === 'ar' ? 'المحطة' : 'STATION' };
    const n2 = { x: w * 0.31, y: h * 0.38, label: lang === 'ar' ? 'المولد AC' : 'GENERATOR' };
    const n3 = { x: w * 0.50, y: h * 0.22, label: lang === 'ar' ? 'برج الرفع' : 'STEP-UP' };
    const n4 = { x: w * 0.69, y: h * 0.42, label: lang === 'ar' ? 'محول خفض' : 'STEP-DOWN' };
    const n5 = { x: w * 0.88, y: h * 0.64, label: lang === 'ar' ? 'المنزل' : 'HOME' };

    // Function to draw flowing dashes on links
    const drawConduit = (from: any, to: any, isHeated: boolean) => {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = isHeated ? `rgba(239, 68, 68, ${0.4 + Math.sin(frameCount * 0.2) * 0.3})` : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = isHeated ? 5 : 3;
      ctx.stroke();

      if (isHeated) {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      if (flowSpeed > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = statusColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 12]);
        ctx.lineDashOffset = -frameCount * flowSpeed;
        ctx.stroke();
        ctx.restore();
      }
    };

    // Draw lines
    drawConduit(n1, n2, false);
    drawConduit(n2, n3, false);
    // Transmission is high voltage, wire has higher flow
    drawConduit(n3, n4, isWiresHeating);
    // Drop to Home
    drawConduit(n4, n5, isWiresHeating);

    // 1. Draw Turbine Generation (n1)
    ctx.save();
    ctx.translate(n1.x, n1.y);
    // Draw base water/coal station tower
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-18, 5, 36, 25);
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(-18, 5, 36, 25);

    // Draw spin blades
    const angle = (frameCount * 0.04 * (flowSpeed || 0.2));
    ctx.rotate(angle);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -22);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, -22, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate((120 * Math.PI) / 180);
    }
    // Hub
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Draw Generator Induction (n2)
    ctx.save();
    ctx.translate(n2.x, n2.y);
    // Draw copper stator rings
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Draw internal rotating dipole magnet
    ctx.rotate(-frameCount * 0.03 * (flowSpeed || 0.1));
    ctx.fillStyle = '#ef4444'; // North (Red)
    ctx.fillRect(-14, -6, 14, 12);
    ctx.fillStyle = '#3b82f6'; // South (Blue)
    ctx.fillRect(0, -6, 14, 12);
    // Center pin
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Draw Step-Up Transmission Tower (n3)
    ctx.save();
    ctx.translate(n3.x, n3.y);
    // Draw Pylon Tower metal frame triangle
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(-14, 25);
    ctx.moveTo(0, -25);
    ctx.lineTo(14, 25);
    ctx.moveTo(-16, 25);
    ctx.lineTo(16, 25);
    // Crossbars
    ctx.moveTo(-7, 0);
    ctx.lineTo(7, 0);
    ctx.moveTo(-15, -12);
    ctx.lineTo(15, -12);
    ctx.stroke();

    // Sparks emanating from tower if active high-voltage!
    if (flowSpeed > 0 && frameCount % 35 < 10) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-22, -12);
      ctx.lineTo(-18 + Math.random() * 5, -5);
      ctx.moveTo(22, -12);
      ctx.lineTo(18 - Math.random() * 5, -5);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Draw Step-Down Substation (n4)
    ctx.save();
    ctx.translate(n4.x, n4.y);
    // Heavy steel transformer coil box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-16, -16, 32, 32);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(-16, -16, 32, 32);

    // Danger symbol on box
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(7, 6);
    ctx.lineTo(-7, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('⚡', -3, 5);
    ctx.restore();

    // 5. Draw Home & Light Bulb (n5)
    ctx.save();
    ctx.translate(n5.x, n5.y);
    
    // Cute house outline
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(-20, 20);
    ctx.lineTo(-20, -5);
    ctx.lineTo(-25, -5);
    ctx.lineTo(0, -25); // roof top
    ctx.lineTo(25, -5);
    ctx.lineTo(20, -5);
    ctx.lineTo(20, 20);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner window glow
    if (bulbGlow > 0) {
      ctx.fillStyle = isWiresHeating ? '#f97316' : '#f59e0b';
      ctx.fillRect(-10, 0, 7, 7);
      ctx.fillRect(3, 0, 7, 7);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, 0, 7, 7);
      ctx.fillRect(3, 0, 7, 7);
    }

    // Floating giant electric bulb above the roof representing the residential circuit load
    const bY = -35;
    if (bulbGlow > 0) {
      // Draw glow
      const bulbGrad = ctx.createRadialGradient(0, bY, 3, 0, bY, bulbGlow * 0.7);
      bulbGrad.addColorStop(0, `rgba(${isWiresHeating ? '249, 115, 22' : '245, 158, 11'}, 0.8)`);
      bulbGrad.addColorStop(0.5, `rgba(245, 158, 11, 0.3)`);
      bulbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bulbGrad;
      ctx.beginPath();
      ctx.arc(0, bY, bulbGlow * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glass bulb frame
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, bY, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = bulbGlow > 0 ? '#fbbf24' : '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Brass screw cap
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-5, bY + 11, 10, 4);

    // Filament loop inside bulb
    ctx.strokeStyle = bulbGlow > 0 ? '#ffffff' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4, bY + 8);
    ctx.lineTo(-2, bY);
    ctx.lineTo(2, bY);
    ctx.lineTo(4, bY + 8);
    ctx.stroke();

    // Popped breaker lever if tripped!
    if (isBreakerTripped) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(-4, 18); // popped down
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 7px "JetBrains Mono"';
      ctx.fillText('TRIPPED', -15, 27);
    } else {
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-10, 15);
      ctx.lineTo(-12, 10); // closed secure
      ctx.stroke();
    }

    ctx.restore();

    // Labels for each system component
    const drawLabel = (n: any) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(n.x - 26, n.y + 30, 52, 15);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.strokeRect(n.x - 26, n.y + 30, 52, 15);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 8px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 40);
    };

    drawLabel(n1);
    drawLabel(n2);
    drawLabel(n3);
    drawLabel(n4);
    drawLabel(n5);
    ctx.textAlign = 'left'; // Reset
  };

  return (
    <div className="relative w-full flex flex-col rounded-none overflow-hidden shadow-2xl border border-white/10 bg-[#050507]" id="visual_simulator_wrapper">
      <div className="relative flex-1 min-h-[300px]">
        <canvas ref={canvasRef} className="block w-full h-full" id="physics_simulation_canvas" />
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-white/10 px-2.5 py-1 rounded-none text-[9px] font-mono text-amber-500 uppercase tracking-wider select-none">
          {lang === 'ar' ? 'محرك محاكاة الأنظمة الحية' : 'LIVE SIMULATION ENGINE'}
        </div>
      </div>

      {/* Dynamic Responsive Info Panel for All Simulation Types */}
      <div className="bg-[#08080a] border-t border-white/10 p-4 font-sans text-start w-full" id="dynamic_model_info_bar" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
        {type === 'aerodynamics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="aero_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'التحكم بالرفع والانهيار' : 'FLIGHT LIFT & STABILITY'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: aeroStalled ? '#ef4444' : '#10b981', boxShadow: `0 0 10px ${aeroStalled ? '#ef4444' : '#10b981'}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {aeroStalled 
                    ? (lang === 'ar' ? '⚠️ انهيار الجناح (STALL)' : '⚠️ AIRFOIL STALL') 
                    : (lang === 'ar' ? '✓ تحليق متزن ومستمر' : '✓ STABLE GLIDE')}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'سرعة التدفق الجوي' : 'RELATIVE AIRSPEED'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {aeroSpeed} {lang === 'ar' ? 'عقدة' : 'kts'}
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'محصلة قوة الرفع' : 'CALCULATED LIFT FORCE'}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {aeroLift} {lang === 'ar' ? 'كيلونيوتن' : 'kN'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'قوى الإعاقة والسحب' : 'AERODYNAMIC DRAG'}
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">
                {aeroDrag} {lang === 'ar' ? 'كيلونيوتن' : 'kN'}
              </span>
            </div>
          </div>
        )}

        {type === 'electricity' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="elec_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'دائرة التوصيل الكهربائي' : 'CIRCUIT CONNECTION STATUS'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse bg-emerald-500" style={{ boxShadow: `0 0 10px #10b981` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {lang === 'ar' ? 'مسار مغلق نشط' : '✓ CLOSED CIRCLE ACTIVE'}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'الجهد المسرع (أوم)' : 'DRIVE TENSION (VOLTS)'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {elecVoltage.toFixed(1)} {lang === 'ar' ? 'فولت' : 'Volts'}
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'فتيل المقاومة النشطة' : 'FILAMENT RESISTANCE'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {elecResistance} {lang === 'ar' ? 'أوم' : 'Ohms'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'تدفق الشحنات الفعلي (I)' : 'ACTIVE FLOW CURRENT (I)'}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {elecCurrent.toFixed(2)} {lang === 'ar' ? 'أمبير' : 'Amps'}
              </span>
            </div>
          </div>
        )}

        {type === 'network' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="network_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'توجيه بيانات مسارات BGP' : 'BGP ROUTING ANALYSIS'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: netCongestion > 60 ? '#ef4444' : '#10b981', boxShadow: `0 0 10px ${netCongestion > 60 ? '#ef4444' : '#10b981'}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {netCongestion > 60 
                    ? (lang === 'ar' ? '⚠️ فقدان حزم ملموس (خطر)' : '⚠️ CONGESTION LOSS') 
                    : (lang === 'ar' ? '✓ توجيه آمن ومستقر' : '✓ CLEAN STREAM OK')}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'كثافة الازدحام' : 'TRAFFIC CONGESTION'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {netCongestion}%
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'حجم السعة لتجزئة الحزم' : 'PACKET SIZE (MTU)'}
              </span>
              <span className="text-xs font-mono font-bold text-[#38bdf8]">
                {netPacketSize} Bytes
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'معدل قذف وإسقاط الحزم' : 'PACKET DROP RATE'}
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">
                {netCongestion > 60 ? (lang === 'ar' ? 'فقدان ١٨٪ من الحزم' : '18% DROPPED') : (lang === 'ar' ? 'آمن بالكامل ٠٪' : '0% CLEAN')}
              </span>
            </div>
          </div>
        )}

        {type === 'bridge-forces' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="bridge_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'سلامة هيكل ركائز الجسر' : 'STRUCTURAL LOAD FEA'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: bridgeDeflection > 15 ? '#ef4444' : '#fbbf24', boxShadow: `0 0 10px ${bridgeDeflection > 15 ? '#ef4444' : '#fbbf24'}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {bridgeDeflection > 15 
                    ? (lang === 'ar' ? '⚠️ تحذير: إجهاد كلي مرتفع' : '⚠️ HIGH STRUCTURAL STRESS') 
                    : (lang === 'ar' ? '✓ هيكل ارتكاز آمن' : '✓ SAFE COMPRESSION OK')}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'الحمل الإجمالي فوق السطح' : 'DECK TRAFFIC LOAD'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {bridgeLoad} {lang === 'ar' ? 'طن' : 'tons'}
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'درجة الانحراف والهبوط' : 'STEEL DECK SAG / BEND'}
              </span>
              <span className="text-xs font-mono font-bold text-red-400">
                {bridgeDeflection.toFixed(2)} mm
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'شد الركائز الكبلية المضاد' : 'ANCHOR PULL FORCE'}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {bridgeAnchorPull.toFixed(0)} kN
              </span>
            </div>
          </div>
        )}

        {type === 'satellite-orbit' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="satellite_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'توازن مدارات نيوتن' : 'SPACECRAFT EQUILIBRIUM'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: satCrashing ? '#ef4444' : satEscaping ? '#fbbf24' : '#10b981', boxShadow: `0 0 10px ${satCrashing ? '#ef4444' : satEscaping ? '#fbbf24' : '#10b981'}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {satCrashing 
                    ? (lang === 'ar' ? '⚠️ سقوط ارتدادي بالغلاف' : '⚠️ ATMOSPHERIC DECAY CRASH') 
                    : satEscaping 
                    ? (lang === 'ar' ? '⚡ تجاوز سرعة الإفلات' : '⚡ ESCAPE VELOCITY EXCEEDED') 
                    : (lang === 'ar' ? '✓ حركة متوازنة كلياً' : '✓ EQUILIBRIUM STABLE')}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'الارتفاع الجغرافي الكوني' : 'GEOCENTRIC ALTITUDE'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {satAltitude} km
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'السرعة المدارية المحسوبة' : 'ORBITAL VELOCITY'}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {satSpeed.toLocaleString()} m/s
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'جاذبية كتل الأرض المسلطة' : 'GRAVITATIONAL REFERENCE'}
              </span>
              <span className="text-xs text-[#cbd5e1]/80 font-normal">
                {lang === 'ar' ? 'قوى السقوط الحر المكافئة' : 'Continuous Newtonian Math'}
              </span>
            </div>
          </div>
        )}

        {type === 'nuclear-reactor' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="nuclear_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'أمان القلب وضغط الفتيل' : 'REACTOR INNER SAFETY'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: reactTemp > 380 ? '#ef4444' : '#10b981', boxShadow: `0 0 10px ${reactTemp > 380 ? '#ef4444' : '#10b981'}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {reactTemp > 380 
                    ? (lang === 'ar' ? '⚠️ انصهار نووي! خفّض فوراً!' : '⚠️ MELTDOWN CRITICAL RISK') 
                    : (lang === 'ar' ? '✓ ضغط أمان مستقر' : '✓ REACTOR CORE STABLE')}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'طاقة الانشطار الحرارية' : 'THERMAL FISSION GENERATION'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-500">
                {Math.round(reactFissionPower * 12).toLocaleString()} MW
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'حرارة قلب التبريد' : 'COOLANT CORE TEMPERATURE'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {reactTemp}°C
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'وضع قضبان التحكم' : 'CONTROL HULL RODS'}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {reactRodDepth}% {lang === 'ar' ? 'داخل الأسطوانة' : 'inserted'}
              </span>
            </div>
          </div>
        )}

        {type === 'submarine-ballast' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="submarine_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'طفو وهيدروستاتيكية الجسم' : 'HYDROSTATIC FLOATING OK'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: submarineWaterLevel > 80 ? '#38bdf8' : '#10b981', boxShadow: `0 0 10px ${submarineWaterLevel > 80 ? '#38bdf8' : '#10b981'}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {submarineWaterLevel > 80 
                    ? (lang === 'ar' ? 'غوص كامل بالتثقيل' : '✓ طفو / ملاحة متزنة') 
                    : (lang === 'ar' ? 'ملاحة مستقرة' : '✓ BALANCED FLOAT')}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'عمق هيكل الغواصة' : 'HULL DEPTH'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-400">
                {subDepth} {lang === 'ar' ? 'متر' : 'meters'}
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'امتلاء خزان الصهاريج بالماء' : 'BALLAST SEAWATER TEMP'}
              </span>
              <span className="text-xs font-mono font-bold text-sky-300">
                {submarineWaterLevel}%
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'قوى الطفو الكلية (أرخميدس)' : 'BUOYANCY REACTION (ARCHIMEDES)'}
              </span>
              <span className="text-xs font-mono text-[#cbd5e1] font-normal">
                {(100 - submarineWaterLevel).toFixed(0)} kN
              </span>
            </div>
          </div>
        )}

        {type === 'gps-trilateration' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="gps_details_box">
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'مصفوفة وتثبيت الإحداثيات' : 'SPATIAL FIXED LOCK Status'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse bg-emerald-500" style={{ boxShadow: `0 0 10px #10b981` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {lang === 'ar' ? '3D لوك نشط ومستقر' : '✓ 3D LOCK REAL-TIME FIXED'}
                </span>
              </div>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'فارق توقيت القمر أ' : 'TRANSIT DELTA ALPHA'}
              </span>
              <span className="text-xs font-mono font-bold text-[#fbbf24]">
                {gpsTransitA} ns
              </span>
            </div>
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'فارق توقيت القمر ب' : 'TRANSIT DELTA BETA'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-500">
                {gpsTransitB} ns
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'الموقع المقفل هندسياً' : 'GEOGRAPHIC POSITION FIXED'}
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                ({lang === 'ar' ? 'مؤمن ومحدد بدقة' : 'TRIANGULATED ACTIVE'})
              </span>
            </div>
          </div>
        )}

        {type === 'electricity-home' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center" id="elec_home_details_box">
            {/* Col 1: Load Status */}
            <div className={`flex flex-col gap-1 pr-4 border-r border-white/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'تشخيص الحمل والنظام' : 'GRID STATUS & DIAGNOSIS'}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}` }} />
                <span className="text-xs font-semibold text-white truncate">
                  {statusText}
                </span>
              </div>
            </div>

            {/* Col 2: Line Current */}
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'التيار الفعلي المتدفق' : 'ACTIVE CURRENT FLOW'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-500">
                {currentInAmps} {lang === 'ar' ? 'أمبير' : 'Amps'}
              </span>
            </div>

            {/* Col 3: Generator Output */}
            <div className={`flex flex-col gap-1 pr-4 border-r border-[#cbd5e1]/5 ${lang === 'ar' ? 'pr-0 pl-4 border-r-0 border-l' : ''}`}>
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'نمط عمل المولد' : 'GENERATION INDUCTION'}
              </span>
              <span className="text-xs text-[#cbd5e1] font-medium">
                {lang === 'ar' ? 'تيار متردد AC' : 'Alternating Current (AC)'}
              </span>
            </div>

            {/* Col 4: Transmission link */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono tracking-widest text-[#cbd5e1]/40 uppercase">
                {lang === 'ar' ? 'جهد خط الارتفاع' : 'HIGH-VOLTAGE TRANSMISSION'}
              </span>
              <span className="text-xs text-[#cbd5e1]/80 font-light truncate">
                {lang === 'ar' ? 'فائق الضغط (٤٠٠,٠٠٠ فولت)' : 'Super High Pressure (400KV)'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
