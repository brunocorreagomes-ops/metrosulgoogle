export type Language = "en" | "pt" | "es";

export interface TranslationSchema {
  // Boot sequence
  bootSeq: string[];
  
  // Navigation & Header
  navReleases: string;
  navSynth: string;
  navManifesto: string;
  navInquiries: string;
  audioOn: string;
  muted: string;
  sysOnline: string;

  // Hero
  vectorActive: string;
  themeLabel: string;
  heroSub: string;
  heroDesc: string;
  btnReleases: string;
  btnSynth: string;
  
  // Dashboard Info Box
  flowLabel: string;
  flowValue: string;
  scaleLabel: string;
  scaleValue: string;
  gravityLabel: string;
  gravityValue: string;
  portalsLabel: string;
  portalsValue: string;
  scrollDown: string;

  // Releases
  vaultLabel: string;
  vaultTitle: string;
  vaultDesc: string;

  // Synthesizer
  synthLabel: string;
  synthTitle: string;
  synthDesc: string;

  // About/Manifesto Section
  aboutHeading: string;
  aboutUnderground: string;
  signalLabel: string;
  signalDesc: string;
  destabilizeBtn: string;
  resetBtn: string;
  scrambleGuide: string;
  specsLabel: string;
  specsTitle: string;
  specsSubtitle: string;
  
  // Specs Items
  specCoreLab: string;
  specCoreVal: string;
  specMastLab: string;
  specMastVal: string;
  specTempLab: string;
  specTempVal: string;
  specSpaceLab: string;
  specSpaceVal: string;
  specVocLab: string;
  specVocVal: string;
  specVisLab: string;
  specVisVal: string;

  // Bio Paragraphs (split to easily wrap scrambler words)
  bioPart1: string;
  bioPart2: string;
  bioPart3: string;
  bioPart4: string;
  bioPart5: string;
  bioPart6: string;
  bioPart7: string;
  bioPart8: string;
  bioPart9: string;
  bioPart10: string;
  bioPart11: string;
  bioPart12: string;

  // Contact Section
  contactLabel: string;
  contactTitle: string;
  contactDesc: string;

  // New keys for complete translation
  albumBeyondConcept: string;
  albumBeyondDesc: string;
  albumBeyondAtmosphere: string;
  albumVoltaConcept: string;
  albumVoltaDesc: string;
  albumVoltaAtmosphere: string;
  albumVoltaCoreTheme: string;
  albumBeyondCoreTheme: string;
  embedConceptNarrative: string;
  embedReleaseSeq: string;
  embedPlayerLabel: string;
  embedOpenSpotify: string;
  embedSynced: string;

  nodeSubPulseTitle: string;
  nodeSubPulseDesc: string;
  nodeChronosTitle: string;
  nodeChronosDesc: string;
  nodeKairosTitle: string;
  nodeKairosDesc: string;
  nodeVoltageTitle: string;
  nodeVoltageDesc: string;
  nodeBiolumTitle: string;
  nodeBiolumDesc: string;
  nodeHorizonTitle: string;
  nodeHorizonDesc: string;

  presetPressureTitle: string;
  presetPressureDesc: string;
  presetBeyondTitle: string;
  presetBeyondDesc: string;
  presetKairosTitle: string;
  presetKairosDesc: string;
  presetVelvetTitle: string;
  presetVelvetDesc: string;
  presetTransitTitle: string;
  presetTransitDesc: string;

  synthTerminalLabel: string;
  synthMainTitle: string;
  synthTabPads: string;
  synthTabSeq: string;
  synthPadsDesc: string;
  synthSeqDesc: string;
  synthOverridesLabel: string;
  synthStopBtn: string;
  synthStartBtn: string;
  synthClearBtn: string;
  synthActivePulseLabel: string;
  synthPatchControls: string;
  synthMasterLevel: string;
  synthFilterCutoff: string;
  synthResonance: string;
  synthEchoFeedback: string;
  synthLfoSpeed: string;
  synthPhysNote: string;

  contactCardLabel: string;
  contactCardTitle: string;
  contactCardDesc: string;
  contactCardCopy: string;
  contactCardCopied: string;

  // Footer & Help Systems
  footerCredits: string;
  hotkeysBtn: string;
  modalTerminal: string;
  modalTitle: string;
  modalDesc: string;
  modalLogStatus: string;
  modalLogVersion: string;
  
