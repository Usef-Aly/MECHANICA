import { Topic } from '../types';

export const PRESET_TOPICS: Topic[] = [
  {
    id: 'airplane-flight',
    title: 'How an Airplane Flies',
    category: 'Aerodynamics & Engineering',
    summary: 'Explore how aerodynamic forces—Lift, Weight, Thrust, and Drag—interact to keep a massive metal structure suspended in thin air through airfoil geometry.',
    iconName: 'Plane',
    nodes: [
      { id: 'engine', label: 'Jet Turbine Engine', description: 'Generates high forward Thrust by compressing intake air, mixing it with fuel, and ignited exhausts.', x: 15, y: 70, type: 'control', statusLabel: 'Thrust Unit' },
      { id: 'intake', label: 'Leading Edge Intake', description: 'Splits incoming air molecules into an upper flow stream and a lower flow stream.', x: 15, y: 35, type: 'input', statusLabel: 'Stagnation Point' },
      { id: 'upper', label: 'Upper Wing Curvature', description: 'Air travels faster over the curved top, reducing local atmospheric pressure (Bernoulli Effect).', x: 50, y: 15, type: 'process', statusLabel: 'Low Pressure Area' },
      { id: 'lower', label: 'Lower Wing Surface', description: 'Air travels slower, piling up and applying force upwards by Newtonian action-reaction.', x: 50, y: 55, type: 'process', statusLabel: 'High Pressure Area' },
      { id: 'trailing', label: 'Trailing Edge Vent', description: 'Downwash of air is directed downwards, reinforcing the upward lift force reaction.', x: 85, y: 45, type: 'output', statusLabel: 'Downwash Flow' }
    ],
    connections: [
      { fromId: 'intake', toId: 'upper', label: 'Accelerated Stream', flowDirection: 'forward', flowSpeedMultiplier: 1.5 },
      { fromId: 'intake', toId: 'lower', label: 'Ambient Stream', flowDirection: 'forward', flowSpeedMultiplier: 0.8 },
      { fromId: 'upper', toId: 'trailing', label: 'Merging Air', flowDirection: 'forward' },
      { fromId: 'lower', toId: 'trailing', label: 'Deflected Air', flowDirection: 'forward' },
      { fromId: 'engine', toId: 'intake', label: 'Velocity Vector', flowDirection: 'none' }
    ],
    simulation: {
      params: [
        { id: 'speed', label: 'Airspeed (Knot Thrusters)', min: 100, max: 600, step: 20, defaultValue: 300, unit: 'kts', description: 'Controls speed of airflow streamline particles passing over and under the airfoil.' },
        { id: 'attack', label: 'Angle of Attack (Wing Pitch)', min: -5, max: 25, step: 1, defaultValue: 8, unit: '°', description: 'Pitch angle of the wing relative to the wind vector. Higher angles increase both Lift and Drag until stall.' }
      ],
      visualizerType: 'aerodynamics'
    },
    steps: [
      {
        title: 'Thrust is Generated first',
        description: 'The jet turbines burn fuel to accelerate air backwards, generating massive forward Thrust that pushes the aircraft through the air.',
        highlightNodes: ['engine'],
        highlightConnections: []
      },
      {
        title: 'Air Stream Split at the Airfoil',
        description: 'As the wing moves forward, air hits the front edge. It is forced to divide into two paths over and under the wing structure.',
        highlightNodes: ['intake'],
        highlightConnections: ['intake-upper', 'intake-lower']
      },
      {
        title: 'Bernoulli Dynamic Pressure Drop',
        description: 'Because the top surface of the wing is curved, air flow is forced to constrict and speed up. This rapid airflow creates a drop in pressure directly above the wing.',
        highlightNodes: ['upper'],
        highlightConnections: ['intake-upper']
      },
      {
        title: 'Newtonian Collision & High Pressure',
        description: 'Underneath the wing, the relatively flat angled surface collides with incoming air. This slows down the air molecules, creating a pocket of high concentration pressure.',
        highlightNodes: ['lower'],
        highlightConnections: ['intake-lower']
      },
      {
        title: 'Lift and Downwash Cohesion',
        description: 'The high pressure below pushes UP, while the low pressure above SUCKS the wing upward. They meet at the rear edge, accelerating air downwards (Downwash), resulting in flying!',
        highlightNodes: ['trailing'],
        highlightConnections: ['upper-trailing', 'lower-trailing']
      }
    ],
    realWorldApplications: [
      'Commercial Airliners (Boeing 787, Airbus A350)',
      'F1 Racing Wings (Inverted airfoils generating downforce instead of lift)',
      'Wind Turbine Blades (Spinning generator rotors via lift-thrust coefficients)'
    ],
    qAndA: [
      {
        question: 'Does an airplane fall if it flies upside down?',
        answer: 'No, because pilots can adjust the "Angle of Attack" (tilting the wing relative to target direction) to offset the lack of asymmetrical curve on the wing, generating lift upside down!'
      },
      {
        question: 'What is an aerodynamic "Stall"?',
        answer: 'If the Angle of Attack is too steep (usually above 18 degrees), the air flow on top of the wing separates completely, becoming turbulent. Instantly, Lift drops dramatically and Drag spikes, causing the airplane to fall.'
      }
    ]
  },
  {
    id: 'electricity-flow',
    title: 'How Electricity Works',
    category: 'Physics & Everyday Tech',
    summary: 'A fundamental view of a closed-loop electromagnetic circuit. Understand current, electromotive force (voltage), resistance, and light bulb dissipation.',
    iconName: 'Zap',
    nodes: [
      { id: 'battery', label: 'Power Source (Battery DC)', description: 'Stores potential electrical energy, maintaining an excess of electrons at the negative chemical terminal.', x: 15, y: 50, type: 'storage', statusLabel: 'Chemical Cells' },
      { id: 'wire', label: 'Conductor Path (Copper)', description: 'Contains millions of free, loosely bound electrons ready to drift along the atom grid lattice.', x: 50, y: 15, type: 'input', statusLabel: 'Low Resistance Wire' },
      { id: 'switch', label: 'Toggle Switch Gate', description: 'Physically bridges or cuts off the metallic trace flow path, preventing current from leaking away.', x: 50, y: 85, type: 'control', statusLabel: 'Open/Closed Circuit Gate' },
      { id: 'bulb', label: 'Filament/Resistor Output', description: 'Coiled tungsten metal path with high resistance. Electrons collide violently, releasing heat and radiant visible photons.', x: 85, y: 50, type: 'output', statusLabel: 'Resistive Load' }
    ],
    connections: [
      { fromId: 'battery', toId: 'wire', label: 'Electron Drift', flowDirection: 'forward' },
      { fromId: 'wire', toId: 'bulb', label: 'Friction Heat', flowDirection: 'forward' },
      { fromId: 'bulb', toId: 'switch', label: 'Returned Charge', flowDirection: 'forward' },
      { fromId: 'switch', toId: 'battery', label: 'Loop Completed', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'voltage', label: 'Voltage (Potential Push)', min: 1, max: 24, step: 1, defaultValue: 9, unit: 'V', description: 'The force driving the electron pressure. Higher voltage makes particles flow faster.' },
        { id: 'resistance', label: 'Filament Resistance', min: 1, max: 100, step: 5, defaultValue: 20, unit: 'Ω', description: 'The opposition to electron flow. Squeezes particles and causes atomic collisions.' }
      ],
      visualizerType: 'electricity'
    },
    steps: [
      {
        title: 'Chemical Separation of Charges',
        description: 'Inside the battery, a chemical reaction pushes electrons to the negative terminal, leaving the positive side hungry for electron charge. Ohms Law is born!',
        highlightNodes: ['battery']
      },
      {
        title: 'Circuit Closed via Bridging Switch',
        description: 'When the switch is flipped closed, a continuous metallic pathway is formed. An electric field propagates instantly through the wire at nearly the speed of light.',
        highlightNodes: ['switch']
      },
      {
        title: 'Drifting of Free Electrons',
        description: 'Though the electric field propagates instantly, the actual copper electrons drift very slowly (fraction of a millimeter per second) around the closed loop wire.',
        highlightNodes: ['wire']
      },
      {
        title: 'Friction and Photons inside the Filament',
        description: 'As electrons enter the super-thin tungsten filament of the bulb, they struggle through a narrow material space. Infinite collisions dump heat energy, causing light!',
        highlightNodes: ['bulb']
      }
    ],
    realWorldApplications: [
      'Residential Grid Outlets (120V up to 240V AC alternate flow loops)',
      'Microprocessor Silicon Gates (Transistors switching pico-amps block by block)',
      'Electric Vehicles (High capacity high-voltage direct current packs)'
    ],
    qAndA: [
      {
        question: 'Why does a bird standing on a single power line not get shocked?',
        answer: 'Electricity requires a differences in potential (voltage drop) to flow. Since both of the bird\'s feet are touching the exact same line at the exact same voltage, no current flows through the bird. However, if the bird touches another wire or the metal ground tower, watch out!'
      },
      {
        question: 'What is the absolute difference between AC and DC?',
        answer: 'Direct Current (DC) flows continuously in one direction (like a battery loop). Alternating Current (AC) rapidly vibrates back and forth 50 or 60 times a second (like wall outlets), moving power waves rather than physical electron caravans.'
      }
    ]
  },
  {
    id: 'internet-packets',
    title: 'How the Internet Works',
    category: 'Digital Networks & Telecom',
    summary: 'See how a message is chopped up into tiny packets, routed across chaotic distributed server arrays, and recompiled safely by your browser.',
    iconName: 'Globe',
    nodes: [
      { id: 'browser', label: 'Client (Web Browser)', description: 'The device initiating the lookup, encoding data segments into packets with IP header metadata.', x: 10, y: 50, type: 'input', statusLabel: 'Client Host IP' },
      { id: 'router1', label: 'Local ISP Hub Router', description: 'Identifies geographical prefix targets and feeds packets into massive cross-country optical pipelines.', x: 38, y: 25, type: 'process', statusLabel: 'Edge Router' },
      { id: 'router2', label: 'Autonomous System Transit B', description: 'An intermediate routing switch that dynamically routes around network fiber cuts or hardware congestion.', x: 38, y: 75, type: 'process', statusLabel: 'Transit Backbone Router' },
      { id: 'router3', label: 'Cloud Gateway Firewall', description: 'Filters out malicious requests, performs load balancing and directs validated packet payloads inwards.', x: 65, y: 50, type: 'process', statusLabel: 'Border Gateway Engine' },
      { id: 'server', label: 'Destination Web Server', description: 'Houses resource content databases, responding by sending sliced assets back down the routing web.', x: 90, y: 50, type: 'output', statusLabel: 'Web Host Resource' }
    ],
    connections: [
      { fromId: 'browser', toId: 'router1', label: 'Direct TCP Handshake', flowDirection: 'forward' },
      { fromId: 'browser', toId: 'router2', label: 'Ping Loopback', flowDirection: 'forward' },
      { fromId: 'router1', toId: 'router3', label: 'Fiber Link A', flowDirection: 'forward' },
      { fromId: 'router2', toId: 'router3', label: 'Fiber Link B', flowDirection: 'forward' },
      { fromId: 'router3', toId: 'server', label: 'Intranet Distribution', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'congestion', label: 'Network Congestion (Load%)', min: 0, max: 90, step: 10, defaultValue: 20, unit: '%', description: 'Sets the level of packet drop and latency across the routers. Slower router nodes drop packets.' },
        { id: 'packetSize', label: 'Packet Slice Size (MSS)', min: 128, max: 1500, step: 128, defaultValue: 512, unit: 'bytes', description: 'Skins down or expands data sizing chunks. Smaller packets mean more routing volume.' }
      ],
      visualizerType: 'network'
    },
    steps: [
      {
        title: 'Payload Slicing and IP Header Attachment',
        description: 'Your browser wants to send a picture file. Slicing it into 1500-byte packets, it appends a source IP, destination IP, and sequence number identifier to each.',
        highlightNodes: ['browser']
      },
      {
        title: 'BGP Routing Calculations',
        description: 'Routers evaluate routes using Border Gateway Protocol (BGP). Packets of the same message do not need to take the exact same route; each is routed independently based on instantaneous lane speeds.',
        highlightNodes: ['router1', 'router2']
      },
      {
        title: 'Buffer Processing at Firewalls',
        description: 'Packets converge on the border server, where security layers assemble headers, decrypt certificates (SSL/TLS), and organize safe requests.',
        highlightNodes: ['router3']
      },
      {
        title: 'Final TCP Reassembly',
        description: 'If a packet is lost in route (due to high congestion), the target server notes the gap in sequence and requests a retransmit. Once all units land, they stitch back into the image file.',
        highlightNodes: ['server']
      }
    ],
    realWorldApplications: [
      'DNS Servers (Translating system readable domain names into numeric IP targets)',
      'Submarine Oceanic Fiber Cables (Pushing petabytes under sea beds via laser pulses)',
      'TCP/IP Handshake Protocols (Guaranteed transport protocols for files)'
    ],
    qAndA: [
      {
        question: 'Wait! If packet paths are scrambled, why does video stream seamlessly?',
        answer: 'Modern video players use buffered delivery. They request several seconds of packets in advance, storing them in memory so your playback runs continuously even if a packet arrives sideways or requires instant retransmission.'
      },
      {
        question: 'How do fiber optic cables carry data under water?',
        answer: 'Optical fibers carry information inside thin strands of silicon glass. Internal lasers flicker millions of times a second. Total Internal Reflection prevents light from escaping, allowing the signal to travel across oceans at 2/3 the speed of light with repeaters amplifying the light.'
      }
    ]
  },
  {
    id: 'bridge-forces',
    title: 'How Bridges Are Built',
    category: 'Structural Mechanics',
    summary: 'Discover how suspension and truss structures translate heavy traffic loads into tension and compression balance, preventing collapse.',
    iconName: 'Bridge',
    nodes: [
      { id: 'deck', label: 'Traffic Suspension Deck', description: 'The horizontal roadway where static car weight and dynamic aerodynamic wind loads land.', x: 50, y: 65, type: 'input', statusLabel: 'Direct Deck Loading' },
      { id: 'hangers', label: 'Vertical Hanger Cables', description: 'Thin high-tensile steel wire strands holding the weight of the deck in high Tension.', x: 50, y: 35, type: 'process', statusLabel: 'High Tension Rope Arrays' },
      { id: 'cable', label: 'Main Catenary Cable', description: 'Thick cable draped over pillars in an elegant catenary slope, pooling all hanger loads directly.', x: 50, y: 15, type: 'process', statusLabel: 'Tension Distribution Curve' },
      { id: 'tower', label: 'Concrete Support Towers', description: 'Solid concrete pier assemblies driven deep into bedrock, taking massive Compression downwards.', x: 20, y: 45, type: 'control', statusLabel: 'Foundational Compression' },
      { id: 'anchor', label: 'Shored Abutment Anchorages', description: 'Monolithic concrete blocks secured to dry land holding the endpoints of the catenary wires tight.', x: 80, y: 75, type: 'storage', statusLabel: 'Tensional Abutments' }
    ],
    connections: [
      { fromId: 'deck', toId: 'hangers', label: 'Upward Tension Vector', flowDirection: 'forward' },
      { fromId: 'hangers', toId: 'cable', label: 'Load Aggregation', flowDirection: 'forward' },
      { fromId: 'cable', toId: 'tower', label: 'Compression Handshake', flowDirection: 'forward' },
      { fromId: 'cable', toId: 'anchor', label: 'Tension Tethering', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'load', label: 'Traffic Load (Car Weight)', min: 10, max: 200, step: 10, defaultValue: 50, unit: 'tons', description: 'Increases the localized weight loading forces on the span. High tons bend structural joints.' },
        { id: 'cableSlack', label: 'Catenary Wire Sag/Tension', min: 10, max: 80, step: 5, defaultValue: 30, unit: '%', description: 'Controls structural cable droop. Tighter cables lower compression on columns but stress tethers.' }
      ],
      visualizerType: 'bridge-forces'
    },
    steps: [
      {
        title: 'Structural Gravity Loading',
        description: 'Vehicles drive on the deck, creating localized downward load beams. These beams bend the road bed layer if not supported.',
        highlightNodes: ['deck']
      },
      {
        title: 'Tensive Force Ascent',
        description: 'The deck has zero pillars below it. Instead, vertically hung steel strings take the downward load and pull UP on the deck, absorbing the strain as pure Tension.',
        highlightNodes: ['hangers']
      },
      {
        title: 'Catenary Cable Distribution',
        description: 'The vertical hangers meet the massive, sweeping Main Cable. It curves downwards, distributing the tension forces into a massive vector heading straight for the towers.',
        highlightNodes: ['cable']
      },
      {
        title: 'Deep Pile Foundation Compression',
        description: 'The Main Cables press downwards over the peaks of the support towers. Columns bear the weight of the entire bridge spanning miles as direct Compression into underlying solid rock.',
        highlightNodes: ['tower']
      },
      {
        title: 'Horizontal Anchor Pull',
        description: 'At each end of the bridge, the Main Cables terminate deep in mountain bedrock or heavy concrete abutments, neutralizing the pulling tension forces completely.',
        highlightNodes: ['anchor']
      }
    ],
    realWorldApplications: [
      'Golden Gate Suspension Bridge (Classic catenary cable system spanning oceans)',
      'Akashi Kaikyō Japanese Bridge (Stretching 1.2 miles using high-alloy steel)',
      'Railroad Truss Bridges (Aesthetic triangles utilizing tension-compression grids)'
    ],
    qAndA: [
      {
        question: 'Wait! Why use steel cables if concrete is stronger?',
        answer: 'Concrete is highly prone to fracturing under Tension (being pulled apart). Steel cable bundles are exceptionally strong in tension. Bridges require concrete pillars for compression and steel cables for tension.'
      },
      {
        question: 'How did aerodynamic oscillations destroy the Tacoma Narrows Bridge?',
        answer: 'Wind blowing sideways across the flat plate deck created swirling air pockets (Kármán vortex street), matching the torsional swaying speed of the bridge. The natural feedback loop amplified the twist until the steel anchors ripped loose.'
      }
    ]
  },
  {
    id: 'satellite-orbit',
    title: 'How Satellites Orbit Earth',
    category: 'Astrophysics & Spacecraft',
    summary: 'A visual proof of Newton\'s Cannonball. Understand how orbital flight is actually an endless, speed-balanced free-fall around the curve of the Earth.',
    iconName: 'Orbit',
    nodes: [
      { id: 'thruster', label: 'Apogee Booster Engine', description: 'Generates lateral kinetic velocity. Speed vector must stay fast enough to balance the falling vector.', x: 15, y: 25, type: 'control', statusLabel: 'Delta-V Propulsion' },
      { id: 'gravity', label: 'Geoid Gravitational Pull', description: 'Earth\'s core gravity accelerates the satellite straight down at 9.8 m/s² (decaying with altitude).', x: 50, y: 70, type: 'input', statusLabel: 'Downward Radial Force' },
      { id: 'velocity', label: 'Tethered Horizontal Inertia', description: 'The satellite has forward inertia, trying to travel in a straight tangential path deep into space.', x: 50, y: 15, type: 'process', statusLabel: 'Orthogonal Vector' },
      { id: 'solar', label: 'Photovoltaic Arrays', description: 'Generates electricity to keep onboard navigation sensors, radios, and gyroscopes powered without fuel.', x: 85, y: 35, type: 'storage', statusLabel: 'Electrical Collector' }
    ],
    connections: [
      { fromId: 'thruster', toId: 'velocity', label: 'Transferred Inertia', flowDirection: 'forward' },
      { fromId: 'gravity', toId: 'velocity', label: 'Trajectory Bend', flowDirection: 'forward' },
      { fromId: 'velocity', toId: 'solar', label: 'Active Deployment', flowDirection: 'none' }
    ],
    simulation: {
      params: [
        { id: 'orbitalSpeed', label: 'Orbital Speed (V-Tangent)', min: 1000, max: 12000, step: 500, defaultValue: 7800, unit: 'm/s', description: 'Sideways velocity. If too slow, orbit decays and crashes. If too fast, it escapes earth gravity.' },
        { id: 'altitude', label: 'Altitude (Radial Height)', min: 200, max: 2000, step: 100, defaultValue: 800, unit: 'km', description: 'Distance from core Earth atmosphere. Lower altitude has thicker air dragging satellite speed.' }
      ],
      visualizerType: 'satellite-orbit'
    },
    steps: [
      {
        title: 'Launch beyond the Atmospheric Shroud',
        description: 'First, rocket boosters lift the craft above 200 km, leaving the thick frictional air molecules of Earth behind. No air friction means no speed drag!',
        highlightNodes: ['thruster']
      },
      {
        title: 'Radial Gravitational Pulling',
        description: 'Earth doesn\'t stop pulling in space. Gravity constantly yanks the satellite straight down toward the center of the earth, threatening to crash it.',
        highlightNodes: ['gravity']
      },
      {
        title: 'Lateral Velocity Vector',
        description: 'The satellite fires engines sideways. It now possesses tremendous sideways velocity (typically 7.8 kilometers per second). It wants to sail off in a straight line.',
        highlightNodes: ['velocity']
      },
      {
        title: 'Balanced Endless Free Fall',
        description: 'Because the satellite travels sideways so fast, by the time it falls 5 meters downward toward Earth, the Earth\'s surface has curved away by 5 meters! The satellite falls around Earth forever.',
        highlightNodes: ['velocity', 'gravity']
      }
    ],
    realWorldApplications: [
      'GPS Satellite Navigations (Medium Earth Orbit at 20,200 km)',
      'Starlink High Speed Internet (Low Earth Orbit array with high speed decay)',
      'Weather Monitoring (Geostationary Orbits matching Earth rotational period)'
    ],
    qAndA: [
      {
        question: 'Wait! Are astronauts in orbit actually weightless?',
        answer: 'No! At 400 km high (ISS orbit), Earth gravity is still 90% as strong as it is on the ground. Astronauts feel weightless only because they, and their station, are falling together towards the ground in an endless orbital fall.'
      },
      {
        question: 'What is a "Geostationary Orbit"?',
        answer: 'If you place a satellite exactly 35,786 km above the equator, its speed matches Earth\'s spin rate precisely. It stays locked over one geographical spot on earth forever, ideal for satellite TV beams!'
      }
    ]
  },
  {
    id: 'nuclear-reactor',
    title: 'How Nuclear Plants Generate Electricity',
    category: 'Nuclear Physics & Energy',
    summary: 'Trace how atomic fissions release massive heat, converting water to superheated pressurized steam loops that turn giant electricity generators.',
    iconName: 'Sparkles',
    nodes: [
      { id: 'rods', label: 'Neutron Absorbing Control Rods', description: 'Boron/Cadmium rods inserted or extracted from core to absorb excess neutrons and adjust reaction heat output.', x: 15, y: 25, type: 'control', statusLabel: 'Cadmium Damper' },
      { id: 'core', label: 'Uranium Nuclear Fuel Core', description: 'Enriched uranium bundles undergoing neutron-induced fission chain reaction, generating intense heat.', x: 15, y: 70, type: 'storage', statusLabel: 'Fission Core' },
      { id: 'coolant', label: 'Pressurized Coolant Loop', description: 'Heavy water circulates through core at huge pressure, absorbing fission core heat without boiling.', x: 45, y: 50, type: 'process', statusLabel: 'Primary Loop' },
      { id: 'steamG', label: 'Secondary Heat Exchanger', description: 'Thermal energy transfers across metal isolation tubes, boiling clean water into hyper-velocity dry steam.', x: 70, y: 35, type: 'process', statusLabel: 'Steam Generator' },
      { id: 'turbine', label: 'High Speed Turbine Generator', description: 'High-pressure steam expands across thousands of steel turbine blades, spinning a magnet to dump gigawatts into grid.', x: 85, y: 65, type: 'output', statusLabel: 'Generator Spin' }
    ],
    connections: [
      { fromId: 'rods', toId: 'core', label: 'Reaction Dampening', flowDirection: 'backward' },
      { fromId: 'core', toId: 'coolant', label: 'Thermal Lift', flowDirection: 'forward' },
      { fromId: 'coolant', toId: 'steamG', label: 'Heat Transmission', flowDirection: 'forward' },
      { fromId: 'steamG', toId: 'turbine', label: 'Kinetic Steam Flow', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'rodDepth', label: 'Control Rod Insertion (%)', min: 0, max: 100, step: 5, defaultValue: 60, unit: '%', description: 'Lower values pull rods out, increasing neutron collisions, core temperature, and fission rate.' },
        { id: 'coolantFlow', label: 'Water Coolant Pump Speed', min: 10, max: 100, step: 5, defaultValue: 50, unit: '%', description: 'Adjusts circulation pump flow rate. Safely sweeps away heat from the fuel core.' }
      ],
      visualizerType: 'nuclear-reactor'
    },
    steps: [
      {
        title: 'Neutron Collision Chain Reaction',
        description: 'A free neutron collides with a Uranium-235 atom, splitting it into smaller particles and releasing 2 or 3 brand new high-speed neutrons along with explosive kinetic heat.',
        highlightNodes: ['core']
      },
      {
        title: 'Reaction Rate Control Rod Dampening',
        description: 'To prevent runaway exponential explosions, control rods are inserted into core channels. These rods absorb excess neutrons, stabilizing the fission rate.',
        highlightNodes: ['rods']
      },
      {
        title: 'Superheated Primary Isolation Loop',
        description: 'The heat from fission core warms up the primary coolant water. Because this water is kept under extreme pressure, it cannot boil into steam, continuing to loop as a heavy liquid.',
        highlightNodes: ['coolant']
      },
      {
        title: 'Clean Secondary Steam Flash',
        description: 'Inside the steam generator, the piping loops contact a separate, secondary tank of water. Heat is safely transferred without mixing radioactive fluid, flashing clean secondary water into hyper-compressed steam.',
        highlightNodes: ['steamG']
      },
      {
        title: 'Turbine Spin & Condensing Loop',
        description: 'The ultra-compressed steam rushes out, blasting giant fan blades mounted to a massive shaft. This spins magnets inside a coil (Faradays Law), generating electric current before being condensed back to liquid.',
        highlightNodes: ['turbine']
      }
    ],
    realWorldApplications: [
      'Pressurized Water Reactors (PWR - Broadly deployed civilian utility plants)',
      'Nuclear Submarine Core (Compact reactors operating safely underwater for 20 years)',
      'Radioisotope Thermal Generators (RTGs on Voyager probes exploring deep solar systems)'
    ],
    qAndA: [
      {
        question: 'Wait! Can a civilian nuclear reactor block explode like an atomic bomb?',
        answer: 'No, it physically cannot. Civilian reactors use low enriched Uranium (only 3-5% U-235), whereas bombs require highly enriched U-235 (over 85%). If a plant fails, heat can build up and crack structures, but a nuclear blast is impossible.'
      },
      {
        question: 'How do cooling towers work? Do they emit toxic radiation smoke?',
        answer: 'No! The giant concrete hyperbola towers emit nothing but pure, harmless, clean water steam. It evaporates clean cooling loop heat back into the surrounding sky.'
      }
    ]
  },
  {
    id: 'submarine-diving',
    title: 'How Submarines Dive and Surface',
    category: 'Marine Engineering & Physics',
    summary: 'Adjust the ratio of compressed air to heavy ocean water inside steel Ballast Tanks to control Archimedes buoyancy forces and dive deep or surface safe.',
    iconName: 'Navigation',
    nodes: [
      { id: 'vent', label: 'Air Vent Valve', description: 'Controlled valves at the top of ballast tanks. Opening them lets trapped high pressure air escape into sky.', x: 15, y: 25, type: 'control', statusLabel: 'Top Air Valve' },
      { id: 'ballast', label: 'Main Steel Ballast Tank', description: 'Dual chambers sandwiched between hulls that house either positive buoyant air or heavy negative buoyant seawater.', x: 50, y: 45, type: 'process', statusLabel: 'Water/Air Chamber' },
      { id: 'seavalve', label: 'Open Bottom Sea Grates', description: 'Open non-closing flood grates under the tank that let raw ocean water flood in at any time.', x: 50, y: 75, type: 'input', statusLabel: 'Flood Grate' },
      { id: 'compressor', label: 'Compressed Air Flasks', description: 'High-pressure steel cylinders containing stored air molecules compressed up to 4500 psi.', x: 85, y: 35, type: 'storage', statusLabel: 'High Pressure Stash' }
    ],
    connections: [
      { fromId: 'vent', toId: 'ballast', label: 'Air Exhaust Out', flowDirection: 'forward' },
      { fromId: 'seavalve', toId: 'ballast', label: 'Water Flood In', flowDirection: 'forward' },
      { fromId: 'compressor', toId: 'ballast', label: 'Injected Blast Air', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'ventOpen', label: 'Vent Valve Aperture (%)', min: 0, max: 100, step: 10, defaultValue: 0, unit: '%', description: 'If opened, air inside escapes, letting the bottom sea grates flood weight inward, decreasing buoyancy.' },
        { id: 'blowAir', label: 'Blow Compressed Air (%)', min: 0, max: 100, step: 10, defaultValue: 0, unit: '%', description: 'Force-blasts compressed air pockets down from the air cylinders, pushing water out of the bottom sea grates.' }
      ],
      visualizerType: 'submarine-ballast'
    },
    steps: [
      {
        title: 'Primal Archimedes Buoyant State',
        description: 'Cruising on the surface, the submarine is lighter than water. Its ballast tanks are full of air, making overall density lower than the surrounding ocean.',
        highlightNodes: ['ballast']
      },
      {
        title: 'Vent Exhaust Rips Open',
        description: 'The captain commands a dive. Hydraulic valves at the top of the ballast tanks slide open, venting the light air content straight upwards into the sky.',
        highlightNodes: ['vent']
      },
      {
        title: 'Ocean Flooding Weight Increase',
        description: 'Since air left through the top, gravity pushes raw ocean water through the unblocked bottom grates, displacing air. Overall submarine weight spikes.',
        highlightNodes: ['seavalve', 'ballast']
      },
      {
        title: 'Neutrally Buoyant Cruising Depth',
        description: 'When the water volume matches the target weight displacement exactly (Neutral Buoyancy), the vents close. Hydroplanes on the hull are tilted to sail up or down at speed.',
        highlightNodes: ['ballast']
      },
      {
        title: 'The Air Blast Surface Recovery',
        description: 'To surface, the captain blows high-pressure air from cylinders directly into the top of the ballast tanks. Air pushes water out bottom flood grates, decreasing weight!',
        highlightNodes: ['compressor', 'ballast']
      }
    ],
    realWorldApplications: [
      'Military Nuclear Submarines (Ohio-class cruise patrols carrying hundreds for months)',
      'Deep Sea Research Submersibles (Alvin or Mariana Trench trieste crafts)',
      'Sunken Ship Recovery Pontoons (Towing collapsed structures via inflatable ballast bladders)'
    ],
    qAndA: [
      {
        question: 'Wait! Does a submarine crush if it goes too deep?',
        answer: 'Yes! Water pressure spikes by roughly 1 atmosphere (14.7 psi) for every 10 meters of depth. Go too deep (beyond a submarine\'s test limit, typically 500-800m), and pressure forces exceed the structural load limit of the titanium/steel hull, causing implosion.'
      },
      {
        question: 'How do submarines breathe and get fresh water underwater for 3 months?',
        answer: 'Submarines use electrolysis machines to split seawater molecules into Hydrogen (vented overboard) and Oxygen (scrubbed into air). They evaporate seawater inside distillers to make ultra-pure drinking water, powered by an onboard nuclear reactor.'
      }
    ]
  },
  {
    id: 'gps-trilateration',
    title: 'How GPS Determines Location',
    category: 'Relativity & Geopositioning',
    summary: 'Discover how matching atomic tick timestamps received from three orbiting satellites allows a handset to calculate precise spatial coordinates.',
    iconName: 'Map',
    nodes: [
      { id: 'satA', label: 'Satellite A (Alpha Clock)', description: 'Orbiting atomic clock broadcasting a clean time signature signal speed: 299,792 km/h.', x: 15, y: 15, type: 'storage', statusLabel: 'Atomic Clock Tick' },
      { id: 'satB', label: 'Satellite B (Beta Clock)', description: 'Orbits in medium trajectory tracking time precisely down to nanosecond resolution ticks.', x: 80, y: 15, type: 'storage', statusLabel: 'Atomic Clock Tick' },
      { id: 'satC', label: 'Satellite C (Gamma Clock)', description: 'Third satellite broadcast. Anchors the coordinate geometry into 3 planes of intersection.', x: 50, y: 75, type: 'storage', statusLabel: 'Atomic Clock Tick' },
      { id: 'handset', label: 'Handset Receiver Module', description: 'Your phone calculates difference between when a time stamp sent and received to compute distance.', x: 50, y: 35, type: 'input', statusLabel: 'Time Signal Parser' }
    ],
    connections: [
      { fromId: 'satA', toId: 'handset', label: 'Microwave Stream A', flowDirection: 'forward' },
      { fromId: 'satB', toId: 'handset', label: 'Microwave Stream B', flowDirection: 'forward' },
      { fromId: 'satC', toId: 'handset', label: 'Microwave Stream C', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'timeLagA', label: 'Signal Transit Lag A (ms)', min: 65, max: 85, step: 1, defaultValue: 72, unit: 'ms', description: 'Sets calculated distance from Sat A. Space radio signals travel at the speed of light.' },
        { id: 'timeLagB', label: 'Signal Transit Lag B (ms)', min: 65, max: 85, step: 1, defaultValue: 67, unit: 'ms', description: 'Sets calculated distance from Sat B. Controls the radius of signal sphere overlap.' }
      ],
      visualizerType: 'gps-trilateration'
    },
    steps: [
      {
        title: 'Precision Atomic Time Stamp Radio Waves',
        description: 'Every Global Positioning Satellite holds a rubidium atomic clock. It incessantly broadcasts a radio pulse saying: "I am Sat A, and I sent this message at exactly 12:00:00.000000002."',
        highlightNodes: ['satA', 'satB', 'satC']
      },
      {
        title: 'Speed of Light Travel Time Computation',
        description: 'Your receiver phone listens. It looks at its own clock (say 12:00:00.000000072). Subtracting the timestamp, it calculates a 70 nanosecond delay, translating to 21 kilometers distance.',
        highlightNodes: ['handset']
      },
      {
        title: 'First Two Sphere Intersects (Circle Overlap)',
        description: 'Knowing you are 20km from Sat A means you are somewhere on a vast sphere centered on Sat A. Adding distance from B leaves only a circle of overlapping coordinate matches.',
        highlightNodes: ['satA', 'satB', 'handset']
      },
      {
        title: 'Third Coordinate Anchoring',
        description: 'Receiving distance from Sat C narrows the overlaps down to exactly two coordinate points on earth. Since one is in deep space (rejected), the other is you!',
        highlightNodes: ['satC', 'handset']
      }
    ],
    realWorldApplications: [
      'Aero Navigation G1000 flight systems',
      'Autonomous Tractor seeding farming layout tracks',
      'Turn-by-turn routing (Google Maps, cycling GPS receivers)'
    ],
    qAndA: [
      {
        question: 'Wait! Why does GPS require Einsteins Theory of Relativity?',
        answer: 'Because gravity is weaker in orbit, satellite clocks tick faster by 45 microseconds a day. But because they travel so fast laterally, time dilates slower by 7 microseconds. Net result: Sat clocks sprint 38 microseconds fast per day! Without daily relativistic offsets, GPS calculations would drift by 11 kilometers daily!'
      },
      {
        question: 'Does the phone broadcast user location back to satellites?',
        answer: 'No! GPS is completely passive. Satellites are just cosmic radio speakers. Your phone parses the streams in silence. Satellites have no idea who is listening.'
      }
    ]
  },
  {
    id: 'electricity-home',
    title: 'How Electricity Powers Your Home',
    category: 'Household Infrastructure',
    summary: 'Trace the flow of electricity from mechanical generation plants all the way to your lights, analyzing step-up and step-down voltage balancing.',
    iconName: 'Zap',
    nodes: [
      { id: 'generation', label: 'Mechanical Power Station', description: 'Converts potential energy (water, gas, or wind momentum) into rotational mechanical force.', x: 10, y: 70, type: 'control', statusLabel: 'Energy Harvester' },
      { id: 'conversion', label: 'Inductive Generator', description: 'Spins heavy magnets inside copper coils to induce an alternating electromagnetic charge.', x: 30, y: 35, type: 'process', statusLabel: 'AC Current Generator' },
      { id: 'transmission', label: 'Step-Up Transformer', description: 'Increases the voltage thousands of times to transmit electric power far away with minimal heat dissipation.', x: 50, y: 15, type: 'process', statusLabel: 'High Voltage Uplink' },
      { id: 'substation', label: 'Step-Down Transformer', description: 'Gradually reduces the extreme voltage block by block to make it completely safe for residential use.', x: 70, y: 45, type: 'process', statusLabel: 'Neighborhood Substation' },
      { id: 'home', label: 'Your Smart Home Grid', description: 'Power enters your walls and distributes to smart outlets, turning into heat, movement or visible light.', x: 90, y: 70, type: 'output', statusLabel: 'Household load' }
    ],
    connections: [
      { fromId: 'generation', toId: 'conversion', label: 'Torque Transmission', flowDirection: 'forward' },
      { fromId: 'conversion', toId: 'transmission', label: 'Raw current flow', flowDirection: 'forward' },
      { fromId: 'transmission', toId: 'substation', label: 'High Voltage highway', flowDirection: 'forward', flowSpeedMultiplier: 2.5 },
      { fromId: 'substation', toId: 'home', label: 'Residential drop', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'load', label: 'Home Electrical Grid Load', min: 1, max: 4, step: 1, defaultValue: 2, unit: 'lvl', description: 'Controls current demand: 1 is Low (Stable), 2 is Medium (Normal), 3 is High (Heating Wires), 4 is Overload (Outage).' }
      ],
      visualizerType: 'electricity-home'
    },
    steps: [
      {
        title: 'Primal Mechanical Generation',
        description: 'Electricity starts by converting mechanical motion (water dams, steam turbines, or wind rotors) into physical shaft leverage.',
        highlightNodes: ['generation']
      },
      {
        title: 'Induced Alternating Current',
        description: 'Internal generators turn magnets inside wire loops to produce a wave of alternating electromotive pressure (AC electricity).',
        highlightNodes: ['conversion']
      },
      {
        title: 'High-Voltage Power Transmission Link',
        description: 'Voltage is lifted exponentially by transformers before traveling across high-voltage pylon cables. High pressure means negligible energy is lost as wire heat.',
        highlightNodes: ['transmission']
      },
      {
        title: 'Step-Down Municipal Distribution',
        description: 'Safe sub-stations lower the pressure back down from thousands of volts to standard, user-safe voltages like 110V or 220V.',
        highlightNodes: ['substation']
      },
      {
        title: 'Household Power Conversion',
        description: 'Electricity finalizes its journey inside wire loops, converting atomic motion back into light in lamps, heat in heaters, or mechanical motion in appliances.',
        highlightNodes: ['home']
      }
    ],
    realWorldApplications: [
      'Municipal Electrical Grids (Managing step-up and step-down safety loops across thousands of miles)',
      'Home Distribution Panels (Configuring safety circuit breakers to auto-shutoff if overload occurs)',
      'High-Voltage AC Direct Lines (Intercontinental links providing power swapping)'
    ],
    qAndA: [
      {
        question: 'Why do we use Alternating Current (AC) instead of Direct Current (DC) in houses?',
        answer: 'AC is used because it can easily be stepped up or down using magnetic transformers, allowing efficient long-distance transmission.',
        why: 'In a transformer, AC creates a constantly changing magnetic field that easily induces voltage in an adjacent coil. DC is static; it cannot pass through standard transformers easily for voltage changes.',
        example: 'Power stations transmit electricity at up to 500,000 Volts to minimize current resistance, but safely step it down to 220 Volts for your television.',
        tryIt: { paramId: 'load', value: 2, comment: 'Let’s check the medium, standard residential pressure flow.' }
      },
      {
        question: 'Does electricity literally "run" through the wire at light speed?',
        answer: 'The physical electrons crawl very slowly, but the electrical field wave travels at about 90% of the speed of light.',
        why: 'When you close a switch, the electric field pushes all electrons in the wire simultaneously. It is like a tube already crammed full of water: when you push one drop in, a drop pops out the other side instantly, regardless of how slow individual molecules move.',
        example: 'Individual copper electrons drift at about 1 millimeter per second. Yet your light bulb glows microseconds after you hit the switch!',
        tryIt: { paramId: 'load', value: 1, comment: 'Examine the low, steady stable atomic electron flow.' }
      },
      {
        question: 'Why do we not feel shocked while touching insulated cables?',
        answer: 'Because insulated cords are wrapped in thick, low-conductivity rubbers that prevent the circuit from grounding through your body.',
        why: 'Current only flows if a closed, low-resistance path exists to the ground. Insulators have high electrical resistance, fully containing the high-pressure field within the internal brass or copper cords.',
        example: 'Household extension cords are clad in vulcanized vinyl polymer designed to isolate up to 600 Volts.',
        tryIt: { paramId: 'load', value: 3, comment: 'Set the load to high, causing higher heat stress inside wires.' }
      }
    ]
  },
  {
    id: 'maglev-glide',
    title: 'How Maglev Trains Glide',
    category: 'Electromagnetism & Transit',
    summary: 'Explore how superconducting electromagnets use magnetic repulsion and attraction to levitate and propel trains at ultra-high speeds without touch.',
    iconName: 'Compass',
    nodes: [
      { id: 'superconductor', label: 'Superconducting Magnets', description: 'Powerful onboard electromagnets cooled by liquid helium to generate immense magnetic fields without electrical resistance.', x: 15, y: 30, type: 'control', statusLabel: 'Onboard Cryo-Magnets' },
      { id: 'track', label: 'Electromagnetic Guideway', description: 'Static track containing continuous loop coils that interact dynamically with the passing onboard magnetic field vectors.', x: 50, y: 75, type: 'process', statusLabel: 'Passive Track Coils' },
      { id: 'levitation', label: 'Magnetic Levitation Gap', description: 'The stable air gap where upward magnetic repulsion forces balance the downward mass gravity vector.', x: 50, y: 30, type: 'input', statusLabel: 'Levitation Equilibrium' },
      { id: 'propulsion', label: 'Linear Motor Propulsion', description: 'Flickering AC current along the track walls creates a moving magnetic wave pulling the train forward.', x: 85, y: 45, type: 'output', statusLabel: 'Linear Thrust Motor' }
    ],
    connections: [
      { fromId: 'superconductor', toId: 'levitation', label: 'Repulsion field', flowDirection: 'forward' },
      { fromId: 'track', toId: 'levitation', label: 'Induced counter-pole', flowDirection: 'forward' },
      { fromId: 'levitation', toId: 'propulsion', label: 'Glide trajectory', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'fieldStrength', label: 'Magnetic Field Strength (Tesla)', min: 1, max: 10, step: 1, defaultValue: 5, unit: 'T', description: 'Controls the levitation force. Higher tesla creates wider air gaps between the hull and track.' },
        { id: 'speed', label: 'AC Frequency (Propulsion Speed)', min: 50, max: 600, step: 50, defaultValue: 300, unit: 'Hz', description: 'The shifting speed of track magnets. Higher frequency accelerates travel velocity.' }
      ],
      visualizerType: 'satellite-orbit'
    },
    steps: [
      {
        title: 'Cryogenic Superconductivity',
        description: 'Onboard electromagnet coils are chilled with liquid helium near absolute zero, letting thousands of Amps flow with zero electrical resistance, generating extreme magnetic fields.',
        highlightNodes: ['superconductor']
      },
      {
        title: 'Induced Repulsion Lift-Off',
        description: 'As the train speeds over the track, its onboard magnets induce electric currents in the passive track coils (Lenz\'s Law), producing an opposing field that lifts the train 10cm high.',
        highlightNodes: ['track', 'levitation']
      },
      {
        title: 'Continuous Levitation Balance',
        description: 'Gravity pulls down, while magnetic repulsion pushes up. The air gap stabilizes automatically: if the train drops, repulsion increases instantly, pushing it back up.',
        highlightNodes: ['levitation']
      },
      {
        title: 'Linear Electromagnetic Propulsion',
        description: 'Coils along the track walls are fed with Alternating Current, creating a forward-marching magnetic wave. This wave constantly pulls and pushes the train\'s magnets forward.',
        highlightNodes: ['propulsion']
      }
    ],
    realWorldApplications: [
      'Shanghai Transrapid Maglev (Cruising commercially at 430 km/h)',
      'Chuo Shinkansen Japanese L0 Series (Holding the record speed of 603 km/h)',
      'Magnetic Bearings (Industrial rotators spinning at 100,000 RPM with zero contact wear)'
    ],
    theory: {
      titleEn: 'Electromagnetic Levitation and Linear Propulsion',
      titleAr: 'الرفع الكهرومغناطيسي والدفع الخطي المعلق',
      thesisEn: 'Maglev trains eliminate mechanical friction by utilizing electromagnetic levitation and propulsion, allowing extreme high-speed transit with zero rail contact.',
      thesisAr: 'تلغي قطارات المغناطيس المعلق الاحتكاك الميكانيكي تمامًا عبر استخدام قوى الرفع والدفع المغناطيسي التوافقي لتطير فوق السكك بسرعة فائقة.',
      mathEn: 'Hovering height is governed by electromagnetic induction force balancing gravitational mass: F_m = (mu_0 * I^2) / (2 * pi * d) = mg.',
      mathAr: 'يُحكم ارتفاع التحليق بتوازن القوة الكهرومغناطيسية الناتجة عن التيار مع كتلة الجاذبية: F_m = (mu_0 * I^2) / (2 * pi * d) = mg.',
      historyEn: 'Pioneered by James Powell and Gordon Danby in the 1960s, leading to Japan\'s high-speed Yamanashi L0 series superconducting trials.',
      historyAr: 'ابتكر الفكرة جيمس باول وغوردون دانبي في الستينيات، وتوجت بسلسلة قطارات Yamanashi L0 اليابانية فائقة السرعة.',
      challengeEn: 'Maintaining superconducting state requires extreme cryogenic cooling using liquid helium near absolute zero.',
      challengeAr: 'يتطلب الحفاظ على الحالة فائقة التوصيل تبريدًا كرويوجينيًا شديدًا باستخدام الهيليوم السائل بالقرب من الصفر المطلق.'
    },
    qAndA: [
      {
        question: 'Why do Maglev trains not derail when turning corners?',
        answer: 'They are laterally locked by guide magnets on the sides of the track.',
        why: 'The guideway has vertical walls containing steering magnets. If the train drifts left, repulsive forces on the left increase while attractive forces on the right pull it back, securing it perfectly centered.',
        example: 'The Yamanashi track uses U-shaped concrete walls that fully embrace the bottom of the train.',
        tryIt: { paramId: 'fieldStrength', value: 8, comment: 'Pumping magnets to 8 Tesla stabilizes the suspension deck under load.' }
      }
    ]
  },
  {
    id: 'fiber-optics',
    title: 'How Fiber Optic Cables Carry Data',
    category: 'Optics & Telecommunications',
    summary: 'Understand how light rays are trapped inside a pure silicon glass core, bouncing endlessly via Total Internal Reflection to transmit petabytes of data at the speed of light.',
    iconName: 'Compass',
    nodes: [
      { id: 'laser', label: 'Transmitter Laser Diode', description: 'Flickers laser light pulses billions of times per second (gigahertz) to convert digital binary bits into light photons.', x: 15, y: 50, type: 'control', statusLabel: 'Laser Source' },
      { id: 'core', label: 'Silicon Glass Core', description: 'Ultra-pure silica cylinder with a high refractive index where light rays propagate over vast distances.', x: 50, y: 25, type: 'process', statusLabel: 'High-Index Core' },
      { id: 'cladding', label: 'Low-Index Cladding Layer', description: 'Surrounding glass shell with a lower refractive index, forcing light rays back inside via reflection.', x: 50, y: 75, type: 'process', statusLabel: 'Reflective Cladding' },
      { id: 'receiver', label: 'Photodiode Signal Receiver', description: 'Sensitive optical sensor that detects incoming photon pulses and converts them back into electronic binary data.', x: 85, y: 50, type: 'output', statusLabel: 'Signal Receiver' }
    ],
    connections: [
      { fromId: 'laser', toId: 'core', label: 'Light injection', flowDirection: 'forward' },
      { fromId: 'cladding', toId: 'core', label: 'Boundary reflection', flowDirection: 'backward' },
      { fromId: 'core', toId: 'receiver', label: 'Reassembled pulses', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'angle', label: 'Injection Angle (Angle of Incidence)', min: 5, max: 80, step: 5, defaultValue: 35, unit: '°', description: 'Angle of light entering the core. If steeper than the critical angle, light leaks out into cladding.' },
        { id: 'wavelength', label: 'Laser Carrier Wavelength', min: 850, max: 1550, step: 50, defaultValue: 1310, unit: 'nm', description: 'Wavelength of light. Longer infrared wavelengths (1550nm) travel further with less glass absorption.' }
      ],
      visualizerType: 'network'
    },
    steps: [
      {
        title: 'Binary-to-Photon Digital Conversion',
        description: 'Incoming electronic computer data (0s and 1s) is fed into a high-precision laser diode, flickering it on and off billions of times a second to represent binary signals.',
        highlightNodes: ['laser']
      },
      {
        title: 'Total Internal Reflection Bouncing',
        description: 'Light enters the central silicon glass core. When it hits the boundary of the lower-index cladding layer, it cannot escape. Instead, it undergoes 100% reflection, bouncing forward.',
        highlightNodes: ['core', 'cladding']
      },
      {
        title: 'Infrared Waveguide Propagation',
        description: 'The light beam travels down the fiber optic highway, behaving as an electromagnetic waveguide trapped inside the glass strand with virtually no light escaping through the sides.',
        highlightNodes: ['core']
      },
      {
        title: 'Photodiode Pulse Translation',
        description: 'The pulses arrive at their destination. A high-speed semiconductor photodiode detects the flashing photons, generating matching current surges that are translated back into digital files.',
        highlightNodes: ['receiver']
      }
    ],
    realWorldApplications: [
      'Transoceanic Fiber Cables (Linking continents across sea beds with up to 250 terabits per second)',
      'Fiber-To-The-Home (FTTH high-speed gigabit residential internet connections)',
      'Medical Endoscopes (Using flexible optical bundles to transmit images from inside the human body)'
    ],
    theory: {
      titleEn: 'Total Internal Reflection and Optical Fibers',
      titleAr: 'الانعكاس الداخلي الكلي والألياف البصرية المتطورة',
      thesisEn: 'Total internal reflection occurs when light travels from a higher refractive index medium to a lower one at an angle greater than the critical angle, fully trapping light inside.',
      thesisAr: 'يحدث الانعكاس الداخلي الكلي عندما ينتقل الضوء من وسط ذي معامل انكسار أعلى إلى وسط أقل معامل انكسار بزاوية أكبر من الزاوية الحرجة، محاصرًا الضوء تمامًا.',
      mathEn: 'The critical angle is mathematically calculated using Snell\'s Law: theta_c = arcsin(n_2 / n_1).',
      mathAr: 'تُحسب الزاوية الحرجة رياضيًا باستخدام قانون سنيل للانكسار: theta_c = arcsin(n_2 / n_1).',
      historyEn: 'Perfected for telecom by Charles Kao in 1966, whose calculation of silicon glass purity limits won the 2009 Nobel Prize in Physics.',
      historyAr: 'طورها للاتصالات تشارلز كاو عام 1966 بحسابه لحدود نقاء زجاج السليكون، نائلًا جائزة نوبل في الفيزياء عام 2009.',
      challengeEn: 'Signal attenuation caused by tiny impurities in the glass requires optical erbium amplifiers every 80 kilometers.',
      challengeAr: 'يتطلب وهن الإشارة الناتج عن الشوائب الدقيقة في الزجاج وضع مضخمات بصرية من الإربيوم كل 80 كيلومترًا.'
    },
    qAndA: [
      {
        question: 'Why does light not leak out of the fiber when the cable bends?',
        answer: 'Because the bend radius is kept gentle enough to maintain the reflection angle.',
        why: 'As long as the cable isn\'t bent too sharply, the light continues to strike the cladding boundary at an angle greater than the critical angle, preserving total internal reflection.',
        example: 'Standard fiber cables have a minimum bend radius of about 30 millimeters to prevent signal loss.',
        tryIt: { paramId: 'angle', value: 30, comment: 'Setting the injection angle to 30 degrees ensures safe, lossless internal bouncing.' }
      }
    ]
  },
  {
    id: 'gyroscope-precession',
    title: 'How Gyroscopes Defy Gravity',
    category: 'Rotational Dynamics',
    summary: 'Discover how angular momentum and rotational inertia convert falling gravitational torque into orthogonal precession, maintaining spatial orientation.',
    iconName: 'Compass',
    nodes: [
      { id: 'flywheel', label: 'Spinning Heavy Flywheel', description: 'A high-mass brass disk spun at immense speeds to store massive amounts of rotational kinetic energy and angular momentum.', x: 50, y: 15, type: 'storage', statusLabel: 'High-RPM Rotor' },
      { id: 'gimbals', label: 'Triple Gimbal Frame', description: 'A series of concentric pivoting rings that isolate the inner spinning wheel from any external tilting of the base.', x: 15, y: 50, type: 'control', statusLabel: 'Isolation Bearings' },
      { id: 'torque', label: 'Gravitational Tilting Torque', description: 'An external pulling force (like gravity) trying to tip the spin axis of the flywheel over.', x: 50, y: 75, type: 'input', statusLabel: 'Gravity Axis Pull' },
      { id: 'precession', label: 'Gyroscopic Precession Vector', description: 'The resulting lateral circular movement of the axle, perpendicular to both the spin vector and the tilting torque.', x: 85, y: 50, type: 'output', statusLabel: 'Orthogonal Motion' }
    ],
    connections: [
      { fromId: 'gimbals', toId: 'flywheel', label: 'Rotational support', flowDirection: 'forward' },
      { fromId: 'flywheel', toId: 'torque', label: 'Inertia resistance', flowDirection: 'backward' },
      { fromId: 'torque', toId: 'precession', label: '90-Degree shifting', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'spinRate', label: 'Flywheel Rotation Speed (RPM)', min: 1000, max: 15000, step: 1000, defaultValue: 8000, unit: 'rpm', description: 'How fast the flywheel is spinning. Faster spin rates increase angular momentum and resist tipping.' },
        { id: 'tiltForce', label: 'External Tipping Force', min: 1, max: 10, step: 1, defaultValue: 4, unit: 'N', description: 'Forces pushing sideways on the axle. Higher forces cause faster perpendicular precession.' }
      ],
      visualizerType: 'satellite-orbit'
    },
    steps: [
      {
        title: 'Angular Momentum Accumulation',
        description: 'When the heavy flywheel spins, it generates a vector of Angular Momentum pointing straight out along the axle. This vector resists any sudden changes in direction.',
        highlightNodes: ['flywheel']
      },
      {
        title: 'Tipping Torque Application',
        description: 'Gravity tries to pull one end of the axle down, creating a rotating Torque. In a non-spinning wheel, this gravity torque would instantly flip the wheel over.',
        highlightNodes: ['torque']
      },
      {
        title: 'The Ninety-Degree Vector Cross Product',
        description: 'Because the wheel is spinning, the angular momentum combines mathematically with the gravity torque. The wheel responds by tilting not down, but ninety degrees sideways!',
        highlightNodes: ['precession']
      },
      {
        title: 'Continuous Precession Loop',
        description: 'The axle circles sideways around the vertical support stand (Precession). It walks in a circle, gravity pulling down while precession pushes sideways, keeping the gyro fully suspended.',
        highlightNodes: ['flywheel', 'precession']
      }
    ],
    realWorldApplications: [
      'Hubble Space Telescope Reaction Wheels (Pivoting the telescope in deep space without firing chemical rockets)',
      'Ship Anti-Roll Stabilizers (Giant 20-ton gyros that counter wave-induced rocking)',
      'Smartphone Orientation Sensors (Microscopic MEMS vibrating tuning forks measuring pitch and roll)'
    ],
    theory: {
      titleEn: 'Angular Momentum and Gyroscopic Precession',
      titleAr: 'الزخم الزاوي والدوران المغزلي للجيروسكوبات',
      thesisEn: 'A spinning gyroscope resists changes to its orientation because of the conservation of angular momentum, redirecting torque into a perpendicular motion called precession.',
      thesisAr: 'يقاوم الجيروسكوب الدوار التغير في اتجاه محوره بفعل قانون حفظ الزخم الزاوي للمقذوفات الدوارة، محولًا قوى الإمالة لحركة دائرية متعامدة تُدعى المبادرة الجيروسكوبية.',
      mathEn: 'Precession frequency is inversely proportional to angular momentum: Omega_p = tau / (I * omega).',
      mathAr: 'تتناسب سرعة المبادرة الدائرية عكسيًا مع الزخم الزاوي وسرعة الدوران: Omega_p = tau / (I * omega).',
      historyEn: 'Invented in 1852 by French physicist Leon Foucault to demonstrate Earth\'s rotation, now vital in spacecraft guidance and aircraft attitude indicators.',
      historyAr: 'اخترعه ليون فوكو عام 1852 لإثبات دوران الكوكب، ويشكل اليوم عصب ملاحة وتوجيه الطائرات وسفن الفضاء.',
      challengeEn: 'Mechanical friction in physical gimbal bearings causes progressive drift, which is corrected in modern systems using optical ring laser gyroscopes.',
      challengeAr: 'يسبب الاحتكاك الميكانيكي في محامل المفاصل انحرافًا تراكميًا للزاوية، يُصحح حديثًا باستخدام جيروسكوبات الليزر الحلقة البصرية.'
    },
    qAndA: [
      {
        question: 'How do spacecraft rotate in vacuum if there is nothing to push against?',
        answer: 'They spin internal reaction wheels in the opposite direction.',
        why: 'By Newton\'s third law of rotational action-reaction, spinning an internal heavy metal wheel clockwise forces the entire spacecraft hull to rotate counter-clockwise, allowing precise celestial targeting.',
        example: 'Spacecraft use reaction wheel arrays aligned to X, Y, and Z axes to point at distant stars.',
        tryIt: { paramId: 'spinRate', value: 12000, comment: 'Spinning the flywheel to 12000 RPM increases angular inertia, slowing down precession wobble.' }
      }
    ]
  },
  {
    id: 'hydroelectric-dam',
    title: 'How Hydroelectric Dams Work',
    category: 'Fluid Mechanics & Energy',
    summary: 'Trace how the gravitational potential energy of high-elevation reservoir water is converted into kinetic fluid rushing down penstocks to spin massive turbine generators.',
    iconName: 'Compass',
    nodes: [
      { id: 'reservoir', label: 'Elevated Water Reservoir', description: 'Massive elevated lake storing water molecules, acting as a giant accumulator of gravitational potential energy.', x: 15, y: 25, type: 'storage', statusLabel: 'Potential Energy Reservoir' },
      { id: 'penstock', label: 'Gravity Intake Penstock', description: 'A long, sloping pressure pipe that forces falling water to accelerate, turning static pressure into kinetic energy.', x: 50, y: 50, type: 'process', statusLabel: 'Compressed Penstock' },
      { id: 'turbine', label: 'Hydraulic Francis Turbine', description: 'Massive angled blades sculpted to extract maximum kinetic force from water, converting fluid flow into rotational torque.', x: 50, y: 75, type: 'input', statusLabel: 'Turbine Runner' },
      { id: 'generator', label: 'Electromagnetic Generator Grid', description: 'Rotor magnets spin inside copper stator coils (Faraday\'s Law), converting mechanical shaft rotation into electricity.', x: 85, y: 25, type: 'output', statusLabel: 'Rotary Generator Grid' }
    ],
    connections: [
      { fromId: 'reservoir', toId: 'penstock', label: 'Head Pressure', flowDirection: 'forward' },
      { fromId: 'penstock', toId: 'turbine', label: 'Kinetic Jet Spray', flowDirection: 'forward' },
      { fromId: 'turbine', toId: 'generator', label: 'Torque Transmission', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'waterHead', label: 'Reservoir Height (Water Head)', min: 10, max: 200, step: 10, defaultValue: 100, unit: 'm', description: 'Height difference. Higher heads create tremendous hydrostatic pressure at the bottom of the penstock.' },
        { id: 'gateOpen', label: 'Intake Control Gate Opening', min: 10, max: 100, step: 10, defaultValue: 60, unit: '%', description: 'How wide the intake valve is opened, controlling total volume discharge of fluid.' }
      ],
      visualizerType: 'submarine-ballast'
    },
    steps: [
      {
        title: 'Gravitational Energy Accumulation',
        description: 'Solar heat evaporates seawater, dumping rain over high mountains. Dams trap this water in high reservoirs, packing gigajoules of potential energy.',
        highlightNodes: ['reservoir']
      },
      {
        title: 'Penstock Compression Rush',
        description: 'Water enters the intake penstock. As it falls down the narrow steel pipe, gravitational pull compresses the water, transforming head pressure into high-velocity kinetic fluid spray.',
        highlightNodes: ['penstock']
      },
      {
        title: 'Francis Hydraulic Blade Capture',
        description: 'The high-pressure water jets blast against curved Francis turbine blades, forcing the central shaft to rotate. The spent water exits gently into the downstream river.',
        highlightNodes: ['turbine']
      },
      {
        title: 'Grid Electromagnetic Generation',
        description: 'The rotating turbine spins a giant shaft holding heavy electromagnets. This moving magnetic field excites electrons inside copper grid coils, creating electric current.',
        highlightNodes: ['generator']
      }
    ],
    realWorldApplications: [
      'Three Gorges Dam (The world\'s largest power station generating 22,500 Megawatts)',
      'Hoover Dam (Supplying electricity to over 1.3 million homes in California, Arizona, and Nevada)',
      'Pumped Storage Plants (Reversing turbines to pump water back up to the reservoir during excess grid power)'
    ],
    theory: {
      titleEn: 'Gravitational Potential Energy and Hydraulic Power',
      titleAr: 'طاقة الوضع الكامنة والطاقة الهيدروليكية للسدود',
      thesisEn: 'Hydroelectric dams convert the gravitational potential energy of water into mechanical kinetic torque inside turbine blades, which is then induced into electric power.',
      thesisAr: 'تحول السدود الكهرومائية طاقة الوضع الجاذبية للماء المخزن إلى عزم حركة ميكانيكي يدير التوربينات، ثم إلى تيار كهربائي عبر ملفات الحث الكهرومغناطيسي.',
      mathEn: 'Total potential fluid power scales linearly with discharge rate and height: P = eta * rho * g * Q * H.',
      mathAr: 'تتناسب طاقة الماء النظرية خطيًا مع الارتفاع ومعدل التدفق الحجمي الكلي: P = eta * rho * g * Q * H.',
      historyEn: 'The first commercial hydroelectric plant began operating on the Fox River in Appleton, Wisconsin, in 1882, proving Tesla\'s AC grid concepts.',
      historyAr: 'بدأت أول محطة تجارية لتوليد الكهرباء من المياه في نهر فوكس بـ ويسكونسن عام 1882، مبرهنة على كفاءة شبكات تسلا للتيار المتردد.',
      challengeEn: 'Reservoir sedimentation reduces water capacity over decades, necessitating extensive hydraulic dredging operations.',
      challengeAr: 'يقلل تراكم الطمي والرواسب داخل البحيرة القدرة الاستيعابية للماء عبر العقود، مما يتطلب عمليات تجريف هيدروليكية مكلفة.'
    },
    qAndA: [
      {
        question: 'How do dams store wind and solar energy like a battery?',
        answer: 'They use "Pumped Hydro Storage" to pump water backward up the mountain.',
        why: 'During sunny or windy days when solar panels produce excess electricity, operators run turbine motors backward to pump water up into the high reservoir, storing energy. When solar output drops at night, they open the gates to generate electricity.',
        example: 'Bath County Pumped Storage Station acts as a giant 3,000 Megawatt battery for Virginia\'s grid.',
        tryIt: { paramId: 'waterHead', value: 150, comment: 'Lifting the head height to 150 meters pushes penstock pressure to extreme levels.' }
      }
    ]
  },
  {
    id: 'jet-turbine',
    title: 'How Jet Engines Compress Air',
    category: 'Thermodynamics & Propulsion',
    summary: 'Learn how Brayton thermodynamic cycles intake, compress, ignite, and expand air-fuel mixtures to propel aircraft forward at supersonic speeds.',
    iconName: 'Plane',
    nodes: [
      { id: 'compressorStage', label: 'Multi-Stage Compressor', description: 'Dozens of spinning rotor blades that compress incoming air molecules up to 40 times atmospheric pressure.', x: 15, y: 50, type: 'process', statusLabel: 'Compressor Fan Rows' },
      { id: 'combustor', label: 'Fuel Ignition Combustor', description: 'Fuel nozzles spray kerosene mist into highly compressed air, ignited to expand gas temperatures up to 1700°C.', x: 50, y: 25, type: 'input', statusLabel: 'Combustion Chamber' },
      { id: 'exhaustTurbine', label: 'Power-Extracting Turbine', description: 'High-temperature gas expands across titanium blades, spinning the central shaft to keep the compressor running.', x: 50, y: 75, type: 'control', statusLabel: 'Turbine Exhaust Shaft' },
      { id: 'nozzleVent', label: 'Supersonic Thrust Nozzle', description: 'The narrowing rear exit pipe that accelerates expanding exhaust gases to supersonic speeds, generating forward Thrust.', x: 85, y: 50, type: 'output', statusLabel: 'Choked Exhaust Nozzle' }
    ],
    connections: [
      { fromId: 'compressorStage', toId: 'combustor', label: 'Compressed air flow', flowDirection: 'forward' },
      { fromId: 'combustor', toId: 'exhaustTurbine', label: 'Thermal expansion', flowDirection: 'forward' },
      { fromId: 'exhaustTurbine', toId: 'nozzleVent', label: 'Supersonic acceleration', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'compressRatio', label: 'Compression Ratio (Squeeze)', min: 10, max: 45, step: 5, defaultValue: 30, unit: 'x', description: 'How tightly incoming air is squeezed. Higher compression improves thermal efficiency but raises heat limits.' },
        { id: 'fuelRate', label: 'Fuel Injection Rate (Kerosene)', min: 5, max: 100, step: 5, defaultValue: 45, unit: 'L/s', description: 'The volume of aviation fuel burned. Higher fuel burns increase exhaust velocity and forward thrust.' }
      ],
      visualizerType: 'aerodynamics'
    },
    steps: [
      {
        title: 'Intake and Compressor Compression Stage',
        description: 'Air enters the front. Spinning fan blades squeeze the air molecules closer together, raising pressure, density, and temperature before fuel ignition.',
        highlightNodes: ['compressorStage']
      },
      {
        title: 'Isobaric Heat Injection (Combustion)',
        description: 'Inside the combustor, fuel is sprayed into the compressed air. A continuous flame ignites the mixture, causing the gases to expand violently.',
        highlightNodes: ['combustor']
      },
      {
        title: 'Turbine Power Extraction',
        description: 'The superheated gas rushes backward, hitting turbine blades. This spins the shaft, driving the front compressor blades in an endless mechanical feedback loop.',
        highlightNodes: ['exhaustTurbine']
      },
      {
        title: 'Nozzle Exhaust Acceleration (Thrust)',
        description: 'The hot, high-pressure gas is squeezed through a narrowing rear exhaust nozzle. This creates a rocket-like exhaust plume, generating massive forward thrust.',
        highlightNodes: ['nozzleVent']
      }
    ],
    realWorldApplications: [
      'Commercial Turbofans (General Electric GE90 powering Boeing 777 aircraft)',
      'Supersonic Military Jets (Pratt & Whitney F135 engines with vector-thrust nozzles)',
      'Stationary Power Plants (Generating electricity using industrial gas turbines)'
    ],
    theory: {
      titleEn: 'The Brayton Cycle and Jet Propulsion',
      titleAr: 'دورة برايتون والدفع النفاث الحراري',
      thesisEn: 'Gas turbines operate on the Brayton thermodynamic cycle, converting thermal heat expansion into kinetic gas velocity to produce forward mechanical thrust.',
      thesisAr: 'تعمل التوربينات الغازية على دورة برايتون الحرارية، محولة تمدد الغاز الناتج عن الحرارة لسرعة تدفق نفاث تولد دفعًا ميكانيكيًا للأمام.',
      mathEn: 'Thermal efficiency of the ideal Brayton cycle depends strictly on pressure ratio: efficiency = 1 - (1 / rp^((gamma-1)/gamma)).',
      mathAr: 'تعتمد الكفاءة الحرارية الكلية لدورة برايتون المثالية على نسبة ضغط الكبس: efficiency = 1 - (1 / rp^((gamma-1)/gamma)).',
      historyEn: 'Patented by John Barber in 1791, and co-developed for high-speed aviation by Sir Frank Whittle and Hans von Ohain in the 1930s.',
      historyAr: 'سجل براءتها جون باربر عام 1791، وطورها للطيران السير فرانك ويتل وهانس فون أوهين في الثلاثينيات بشكل مستقل.',
      challengeEn: 'Extremely high combustion heat exceeds metal melting points, requiring internal single-crystal blades with hollow cooling channels.',
      challengeAr: 'تتجاوز حرارة غرف الاحتراق نقطة انصهار المعادن، مما يستلزم تصنيع ريش بلورية أحادية تحوي ممرات تبريد داخلية مجوفة.'
    },
    qAndA: [
      {
        question: 'What is a "Turbofan" and why are they so quiet?',
        answer: 'They use a massive front fan to bypass cold air around the hot engine core.',
        why: 'Instead of pushing all air through the hot combustion core, a turbofan has a massive outer fan that pushes cold air along the sides. This cold air bypass blankets the roaring hot exhaust, muffling sound while drastically improving fuel efficiency.',
        example: 'Modern airliners bypass over 85% of air around the core, achieving exceptional efficiency.',
        tryIt: { paramId: 'compressRatio', value: 40, comment: 'Squeezing air 40x raises combustor efficiency to peak thermodynamic levels.' }
      }
    ]
  },
  {
    id: 'wind-turbine',
    title: 'How Wind Turbines Harvest Wind',
    category: 'Fluid Dynamics & Green Energy',
    summary: 'Discover how aerodynamic lift on massive rotor blades converts kinetic wind energy into slow-speed shaft torque, stepped up by gearboxes to spin electric generators.',
    iconName: 'Compass',
    nodes: [
      { id: 'rotorBlades', label: 'Aerodynamic Curved Blades', description: 'Giant aerodynamic carbon-fiber blades sculpted with an airfoil profile to generate Lift and rotational torque from passing wind.', x: 15, y: 50, type: 'process', statusLabel: 'Aerodynamic Rotor' },
      { id: 'gearbox', label: 'Speed-Multiplier Gearbox', description: 'A transmission gear assembly that steps up slow rotor rotations (15 RPM) to high speeds (1500 RPM) required by generators.', x: 50, y: 25, type: 'control', statusLabel: 'Gear Transmission' },
      { id: 'alternator', label: 'Electromagnetic Generator', description: 'Coils of copper wire rotating inside high-strength magnets, inducing Alternating Current via Faraday\'s law.', x: 50, y: 75, type: 'output', statusLabel: 'Induction Alternator' },
      { id: 'gridInverter', label: 'Power Grid Phase Inverter', description: 'Electronic converters that clean up erratic power frequencies, transforming them into a stable grid-synchronized frequency.', x: 85, y: 50, type: 'storage', statusLabel: 'Grid Inverter Link' }
    ],
    connections: [
      { fromId: 'rotorBlades', toId: 'gearbox', label: 'Low-speed torque', flowDirection: 'forward' },
      { fromId: 'gearbox', toId: 'alternator', label: 'High-speed shaft drive', flowDirection: 'forward' },
      { fromId: 'alternator', toId: 'gridInverter', label: 'Erratic power cleaning', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'windSpeed', label: 'Wind Velocity (Airflow Speed)', min: 3, max: 25, step: 1, defaultValue: 12, unit: 'm/s', description: 'Velocity of oncoming air molecules. Higher speeds exponentially increase kinetic energy harvest.' },
        { id: 'bladePitch', label: 'Rotor Blade Pitch Angle', min: -5, max: 90, step: 5, defaultValue: 10, unit: '°', description: 'The angle of the blades relative to the wind. Pivoting blades controls lift and prevents over-rotation.' }
      ],
      visualizerType: 'aerodynamics'
    },
    steps: [
      {
        title: 'Aerodynamic Lift Rotor Drive',
        description: 'Oncoming wind hits the curved blades. The airfoil shape creates high pressure on one side and low pressure on the other, creating Lift that rotates the hub.',
        highlightNodes: ['rotorBlades']
      },
      {
        title: 'Rotational Speed Multiplier',
        description: 'The giant blades rotate slowly (about 12-15 RPM). A mechanical gearbox steps up this slow rotational speed over 100 times, spinning the generator shaft at 1500 RPM.',
        highlightNodes: ['gearbox']
      },
      {
        title: 'Electromagnetic Power Induction',
        description: 'The rapid shaft spins magnets inside copper coils. Electrons are excited into motion, converting mechanical wind torque into Alternating Current electricity.',
        highlightNodes: ['alternator']
      },
      {
        title: 'Grid Frequency Synchronization',
        description: 'Since wind speed changes, the generated electricity has variable voltage and frequency. Electronic inverters convert it to stable, grid-matching frequencies.',
        highlightNodes: ['gridInverter']
      }
    ],
    realWorldApplications: [
      'Offshore Wind Farms (Giant turbines located in open seas capturing continuous wind currents)',
      'Direct-Drive Turbines (Ditching gearboxes to spin low-speed generators with high-pole counts)',
      'Home Micro-Wind Generators (Small-scale roof wind turbines providing off-grid farm power)'
    ],
    theory: {
      titleEn: 'Kinetic Wind Energy and Betz Limit',
      titleAr: 'طاقة الرياح الحركية وحد بيتز الفيزيائي',
      thesisEn: 'Wind turbines capture the kinetic energy of passing air currents using airfoil lift profiles, converting aerodynamic drag-offset torque into electricity.',
      thesisAr: 'تستخلص التوربينات طاقة حركة جزيئات الهواء العابرة باستخدام مقاطع رفع انسيابية، محولة عزم الحركة الدوار لتيار كهربائي مستحث.',
      mathEn: 'Theoretical power extracted is proportional to wind speed cubed: P = 0.5 * Cp * rho * A * v^3, where Cp <= 0.593.',
      mathAr: 'تتناسب الطاقة المستخلصة طرديًا مع مكعب سرعة الرياح: P = 0.5 * Cp * rho * A * v^3، حيث لا تتجاوز كفاءة الكبس 59.3٪.',
      historyEn: 'The first commercial wind turbine was built by Scottish academic James Blyth in July 1887 to power his holiday cottage.',
      historyAr: 'بنى الأكاديمي الإسكتلندي جيمس بليث أول توربين رياح لتوليد الكهرباء في يوليو عام 1887 لتغذية كوخه بالكهرباء.',
      challengeEn: 'Wind is intermittent; modern wind farms utilize electronic yaw drives and real-time blade pitch angles to optimize power outputs.',
      challengeAr: 'الرياح طاقة متقطعة؛ لذا تعتمد الساحات الحديثة على أنظمة محاذاة أفقية ومحركات ضبط ميل الريش تلقائيًا.'
    },
    qAndA: [
      {
        question: 'Why do wind turbines stop spinning when the wind is extremely fast?',
        answer: 'They feather the blades parallel to the wind to prevent mechanical destruction.',
        why: 'If winds exceed 25 m/s (55 mph), the aerodynamic forces can rip the blades apart. The computerized control system rotates the blades 90 degrees (feathering), so they slice through the wind without generating lift, safely stopping rotation.',
        example: 'Modern turbines lock completely during hurricanes to protect their gearboxes.',
        tryIt: { paramId: 'windSpeed', value: 15, comment: 'A steady 15 m/s wind generates maximum kinetic torque without exceeding structural limits.' }
      }
    ]
  },
  {
    id: 'steam-engine',
    title: 'How Steam Engines Work',
    category: 'Thermodynamics & Mechanics',
    summary: 'Trace the thermodynamic expansion of superheated high-pressure steam pushing reciprocating pistons inside double-acting slider cylinders to drive industrial machinery.',
    iconName: 'Compass',
    nodes: [
      { id: 'firebox', label: 'Coal-Burning Firebox', description: 'An combustion furnace burning coal or wood at extreme temperatures to supply intense thermal heat.', x: 15, y: 75, type: 'control', statusLabel: 'Combustion Furnace' },
      { id: 'boiler', label: 'Pressurized Water Boiler', description: 'A steel drum water vessel that absorbs firebox heat, boiling water to create hyper-compressed dry steam.', x: 50, y: 25, type: 'storage', statusLabel: 'Steam Boiler' },
      { id: 'slideValve', label: 'Directional Slide Valve', description: 'A sliding valve linked to the axle that directs fresh steam into alternating sides of the piston cylinder.', x: 50, y: 75, type: 'process', statusLabel: 'Distribution Valve' },
      { id: 'piston', label: 'Double-Acting Piston Shaft', description: 'The metal cylinder pushed back and forth by expanding steam, converting pressure into reciprocating linear work.', x: 85, y: 50, type: 'output', statusLabel: 'Reciprocating Piston' }
    ],
    connections: [
      { fromId: 'firebox', toId: 'boiler', label: 'Thermal conduction', flowDirection: 'forward' },
      { fromId: 'boiler', toId: 'slideValve', label: 'Compressed steam routing', flowDirection: 'forward' },
      { fromId: 'slideValve', toId: 'piston', label: 'Alternating expansion thrust', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'boilerHeat', label: 'Boiler Fire Temp (°C)', min: 100, max: 350, step: 25, defaultValue: 200, unit: '°C', description: 'Combustion temperature. Higher temperatures generate hyper-dense, highly compressed steam.' },
        { id: 'valveTiming', label: 'Valve Speed (Timing)', min: 1, max: 10, step: 1, defaultValue: 4, unit: 'Hz', description: 'Controls how fast the slide valve alternates ports. Matches wheel rotation speeds.' }
      ],
      visualizerType: 'nuclear-reactor'
    },
    steps: [
      {
        title: 'Thermal Combustion Phase',
        description: 'Coal burns in the firebox. The intense heat transfers across metal boiler tubes, heating the surrounding water to its boiling point.',
        highlightNodes: ['firebox']
      },
      {
        title: 'High-Pressure Steam Accumulation',
        description: 'As water boils inside the sealed boiler, it expands 1700 times in volume. Trapped with nowhere to go, steam pressure skyrockets, storing mechanical potential.',
        highlightNodes: ['boiler']
      },
      {
        title: 'Double-Acting Slide Valve Routing',
        description: 'Squeezed steam travels to the cylinder. The sliding valve opens port A, directing steam to the front of the piston while venting spent steam from the back.',
        highlightNodes: ['slideValve']
      },
      {
        title: 'Reciprocating Piston Mechanical Work',
        description: 'The expansion pushes the piston back, turning the wheel. As the wheel rotates, it shifts the slide valve, routing steam to port B. The piston is pushed forward, completing the loop.',
        highlightNodes: ['piston']
      }
    ],
    realWorldApplications: [
      'Steam Locomotives (19th-century railway engines driving mechanical linkages)',
      'Early Industrial Textile Mills (Powering hundreds of looms from a single central steam engine)',
      'Modern Nuclear & Coal Plants (Direct descendants using steam to spin massive turbine generators)'
    ],
    theory: {
      titleEn: 'The Rankine Cycle and Steam Mechanics',
      titleAr: 'دورة رانكين وتحويل الطاقة البخارية',
      thesisEn: 'Reciprocating steam engines utilize high-pressure steam expansion governed by the Rankine thermodynamic cycle to perform mechanical piston work.',
      thesisAr: 'تستغل المحركات البخارية التمدد الهائل لبخار الماء المكبوس تحت دورة رانكين لتوليد طاقة ميكانيكية تحرك المكابس المترددة.',
      mathEn: 'Mechanical work done per stroke is the integral of steam pressure across the cylinder volume: W = integral(P dV).',
      mathAr: 'الشغل الميكانيكي المبذول يساوي تكامل ضغط البخار المتمدد على طول إزاحة حجم الأسطوانة: W = integral(P dV).',
      historyEn: 'First developed by Thomas Newcomen in 1712, and radically modernized with a separate condenser by James Watt in 1769, launching the Industrial Revolution.',
      historyAr: 'اخترعه توماس نيوكومن عام 1712، وطوره جيمس واط بمكثف بخار مستقل عام 1769، مطلقًا الثورة الصناعية في أوروبا.',
      challengeEn: 'Boilers operate under extreme pressure, posing explosive rupture risks if safety pressure-release valves fail to operate.',
      challengeAr: 'تعمل الغلايات تحت ضغوط مدمرة، مما يعرضها للانفجار الكارثي إذا تعطلت صمامات تخفيف الضغط الميكانيكية.'
    },
    qAndA: [
      {
        question: 'Why did steam locomotives puff and emit white clouds of smoke?',
        answer: 'They released spent cylinder steam out of the chimney to draw fire air.',
        why: 'Instead of condensing water, locomotives vented spent steam directly up the chimney stack. This rapid jet blast of steam created a partial vacuum in the firebox, drawing fresh oxygen through the coal bed and causing the classic "choo-choo" puffing sound.',
        example: 'Venting steam creates a draft, making the coal burn hotter as the engine works harder.',
        tryIt: { paramId: 'boilerHeat', value: 250, comment: 'Increasing heat to 250°C creates high-pressure superheated steam for climbing hills.' }
      }
    ]
  },
  {
    id: 'regenerative-braking',
    title: 'How Regenerative Braking Works',
    category: 'Electromagnetism & Transit',
    summary: 'Deconstruct how electric vehicles slow down by reversing motor windings into generators, capturing kinetic momentum to recharge battery cells.',
    iconName: 'Zap',
    nodes: [
      { id: 'kineticWheel', label: 'Spinning Vehicle Wheels', description: 'The rotating wheels of the car, carrying massive amounts of kinetic energy and momentum.', x: 15, y: 50, type: 'input', statusLabel: 'Rotary Kinetic Energy' },
      { id: 'statorCoils', label: 'Alternator Stator Windings', description: 'Electromagnetic coils inside the motor that either spin the wheels or resist motion to induce electric currents.', x: 50, y: 75, type: 'process', statusLabel: 'Stator Field Induction' },
      { id: 'inverterController', label: 'Dual-Way Inverter Controller', description: 'Smart electronics that redirect the electrical current flow from the motor back into the battery during braking.', x: 50, y: 25, type: 'control', statusLabel: 'Dual-Way Inverter' },
      { id: 'batteryCells', label: 'High-Capacity Lithium Cells', description: 'Chemical battery cells that store the incoming recovered electrical energy for future acceleration.', x: 85, y: 50, type: 'storage', statusLabel: 'Recharged Cells' }
    ],
    connections: [
      { fromId: 'kineticWheel', toId: 'statorCoils', label: 'Kinetic torque reversal', flowDirection: 'forward' },
      { fromId: 'statorCoils', toId: 'inverterController', label: 'Induced electrical energy', flowDirection: 'forward' },
      { fromId: 'inverterController', toId: 'batteryCells', label: 'Battery charge stream', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'brakePressure', label: 'Brake Pedal Depression (%)', min: 10, max: 100, step: 10, defaultValue: 40, unit: '%', description: 'How hard you press the brake. Harder braking increases magnetic resistance, recovering more amps.' },
        { id: 'vehicleMomentum', label: 'Vehicle Speed (Momentum)', min: 10, max: 120, step: 10, defaultValue: 70, unit: 'km/h', description: 'Current travel velocity. High speeds hold immense kinetic energy available for recovery.' }
      ],
      visualizerType: 'electricity-home'
    },
    steps: [
      {
        title: 'Kinetic Energy Overload',
        description: 'Cruising down the highway, the heavy vehicle possesses massive kinetic energy. Pressing the brake initiates deceleration.',
        highlightNodes: ['kineticWheel']
      },
      {
        title: 'Electromagnetic Field Reversal',
        description: 'The engine stops sending power. Instead, the wheel rotation spins the rotor magnets inside the stator windings, reversing current vectors.',
        highlightNodes: ['statorCoils']
      },
      {
        title: 'Lenz\'s Opposing Magnetic Resistance',
        description: 'Generating electricity requires mechanical work. The induced current inside the coils generates a counter-magnetic field that fights wheel rotation, slowing down the car.',
        highlightNodes: ['statorCoils', 'kineticWheel']
      },
      {
        title: 'Inverter Redirection to Batteries',
        description: 'The recovered Alternating Current is rectified by the inverter into DC and directed into the lithium batteries, topping up the cells.',
        highlightNodes: ['inverterController', 'batteryCells']
      }
    ],
    realWorldApplications: [
      'Electric Cars (Tesla Model S recovering up to 80kW of power during deceleration)',
      'Subway Trains (Venting recovered brake energy back into the third-rail grid to power adjacent accelerating trains)',
      'Hybrid Formula 1 Cars (MGU-K systems capturing braking heat to boost engine horsepower)'
    ],
    theory: {
      titleEn: 'Electromagnetic Induction and Energy Recovery',
      titleAr: 'الكبح المتجدد وتوليد الطاقة العكسية',
      thesisEn: 'Regenerative braking systems utilize Faraday\'s law of induction to reverse electric traction motors, converting kinetic deceleration momentum into battery voltage.',
      thesisAr: 'يستغل الكبح المتجدد الحث الكهرومغناطيسي لتحويل طاقة حركة عجلات المركبة الكلية لتيار شحن كهربائي يعاكس ويلجم سرعة الدوران.',
      mathEn: 'Induced back electromotive force (EMF) is proportional to magnet speed: EMF = -N * (dPhi_B / dt).',
      mathAr: 'تتناسب القوة الدافعة الكهربائية العكسية المستحثة مع سرعة حركة المجال المغناطيسي: EMF = -N * (dPhi_B / dt).',
      historyEn: 'Early regenerative braking systems were deployed on London underground trolleybuses in the early 1900s to recover electricity.',
      historyAr: 'استخدمت أنظمة الكبح المتجدد الأولى في خطوط السكك الحديدية وحافلات الترام في لندن في أوائل القرن العشرين لتوفير الوقود.',
      challengeEn: 'Regenerative efficiency drops at low speeds as induced voltage falls below battery voltage, requiring mechanical friction backup.',
      challengeAr: 'تقل كفاءة الشحن عند السرعات البطيئة جدًا لأن الجهد المستحث يقل عن جهد البطارية، مما يستدعي تدخل مكابح الاحتكاك التقليدية.'
    },
    qAndA: [
      {
        question: 'Why do electric cars not use regenerative braking for emergency stops?',
        answer: 'Because magnetic resistance is limited and physical friction is required for instant locks.',
        why: 'Emergency stops require braking forces that exceed the electrical power capacity of the generator coils and inverter circuits. Forcing high amps would melt the copper wires. Traditional hydraulic brake pads must pinch the rotors to stop the car instantly.',
        example: 'Computers seamlessly blend regenerative braking with hydraulic brakes during emergencies.',
        tryIt: { paramId: 'brakePressure', value: 80, comment: 'Pressing the brakes 80% recaptures up to 60 Amps of current back into the lithium cells.' }
      }
    ]
  },
  {
    id: 'rocket-nozzle',
    title: 'How Rocket Nozzles Boost Thrust',
    category: 'Rocketry & Gas Dynamics',
    summary: 'Observe how high-pressure gas from liquid oxygen-kerosene combustion is accelerated through convergent-divergent de Laval nozzles to reach supersonic speeds.',
    iconName: 'Compass',
    nodes: [
      { id: 'combustChamber', label: 'Gas Combustion Chamber', description: 'The heavy steel dome where liquid propellants ignite, producing high-temperature, high-pressure subsonic gas molecules.', x: 15, y: 50, type: 'storage', statusLabel: 'High-Pressure Chamber' },
      { id: 'nozzleThroat', label: 'Convergent Nozzle Throat', description: 'The narrowest section of the nozzle where subsonic gas is accelerated to exactly Mach 1 (speed of sound).', x: 50, y: 25, type: 'process', statusLabel: 'Choked Throat (Mach 1)' },
      { id: 'divergentBell', label: 'Divergent Expansion Bell', description: 'The expanding cone where gas molecules are allowed to spread out, accelerating them to extreme supersonic speeds.', x: 50, y: 75, type: 'process', statusLabel: 'Expansion Bell' },
      { id: 'exhaustPlume', label: 'Supersonic Gas Exhaust', description: 'The exit gas plume blasting outward at up to 4.5 km/s, generating massive action-reaction thrust.', x: 85, y: 50, type: 'output', statusLabel: 'Supersonic Exhaust' }
    ],
    connections: [
      { fromId: 'combustChamber', toId: 'nozzleThroat', label: 'Subsonic constriction', flowDirection: 'forward' },
      { fromId: 'nozzleThroat', toId: 'divergentBell', label: 'Supersonic expansion', flowDirection: 'forward' },
      { fromId: 'divergentBell', toId: 'exhaustPlume', label: 'Action-reaction thrust', flowDirection: 'forward' }
    ],
    simulation: {
      params: [
        { id: 'combustPressure', label: 'Chamber Pressure (Bar)', min: 10, max: 250, step: 10, defaultValue: 100, unit: 'bar', description: 'Pressure inside combustion chamber. Higher pressures result in faster exhaust velocities.' },
        { id: 'expansionRatio', label: 'Nozzle Area Expansion Ratio', min: 10, max: 150, step: 10, defaultValue: 80, unit: 'Ae/At', description: 'Ratio of exit area to throat area. Higher ratios are ideal for vacuum space flight.' }
      ],
      visualizerType: 'aerodynamics'
    },
    steps: [
      {
        title: 'Chemical Energy Release',
        description: 'Liquid fuel (like kerosene) and oxidizer (liquid oxygen) are pumped into the chamber. They combust violently, creating superheated high-pressure gas molecules moving slowly.',
        highlightNodes: ['combustChamber']
      },
      {
        title: 'Sonic Choking at the Throat',
        description: 'The hot gases escape through the narrowing neck. As the path constricts, gas velocity spikes. At the narrowest point (the throat), the gas is choked at exactly Mach 1.',
        highlightNodes: ['nozzleThroat']
      },
      {
        title: 'Supersonic Expansion Conversion',
        description: 'Past the throat, the nozzle flares open. Because the gas is already supersonic, flaring the nozzle open allows it to expand rapidly, converting heat and pressure into kinetic velocity.',
        highlightNodes: ['divergentBell']
      },
      {
        title: 'Action-Reaction Momentum (Thrust)',
        description: 'Exhaust gas blasts out the exit at Mach 3 to 4. By Newton\'s third law of motion, the momentum of the outward-flying gas creates an equal and opposite force pushing the rocket up.',
        highlightNodes: ['exhaustPlume']
      }
    ],
    realWorldApplications: [
      'SpaceX Merlin 1D Engine (Powering Falcon 9 boosters with liquid oxygen and kerosene)',
      'NASA Space Shuttle RS-25 (High-efficiency engines burning liquid hydrogen and oxygen)',
      'Rocket Lab Rutherford (Electric-pump fed engines optimized for small satellite launches)'
    ],
    theory: {
      titleEn: 'Gas Dynamics and de Laval Rocket Nozzles',
      titleAr: 'ديناميكا الغازات وفوهات دي لافال الصاروخية',
      thesisEn: 'Convergent-divergent de Laval nozzles accelerate subsonic combustion gas to extreme supersonic speeds by choking flow at the minimum area throat.',
      thesisAr: 'تعمل فوهات "دي لافال" المتقاربة-المتباعدة على تسريع غاز الاحتراق من سرعة دون الصوت إلى سرعة فوق الصوت بخنق التدفق عند العنق.',
      mathEn: 'Exhaust velocity depends on chamber temperature and propellant molecular weight: ve = sqrt((2*k)/(k-1) * (R * Tc)/M * (1 - (Pe/Pc)^((k-1)/k))).',
      mathAr: 'تُحسب سرعة نفث الغازات اعتمادًا على درجة حرارة الاحتراق والوزن الجزيئي للوقود: ve = sqrt((2*k)/(k-1) * (R * Tc)/M * (1 - (Pe/Pc)^((k-1)/k))).',
      historyEn: 'Invented by Swedish engineer Gustaf de Laval in 1888 for steam turbines, and adapted for liquid rocketry by space pioneer Robert Goddard in 1915.',
      historyAr: 'اخترعها المهندس السويدي غوستاف دي لافال عام 1888 للتربينات، واستخدمها روبرت غودارد لصواريخ الفضاء عام 1915.',
      challengeEn: 'Over-expanded nozzles create shock diamonds under sea-level air pressure, which can cause flow separation and engine damage.',
      challengeAr: 'تسبب الفوهات مفرطة التمدد ظهور "أشكال الماس الصدمية" تحت الضغط الجوي، مما يهدد استقرار جرس الصاروخ.'
    },
    qAndA: [
      {
        question: 'Why are vacuum rocket nozzles so much larger than sea-level nozzles?',
        answer: 'They need extremely high expansion bells to capture expanding gases in vacuum.',
        why: 'In the vacuum of space, atmospheric pressure is zero. To extract maximum thrust, the exhaust gas must expand until its pressure drops close to zero. This requires massive, flared expansion bells. At sea-level, such a large nozzle would fail because atmospheric air would push inside, collapsing the exhaust flow.',
        example: 'The SpaceX vacuum engine has an expansion bell over 5 times wider than its sea-level equivalent.',
        tryIt: { paramId: 'combustPressure', value: 180, comment: 'Pumping chamber pressure to 180 bar drives exhaust speed to supersonic levels.' }
      }
    ]
  }
];