  // Upcoming Release - Architect of Overflow
  upcomingLabel: string;
  upcomingTitle: string;
  upcomingDesc: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    bootSeq: [
      "METRO SUL SYSTEM CHASSIS V0.8B ONLINE",
      "INITIALIZING EURORACK SEMI-MODULAR BUS...",
      "CALIBRATING QUANTUM GRAVITY PARTICLES...",
      "GENERATING SPATIAL ACOUSTIC FREQUENCIES...",
      "ESTABLISHING CLOUD RUN CORE MEMORY INTERFACES...",
      "SIGNAL STEREOPHONIC COUPLING SECURED."
    ],
    navReleases: "LATEST",
    navSynth: "SIGNALS",
    navManifesto: "ARCHIVE",
    navInquiries: "CONTACT",
    audioOn: "AUDIO ON",
    muted: "MUTED",
    sysOnline: "SYS_ONLINE",
    vectorActive: "SOUND VECTORING ACTIVE",
    themeLabel: "THEME",
    heroSub: "FREQUENCY BECOMES FORM",
    heroDesc: "Electronic music designed for conscious creation, abundance, and transit.",
    btnReleases: "LISTEN ON SPOTIFY",
    btnSynth: "EXPLORE RELEASES",
    flowLabel: "AUDIO SIGNAL FLOW",
    flowValue: "PROCEDURAL SYNTH",
    scaleLabel: "DYNAMIC SCALE",
    scaleValue: "C-MINOR PENTATONIC",
    gravityLabel: "KINETIC GRAVITY",
    gravityValue: "WARPING G-CELLS",
    portalsLabel: "ARTIST PORTALS",
    portalsValue: "SPOTIFY VERIFIED",
    scrollDown: "SCROLL TO SYSTEM INGRESS",
    vaultLabel: "EARLIER CYCLES",
    vaultTitle: "Archive Transmissions",
    vaultDesc: "Explore previous frequencies and cyclic releases in the Metro Sul timeline.",
    synthLabel: "INTERACTIVE SIGNAL CONSOLE",
    synthTitle: "Frequency Modulation",
    synthDesc: "Generate sequences live. Shape waveforms and alter low-pass filters in real-time.",
    aboutHeading: "AESTHETIC DEVIATION MANIFESTO",
    aboutUnderground: "Electronic architectures for conscious expansion.",
    signalLabel: "CYBERNETIC COUPLING SIGNAL",
    signalDesc: "Interact with modular matrices. Destabilize core clock oscillations to scatter aesthetic values.",
    destabilizeBtn: "DESTABILIZE WAVEFORM",
    resetBtn: "RE-ANCHOR SIGNAL",
    scrambleGuide: "*Interactive: Hover or click words in the bio panel to manifest manual decryption glitches.",
    specsLabel: "INTELLIGENT WAVE SPECIFICATIONS",
    specsTitle: "System Matrix Coords",
    specsSubtitle: "Real-time hardware parameters and calibration rules compliant with raw studio standards.",
    specCoreLab: "Core Synthesis",
    specCoreVal: "Eurorack Semi-Modular Loops",
    specMastLab: "Mastering Level",
    specMastVal: "Dynamic -14 LUFS Clean Analog Desk",
    specTempLab: "Temporal Tempo",
    specTempVal: "125 BPM — 138 BPM Modular Shifts",
    specSpaceLab: "Space Modulators",
    specSpaceVal: "Binaural Stereo Delay (Chronos Loop)",
    specVocLab: "Vocal Sub-layers",
    specVocVal: "Laser-Processed Formants & Noise",
    specVisLab: "Visual Identity",
    specVisVal: "Bioluminescent Dark Cybernetics",
    bioPart1: "is an experimental electronic music project exploring the space where",
    bioPart2: "human intuition",
    bioPart3: "meets",
    bioPart4: "mechanical algorithms",
    bioPart5: ". Fusing deep",
    bioPart6: "modular techno",
    bioPart7: ", hypnotic",
    bioPart8: "sub-bass frequencies",
    bioPart9: ", and spatial design, the project bridges",
    bioPart10: "digital precision",
    bioPart11: "with raw",
    bioPart12: "analog warmth. The sound is rooted in minimalist dark aesthetics and highly immersive acoustics, prioritizing progressive loops over radio hooks. Each pattern is a study of contrast: weightless atmospheric drift, machine tension, and the flow of rhythmic time. By combining interactive web tech with analog synthesis, Metro Sul creates an immersive audio-visual canvas where sounds are warped, filtered, and sculpted live.",
    contactLabel: "DIGITAL SPECTRUM CONTACTS",
    contactTitle: "Network Terminals",
    contactDesc: "Follow tour schedules, studio updates, and project inquiries. Find Metro Sul on all networks at @metrosulofficial.",

    albumBeyondConcept: "Hyper-resonance & Gravity Warps",
    albumBeyondDesc: "An evolutionary leap in deep techno landscapes. 'Beyond Gravity' represents an exploration of modular systems shifting through weightlessness. Fusing organic bioluminescent soundscapes with high-pressure cybernetic bass lines.",
    albumBeyondAtmosphere: "Atmospheric, Ethereal, Heavy Low-Ends",
    albumVoltaConcept: "Temporal Duality: Chronos vs. Kairos",
    albumVoltaDesc: "A conceptual masterpiece reflecting the 24-hour cycle of urban time. 'VOLTA' explores the mechanical force of linear schedules (Chronos) versus the opportune, suspended fluid moments on the dance floor (Kairos) — transforming transit, anxiety, workday deadlines, and nightly decompression into modular motion.",
    albumVoltaAtmosphere: "Fast-paced, Relentless, Cinematic Melodics",
    albumVoltaCoreTheme: "TEMPORAL WARP",
    albumBeyondCoreTheme: "BIOLUMINESCENT TECH",
    embedConceptNarrative: "CONCEPT & NARRATIVE",
    embedReleaseSeq: "RELEASE SEQUENCE",
    embedPlayerLabel: "OFFICIAL SPOTIFY PLAYER",
    embedOpenSpotify: "Open in Spotify",
    embedSynced: "SPOTIFY SYNCED",

    nodeSubPulseTitle: "Gravity Sub-Pulse",
    nodeSubPulseDesc: "Sub-harmonic gravity wave designed for physical low-ends.",
    nodeChronosTitle: "Chronos Portal Synth",
    nodeChronosDesc: "Aggressive time-warped saw sweep with resonant bandpass feedback.",
    nodeKairosTitle: "Kairos Organic Echo",
    nodeKairosDesc: "Serene atmospheric pad with massive depth and dynamic delay.",
    nodeVoltageTitle: "Voltage Solar Lead",
    nodeVoltageDesc: "Cybernetic high-voltage melody pulse simulating modular patch wiring.",
    nodeBiolumTitle: "Bioluminescent Sine",
    nodeBiolumDesc: "Crystalline resonant chime referencing organic digital forest sounds.",
    nodeHorizonTitle: "Horizon Resonance Sweep",
    nodeHorizonDesc: "Dense panoramic pad frequency exploring space-horizon borders.",

    presetPressureTitle: "Pressure",
    presetPressureDesc: "Industrial driving modular techno style. Active resonant sweeps, fast low-pass decay, and heavy sub pulses.",
    presetBeyondTitle: "Beyond Gravity",
    presetBeyondDesc: "Floating interstellar ambient drift. Open relaxed feedback delays, crystalline sub harmonics, and slow waves.",
    presetKairosTitle: "Kairos Dream",
    presetKairosDesc: "Suspended, spacious time travel chords. Gorgeous echoing resonant waves with spatial delay loops.",
    presetVelvetTitle: "Velvet Groove",
    presetVelvetDesc: "Seductive late-night house. Deep syncopated tech-grooves and warm analog warmth oscillations.",
    presetTransitTitle: "Transit Velocity",
    presetTransitDesc: "Rapid mechanical network acceleration. Extremely fast clock rate triggers and high resonance accents.",

    synthTerminalLabel: "VOLTAGE TERMINAL 0.8B",
    synthMainTitle: "Metro Sul Interactive Synth",
    synthTabPads: "Modular Pads",
    synthTabSeq: "Orbit Sequencer",
    synthPadsDesc: "Unlock real wave modulations. Click or tap nodes below to sequence high-resonant sub frequencies and ambient chords live.",
    synthSeqDesc: "Orbit Step-Matrix Sequencer. Program custom triggers on the node grid below or fire up pre-programmed sound system beats preset for Metro Sul releases.",
    synthOverridesLabel: "FREQUENCY ALIGNMENT PRESETS",
    synthStopBtn: "STOP ACTIVE",
    synthStartBtn: "START SEQUENCE",
    synthClearBtn: "Clear Matrix",
    synthActivePulseLabel: "Active Pulse:",
    synthPatchControls: "PATCH CONTROLS",
    synthMasterLevel: "Master Level",
    synthFilterCutoff: "Filter Cutoff",
    synthResonance: "Resonance (Q)",
    synthEchoFeedback: "Echo Feedback",
    synthLfoSpeed: "LFO Speed",
    synthPhysNote: "Real-time calculations construct voltage paths without pre-recorded samples. Dynamic adjustments immediately reshape audio textures.",

    contactCardLabel: "INQUIRIES_AND_GIGS // SECURE_COMMS",
    contactCardTitle: "Establish Direct Signal",
    contactCardDesc: "This is the official contact channel for the music project. For ownership verification, digital platforms, Spotify, licensing, partnerships, or catalog-related inquiries, please use the email below.",
    contactCardCopy: "COPY EMAIL",
    contactCardCopied: "COPIED",

    footerCredits: "CODING PATTERNS COMPLIANT WITH COGNITIVE MINIMALISM.",
    hotkeysBtn: "SYSTEM HOTKEYS",
    modalTerminal: "COGNITIVE TELEMETRY TERMINAL",
    modalTitle: "Quantum Navigation Vectors",
    modalDesc: "Metro Sul represents an interactive modular machine. Use your hardware keyboard to instantly teleport across the system coords:",
    modalLogStatus: "SYS LOGS: OK",
    modalLogVersion: "METRO SUL VER_0.8B",
    upcomingLabel: "NEW SIGNAL PHASE",
    upcomingTitle: "Architect of Overflow",
    upcomingDesc: "Architect of Overflow opens a new phase for Metro Sul — a frequency-driven electronic release about abundance, manifestation, alignment and conscious creation."
  },
  pt: {
    bootSeq: [
      "CHASSI DE SISTEMA METRO SUL V0.8B ONLINE",
      "INICIALIZANDO BARRAMENTO SEMI-MODULAR EURORACK...",
      "CALIBRANDO PARTÍCULAS DE GRAVIDADE QUÂNTICA...",
      "GERANDO FREQUÊNCIAS ACÚSTICAS ESPACIAIS...",
      "ESTABELECENDO INTERFACES CLOUD RUN DE MEMÓRIA...",
      "SINAL DE ACOPLAMENTO ESTEREÓFÔNICO SEGURO."
    ],
    navReleases: "LATEST",
    navSynth: "SIGNALS",
    navManifesto: "ARCHIVE",
    navInquiries: "CONTACT",
    audioOn: "ÁUDIO LIGADO",
    muted: "MUDO",
    sysOnline: "SISTEMA_ONLINE",
    vectorActive: "VETORIZAÇÃO DE SOM ATIVA",
    themeLabel: "TEMA",
    heroSub: "FREQUENCY BECOMES FORM",
    heroDesc: "Música eletrônica desenhada para criação consciente, abundância e trânsito.",
    btnReleases: "OUVIR NO SPOTIFY",
    btnSynth: "EXPLORAR LANÇAMENTOS",
    flowLabel: "FLUXO DE SINAL DE ÁUDIO",
    flowValue: "SINTETIZADOR PROCEDURAL",
    scaleLabel: "ESCALA DINÂMICA",
    scaleValue: "PENTATÔNICA C-MENOR",
    gravityLabel: "GRAVIDADE CINÉTICA",
    gravityValue: "DEFORMAÇÃO DE CÉLULAS-G",
    portalsLabel: "PORTAIS DE ARTISTA",
    portalsValue: "SPOTIFY VERIFICADO",
    scrollDown: "ROLAR PARA INGRESSO NO SISTEMA",
    vaultLabel: "CICLOS ANTERIORES",
    vaultTitle: "Transmissões de Arquivo",
    vaultDesc: "Explore frequências anteriores e lançamentos cíclicos na linha do tempo Metro Sul.",
    synthLabel: "CONSOLE DE SINAL INTERATIVO",
    synthTitle: "Modulação de Frequência",
    synthDesc: "Gere sequências ao vivo. Molde ondas e altere filtros em tempo real.",
    aboutHeading: "MANIFESTO DE DESVIO ESTÉTICO",
    aboutUnderground: "Frequência transformada em movimento.",
    signalLabel: "SINAL DE ACOPLAMENTO CIBERNÉTICO",
    signalDesc: "Interaja com matrizes modulares. Desestabilize as oscilações do relógio principal para dispersar os valores estéticos.",
    destabilizeBtn: "DESESTABILIZAR FORMA DE ONDA",
    resetBtn: "RE-ACOPLAR SINAL",
    scrambleGuide: "*Interativo: Passe o mouse ou clique nas palavras do painel de bio para manifestar falhas manuais de descriptografia.",
    specsLabel: "ESPECIFICAÇÕES DE ONDA INTELIGENTE",
    specsTitle: "Coordenadas da Matriz do Sistema",
    specsSubtitle: "Parâmetros de hardware em tempo real e regras de calibração em conformidade com padrões de estúdio puros.",
    specCoreLab: "Síntese Principal",
    specCoreVal: "Loops Semi-Modulares Eurorack",
    specMastLab: "Nível de Masterização",
    specMastVal: "Dinâmico -14 LUFS Clean Mesa Analógica",
    specTempLab: "Tempo Temporal",
    specTempVal: "Oscilações Modulares 125 BPM — 138 BPM",
    specSpaceLab: "Moduladores Espaciais",
    specSpaceVal: "Delay Estéreo Binaural (Chronos Loop)",
    specVocLab: "Subcamadas Vocais",
    specVocVal: "Formantes e Ruído Processados a Laser",
    specVisLab: "Identidade Visual",
    specVisVal: "Cibernética Dark Bioluminescente",
    bioPart1: "é um projeto de música eletrônica experimental que explora o espaço onde a",
    bioPart2: "intuição humana",
    bioPart3: "se encontra com os",
    bioPart4: "algoritmos mecânicos",
    bioPart5: ". Mesclando",
    bioPart6: "techno modular",
    bioPart7: "profundo, frequências hipnóticas de",
    bioPart8: "sub-graves",
    bioPart9: "e design espacial, o projeto estabelece uma ponte entre a",
    bioPart10: "precisão digital",
    bioPart11: "e o puro",
    bioPart12: "calor analógico. O som está enraizado em uma estética dark minimalista e acústica imersiva, priorizando ciclos progressivos em vez de ganchos comerciais de rádio. Cada padrão estuda contrastes: flutuações atmosféricas sem peso, tensões de máquinas e a passagem do tempo rítmico. Ao cruzar tecnologias interativas com síntese analógica, Metro Sul cria um plano audiovisual imersivo onde os tons são filtrados, esculpidos e alterados ao vivo.",
    contactLabel: "CONTATOS DO ESPECTRO DIGITAL",
    contactTitle: "Terminais de Rede",
    contactDesc: "Siga agendas de turnês, atualizações de estúdio e consultas do projeto. Encontre o Metro Sul em todas as redes em @metrosulofficial.",

    albumBeyondConcept: "Hiperressonância e Distorção Gravitacional",
    albumBeyondDesc: "Um salto evolutivo pelas frequências do deep techno. 'Beyond Gravity' representa uma exploração de sistemas modulares se deslocando sob gravidade zero, fundindo texturas bio-escuras e bioluminescentes com batidas e graves potentes de alta pressão.",
    albumBeyondAtmosphere: "Atmosférico, Etéreo, Graves Profundos e Sub-pulsos",
    albumVoltaConcept: "Dualidade Temporal: Chronos vs. Kairos",
    albumVoltaDesc: "Uma obra de arte conceitual que reflete o ciclo de 24 horas do tempo urbano. 'VOLTA' explora a força mecânica dos cronogramas lineares (Chronos) contra os momentos fluidos e suspensos da pista de dança (Kairos) — transformando trânsito, ansiedade, prazos de trabalho e descompressão noturna em movimento modular.",
    albumVoltaAtmosphere: "Frenético, Implacável, Melodias Cinemáticas",
    albumVoltaCoreTheme: "DOBRA TEMPORAL",
    albumBeyondCoreTheme: "CIBERNÉTICA BIOLUMINESCENTE",
    embedConceptNarrative: "CONCEITO E NARRATIVA",
    embedReleaseSeq: "SEQUÊNCIA DE FAIXAS",
    embedPlayerLabel: "PLAYER OFICIAL SPOTIFY",
    embedOpenSpotify: "Ouvir no Spotify",
    embedSynced: "SPOTIFY CONECTADO",

    nodeSubPulseTitle: "Sub-pulso de Gravidade",
    nodeSubPulseDesc: "Onda senoidal sub-harmônica projetada para sensações de oscilação física de baixa frequência.",
    nodeChronosTitle: "Sintetizador Portal Chronos",
    nodeChronosDesc: "Varredura dente-de-serra agressiva com modulação temporal de tempo e feedback ressonante.",
    nodeKairosTitle: "Eco Orgânico Kairos",
    nodeKairosDesc: "Textura atmosférica serena com atrasos dinâmicos espaciais e rítmicos de eco.",
    nodeVoltageTitle: "Lead Solar de Voltagem",
    nodeVoltageDesc: "Pulso melódico de alta voltagem que simula conexões analógicas típicas de rack modular.",
    nodeBiolumTitle: "Senoide Bioluminescente",
    nodeBiolumDesc: "Sinos e harmônicos agudos e cristalinos inspirados na tranquilidade de florestas digitais.",
    nodeHorizonTitle: "Varredura de Ressonância do Horizonte",
    nodeHorizonDesc: "Frequência panorâmica densa que descreve os limites das ondas no espaço.",

    presetPressureTitle: "Pressão",
    presetPressureDesc: "Estilo modular techno industrial pulsante. Varreduras ressonantes ativas, decaimento rápido de passa-baixas e subpulsos pesados.",
    presetBeyondTitle: "Além da Gravidade",
    presetBeyondDesc: "Flutuação interestelar e deriva de ambiente. Delays com feedback aberto e relaxado, sub-harmônicos cristalinos e ondas lentas.",
    presetKairosTitle: "Sonho de Kairos",
    presetKairosDesc: "Acordes suspensos com sensação de viagem no tempo. Belas ondas ressonantes com eco e loops de delay espacial.",
    presetVelvetTitle: "Groove de Veludo",
    presetVelvetDesc: "House sedutor de fim de noite. Tech-grooves profundos e sincopados com oscilações quentes analógicas.",
    presetTransitTitle: "Velocidade de Trânsito",
    presetTransitDesc: "Aceleração mecânica rápida de rede. Triggers de clock extremamente rápidos e acentos de alta ressonância.",

    synthTerminalLabel: "TERMINAL DE VOLTAGEM 0.8B",
    synthMainTitle: "Sintetizador Interativo Metro Sul",
    synthTabPads: "Teclado Modular",
    synthTabSeq: "Sequenciador Órbita",
    synthPadsDesc: "Libere modulações de ondas sonoras em tempo real. Toque nos nós para acionar subfrequências potentes e texturas ambientais.",
    synthSeqDesc: "Sequenciador Órbita Step-Matrix. Programe gatilhos rítmicos na grade ou use bases pré-configuradas inspiradas nos lançamentos da Metro Sul.",
    synthOverridesLabel: "ALINHAMENTOS DE FREQUÊNCIA",
    synthStopBtn: "PARAR SEQUÊNCIADOR",
    synthStartBtn: "ATIVAR SEQUÊNCIA",
    synthClearBtn: "Limpar Grade",
    synthActivePulseLabel: "Pulso Ativo:",
    synthPatchControls: "CONTROLES DE SINAL",
    synthMasterLevel: "Volume Geral",
    synthFilterCutoff: "Corte do Filtro",
    synthResonance: "Ressonância do Filtro (Q)",
    synthEchoFeedback: "Feedback de Echo",
    synthLfoSpeed: "Velocidade do LFO",
    synthPhysNote: "Os caminhos de voltagem são gerados em tempo real através de síntese matemática pura, sem amostras pré-gravadas.",

    contactCardLabel: "ORÇAMENTOS_E_SHOWS // CANAL_SEGURO",
    contactCardTitle: "Contato & Gigs",
    contactCardDesc: "Este é o canal oficial de contato do projeto musical. Para verificação de propriedade, plataformas digitais, Spotify, licenciamento, parcerias ou assuntos relacionados ao catálogo, utilize o e-mail abaixo.",
    contactCardCopy: "COPIAR E-MAIL",
    contactCardCopied: "COPIADO",

    footerCredits: "PADRÕES DE CÓDIGO COMPATÍVEIS COM MINIMALISMO COGNITIVO.",
    hotkeysBtn: "ATALHOS DE SISTEMA",
    modalTerminal: "TERMINAL DE TELEMETRIA COGNITIVA",
    modalTitle: "Vetores de Navegação Quântica",
    modalDesc: "Metro Sul representa uma máquina modular interativa. Use seu teclado físico para se teletransportar instantaneamente pelas coordenadas do sistema:",
    modalLogStatus: "LABS_SYS: OK",
    modalLogVersion: "METRO SUL VERSÃO_0.8B",
    upcomingLabel: "NOVA FASE DE SINAL",
    upcomingTitle: "Architect of Overflow",
    upcomingDesc: "Architect of Overflow inaugura uma nova fase para Metro Sul — um lançamento eletrônico guiado por frequência sobre abundância, manifestação, alinhamento e criação consciente."
  },
  es: {
    bootSeq: [
      "CHASIS DE SISTEMA METRO SUL V0.8B ONLINE",
      "INICIALIZANDO BUS SEMIMODULAR EURORACK...",
      "CALIBRANDO PARTÍCULAS DE GRAVEDAD CUÁNTICA...",
      "GENERANDO FRECUENCIAS ACÚSTICAS ESPACIALES...",
      "ESTABLECIENDO INTERFACES CLOUD RUN DE MEMORIA...",
      "SEÑAL DE ACOPLAMIENTO ESTEREOFÓNICO COMPLETA."
    ],
    navReleases: "LATEST",
    navSynth: "SIGNALS",
    navManifesto: "ARCHIVE",
    navInquiries: "CONTACT",
    audioOn: "AUDIO ACTIVADO",
    muted: "SILENCIADO",
    sysOnline: "SISTEMA_ONLINE",
    vectorActive: "VECTORIZACIÓN DE SONIDO ACTIVA",
    themeLabel: "TEMA",
    heroSub: "FREQUENCY BECOMES FORM",
    heroDesc: "Música electrónica diseñada para la creación consciente, la abundancia y el tránsito.",
    btnReleases: "ESCUCHAR EN SPOTIFY",
    btnSynth: "EXPLORAR LANZAMIENTOS",
    flowLabel: "FLUJO DE SEÑAL DE AUDIO",
    flowValue: "SINTETIZADOR PROCEDURAL",
    scaleLabel: "ESCALA DINÁMICA",
    scaleValue: "PENTATÓNICA DO MENOR",
    gravityLabel: "GRAVEDAD CINÉTICA",
    gravityValue: "DEFORMACIÓN DE CÉLULAS-G",
    portalsLabel: "PORTALES DE ARTISTA",
    portalsValue: "SPOTIFY VERIFICADO",
    scrollDown: "DESPLAZAR HASTA EL INGRESO",
    vaultLabel: "CICLOS ANTERIORES",
    vaultTitle: "Transmisiones de Archivo",
    vaultDesc: "Explora frecuencias anteriores y lanzamientos cíclicos en la línea de tiempo de Metro Sul.",
    synthLabel: "CONSOLA DE SEÑAL INTERACTIVA",
    synthTitle: "Modulación de Frecuencia",
    synthDesc: "Genere secuencias en vivo. Molde ondas y altere filtros en tiempo real.",
    aboutHeading: "MANIFIESTO DE DESVIACIÓN ESTÉTICA",
    aboutUnderground: "Frecuencia transformada en movimiento.",
    signalLabel: "SEÑAL DE ACOPLAMIENTO CIBERNÉTICO",
    signalDesc: "Interactúa con matrices modulares. Desestabiliza las oscilaciones de reloj central para dispersar los valores estéticos.",
    destabilizeBtn: "DESESTABILIZAR FORMA DE ONDA",
    resetBtn: "RE-ACOPLAR SEÑAL",
    scrambleGuide: "*Interactivo: Pase el cursor o haga clic en las palabras de la bio para manifestar errores de descifrado manual.",
    specsLabel: "ESPECIFICACIONES DE ONDA INTELIGENTE",
    specsTitle: "Coordenadas de la Matriz del Sistema",
    specsSubtitle: "Parámetros de hardware en tiempo real y reglas de calibración que cumplen con estándares de estudio puros.",
    specCoreLab: "Síntesis Núcleo",
    specCoreVal: "Bucles Semimodulares Eurorack",
    specMastLab: "Nivel de Masterización",
    specMastVal: "Dinámico -14 LUFS Analógico Limpio",
    specTempLab: "Tempo Temporal",
    specTempVal: "Oscilaciones Modulares 125 BPM — 138 BPM",
    specSpaceLab: "Moduladores Espaciales",
    specSpaceVal: "Delay Estéreo Binaural (Chronos Loop)",
    specVocLab: "Subcapas Vocales",
    specVocVal: "Formantes y Ruido Procesados con Láser",
    specVisLab: "Identidad Visual",
    specVisVal: "Cibernética Oscura Bioluminiscente",
    bioPart1: "es un proyecto de música electrónica experimental que explora el espacio donde la",
    bioPart2: "intuición humana",
    bioPart3: "se encuentra con los",
    bioPart4: "algoritmos mecánicos",
    bioPart5: ". Fusionando",
    bioPart6: "techno modular",
    bioPart7: "profundo, frecuencias hipnóticas de",
    bioPart8: "subgraves",
    bioPart9: "y diseño espacial, el proyecto tiende un puente entre la",
    bioPart10: "precisión digital",
    bioPart11: "y la calidez",
    bioPart12: "analógica pura. El sonido está arraigado en una estética oscura minimalista y una acústica altamente inmersiva, priorizando bucles progresivos sobre ganchos comerciales de rádio. Cada patrón es un estudio del contraste: deriva atmosférica ingrávida, tensión de la máquina y flujo del tiempo rítmico. Atar de cruzar tecnologías interactivas con síntesis analógica, Metro Sul crea un lienzo audiovisual inmersivo donde los sonidos se filtran, distorcionan y esculpen en vivo.",
    contactLabel: "CONTACTOS DE ESPECTRO DIGITAL",
    contactTitle: "Terminales de Red",
    contactDesc: "Siga horarios de giras, actualizaciones de estudio y consultas de proyectos. Encuentra a Metro Sul en todas las redes en @metrosulofficial.",

    albumBeyondConcept: "Hiperresonancia y Distorsión Gravitacional",
    albumBeyondDesc: "Un salto evolutivo cobijado por el deep techno. 'Beyond Gravity' representa una exploración de sistemas modulares que se desplazan a través de la gravedad cero, fusionando texturas bioluminiscentes con potentes bajos de alta presión.",
    albumBeyondAtmosphere: "Atmosférico, Etéreo, Graves Pesados y Subpulsos",
    albumVoltaConcept: "Dualidad Temporal: Chronos vs. Kairos",
    albumVoltaDesc: "Una obra maestra conceptual que refleja el ciclo de 24 horas del tiempo urbano. 'VOLTA' explora la fuerza mecánica de los horarios lineales (Chronos) frente a los momentos fluidos y suspendidos de la pista de baile (Kairos), transformando el tránsito, la ansiedad, los plazos de la jornada laboral y la descompresión nocturna en movimiento modular.",
    albumVoltaAtmosphere: "Acelerado, Implacable, Melodías Cinemáticas",
    albumVoltaCoreTheme: "CONVERGENCIA TEMPORAL",
    albumBeyondCoreTheme: "CIBERNÉTICA BIOLUMINISCENTE",
    embedConceptNarrative: "CONCEITO Y NARRATIVA",
    embedReleaseSeq: "SECUENCIA DE PISTAS",
    embedPlayerLabel: "REPRODUCTOR OFICIAL DE SPOTIFY",
    embedOpenSpotify: "Escuchar en Spotify",
    embedSynced: "SPOTIFY SINCRO",

    nodeSubPulseTitle: "Subpulso de Gravedad",
    nodeSubPulseDesc: "Onda senoidal subarmónica diseñada para sensaciones de oscilación física de baja frecuencia.",
    nodeChronosTitle: "Sintetizador Portal Chronos",
    nodeChronosDesc: "Barrido de dente de sierra agresivo con modulación de tiempo y retroalimentación de paso de banda resonante.",
    nodeKairosTitle: "Eco Orgánico Kairos",
    nodeKairosDesc: "Textura atmosférica serena con retrasos dinámicos espaciales y rítmicos de eco.",
    nodeVoltageTitle: "Lead Solar de Voltaje",
    nodeVoltageDesc: "Pulso melódico de alto voltaje que simula conexiones analógicas típicas de rack modular.",
    nodeBiolumTitle: "Senoide Bioluminiscente",
    nodeBiolumDesc: "Campana resonante y armónicos agudos inspirados en la tranquilidad de bosques digitales.",
    nodeHorizonTitle: "Barrido de Resonancia del Horizonte",
    nodeHorizonDesc: "Frecuencia de pad denso y panorámico que describe los límites de las ondas en el espacio.",

    presetPressureTitle: "Presión",
    presetPressureDesc: "Estilo modular techno industrial pulsante. Barridos de resonancia activos, decaimiento rápido de paso bajo y subpulsos pesados.",
    presetBeyondTitle: "Más allá de la Gravedad",
    presetBeyondDesc: "Fluctuación interestelar y deriva de ambiente. Delays con feedback abierto y relajado, subarmónicos cristalinos y ondas lentas.",
    presetKairosTitle: "Sueño de Kairos",
    presetKairosDesc: "Acordes suspendidos con sensación de viaje en el tiempo. Hermosas ondas resonantes con eco y bucles de delay espacial.",
    presetVelvetTitle: "Groove de Terciopelo",
    presetVelvetDesc: "House seductor de fin de noche. Tech-grooves profundos y sincopados con oscilaciones cálidas analógicas.",
    presetTransitTitle: "Velocidad de Tránsito",
    presetTransitDesc: "Acelera mecánica rápida de red. Disparadores de reloj extremadamente rápidos y acentos de alta resonancia.",

    synthTerminalLabel: "TERMINAL DE VOLTAJE 0.8B",
    synthMainTitle: "Sintetizador Interactivo Metro Sul",
    synthTabPads: "Teclado Modular",
    synthTabSeq: "Secuenciador Órbita",
    synthPadsDesc: "Desbloquee modulaciones de ondas sonoras en tiempo real. Toque en los nodos para activar subfrecuencias potentes y texturas ambientales.",
    synthSeqDesc: "Secuenciador Órbita Step-Matrix. Programe disparadores rítmicos en la cuadrícula o use bases preconfiguradas inspiradas en los lanzamientos de Metro Sul.",
    synthOverridesLabel: "ALINEACIONES DE FRECUENCIA",
    synthStopBtn: "DETENER SECUENCIA",
    synthStartBtn: "INICIAR SECUENCIA",
    synthClearBtn: "Limpar Matriz",
    synthActivePulseLabel: "Pulso Activo:",
    synthPatchControls: "CONTROLES DE SEÑAL",
    synthMasterLevel: "Nivel General",
    synthFilterCutoff: "Corte del Filtro",
    synthResonance: "Resonancia (Q)",
    synthEchoFeedback: "Echo Feedback",
    synthLfoSpeed: "Velocidad del LFO",
    synthPhysNote: "Los cálculos en tiempo real construyen rutas de voltaje sin utilizar muestras grabadas. Los ajustes dinámicos remodelan las de inmediato.",

    contactCardLabel: "CONTRATACIONES // COMUNICACIÓN_DIRECTA",
    contactCardTitle: "Contacto & Gigs",
    contactCardDesc: "Este es el canal oficial de contacto del proyecto musical. Para verificación de propiedad, plataformas digitales, Spotify, licenciamiento, alianzas o asuntos relacionados con el catálogo, utilice el correo electrónico abajo.",
    contactCardCopy: "COPIAR CORREO",
    contactCardCopied: "COPIADO",

    footerCredits: "PATRONES DE CÓDIGO COMPATIBLES CON MINIMALISMO COGNITIVO.",
    hotkeysBtn: "ATALHOS DE SISTEMA",
    modalTerminal: "TERMINAL DE TELEMETRÍA COGNITIVA",
    modalTitle: "Vectores de Navegación Cuántica",
    modalDesc: "Metro Sul representa una máquina modular interactiva. Use su teclado físico para teletransportarse instantáneamente por las coordenadas del sistema:",
    modalLogStatus: "SYS LOGS: OK",
    modalLogVersion: "METRO SUL VERSION_0.8B",
    upcomingLabel: "NUEVA FASE DE SEÑAL",
    upcomingTitle: "Architect of Overflow",
    upcomingDesc: "Architect of Overflow inicia una nueva fase para Metro Sul — un lanzamiento electrónico guiado por frecuencia sobre abundancia, manifestación, alineación y creación consciente."
  }
};
