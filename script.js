// ==============================================================================
// CÁTEDRA DE TELEINFORMÁTICA Y REDES DE DATOS - GRUPO VERDE
// CISCO PACKET TRACER: DE LA RED PLANA A LA ALTA DISPONIBILIDAD (VLANs, ROAS Y STP)
// Motor de Diapositivas, Guion Textual Exacto del Alumno y Simulaciones SVG en Loop
// ==============================================================================

let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let soundEnabled = true;



// ------------------------------------------------------------------------------
// MOTOR DE AUDIO SINTETIZADO (Web Audio API)
// ------------------------------------------------------------------------------
let audioCtx = null;
function playTone(freq, type = 'sine', duration = 0.12) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playSuccessBeep() { playTone(587.33, 'triangle', 0.1); setTimeout(() => playTone(880, 'triangle', 0.18), 90); }
function playAlertBeep() { playTone(220, 'sawtooth', 0.22); }
function playStepBeep() { playTone(440, 'sine', 0.08); }

// ------------------------------------------------------------------------------
// CONTROL DE NAVEGACIÓN Y DIAPOSITIVAS (15 DIAPOSITIVAS)
// ------------------------------------------------------------------------------
function updateSlideView() {
  slides.forEach((s, idx) => {
    s.classList.remove('active', 'prev');
    if (idx === currentSlide) s.classList.add('active');
    else if (idx < currentSlide) s.classList.add('prev');
  });

  const dots = document.querySelectorAll('.indicator-dot');
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentSlide));

  const curNum = document.getElementById('currentSlideNum');
  const totNum = document.getElementById('totalSlidesNum');
  if (curNum) curNum.innerText = currentSlide + 1;
  if (totNum) totNum.innerText = totalSlides;

  const btnPrev = document.getElementById('btnPrevSlide');
  const btnNext = document.getElementById('btnNextSlide');
  if (btnPrev) btnPrev.disabled = (currentSlide === 0);
  if (btnNext) btnNext.disabled = (currentSlide === totalSlides - 1);

  playStepBeep();
  handleSlideAutoActions();

  // Reproducir videos de la diapositiva activa, pausar los de diapositivas inactivas
  const activeSlide = slides[currentSlide];
  document.querySelectorAll('video').forEach(vid => {
    if (activeSlide && activeSlide.contains(vid)) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  });
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlideView();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlideView();
  }
}

function goToSlide(idx) {
  if (idx >= 0 && idx < totalSlides) {
    currentSlide = idx;
    updateSlideView();
  }
}



// Inicializar barra de indicadores (15 dots)
const indicatorsContainer = document.getElementById('slideIndicators');
if (indicatorsContainer) {
  indicatorsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
    dot.title = `Ir a Diapositiva ${i + 1}`;
    dot.addEventListener('click', () => goToSlide(i));
    indicatorsContainer.appendChild(dot);
  }
}

// Controles inferiores y cabecera
const btnNext = document.getElementById('btnNextSlide');
const btnPrev = document.getElementById('btnPrevSlide');
if (btnNext) btnNext.addEventListener('click', nextSlide);
if (btnPrev) btnPrev.addEventListener('click', prevSlide);



const btnFullscreen = document.getElementById('btnFullscreen');
if (btnFullscreen) {
  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

const btnSoundToggle = document.getElementById('btnSoundToggle');
if (btnSoundToggle) {
  btnSoundToggle.innerText = 'Audio: ON';
  btnSoundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    btnSoundToggle.innerText = soundEnabled ? 'Audio: ON' : 'Audio: OFF';
  });
}

// Atajos de teclado para exposición
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    nextSlide();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    prevSlide();
  } else if (e.key.toLowerCase() === 'f') {
    if (btnFullscreen) btnFullscreen.click();
  }
});

// ==============================================================================
// SIMULACIÓN 1 (SLIDE 1): INUNDACIÓN DE BROADCAST EN RED PLANA (SVG COORDINATES)
// ==============================================================================
const btnSim2Broadcast = document.getElementById('btnSim2Broadcast');
const btnSim2Reset = document.getElementById('btnSim2Reset');
const sim2Status = document.getElementById('sim2Status');
const svgPacketsWrap2 = document.getElementById('svgPacketsWrap2');

function clearSim2Packets() {
  if (svgPacketsWrap2) svgPacketsWrap2.innerHTML = '';
  for (let i = 1; i <= 6; i++) {
    const cable = document.getElementById(`cable2_${i}`);
    if (cable) cable.classList.remove('active');
  }
  if (sim2Status) {
    sim2Status.innerText = 'Red Plana: Broadcast Inunda Todos los Puertos';
    sim2Status.style.color = '#f43f5e';
  }
}

if (btnSim2Reset) btnSim2Reset.addEventListener('click', clearSim2Packets);
if (btnSim2Broadcast) {
  btnSim2Broadcast.addEventListener('click', () => {
    clearSim2Packets();
    btnSim2Broadcast.disabled = true;
    playAlertBeep();

    const pInit = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pInit.innerHTML = `
      <rect x="-45" y="-12" width="90" height="24" rx="12" fill="#881337" stroke="#f43f5e" stroke-width="1.5" filter="url(#glowRose)"/>
      <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="8" font-weight="700" font-family="'JetBrains Mono', monospace">BROADCAST</text>
    `;
    pInit.setAttribute('transform', 'translate(100, 70)');
    pInit.style.transition = 'transform 0.8s ease-in-out';
    svgPacketsWrap2.appendChild(pInit);

    const c1 = document.getElementById('cable2_1');
    if (c1) c1.classList.add('active');
    if (sim2Status) sim2Status.innerText = 'PC 1 emite broadcast hacia el switch...';

    setTimeout(() => {
      pInit.setAttribute('transform', 'translate(250, 160)');
    }, 50);

    setTimeout(() => {
      pInit.remove();
      if (c1) c1.classList.remove('active');
      if (sim2Status) sim2Status.innerText = 'El switch no puede filtrar: copia el broadcast a las 5 computadoras';
      playAlertBeep();

      const targets = [
        { id: 'cable2_2', x: 70, y: 160 },
        { id: 'cable2_3', x: 100, y: 250 },
        { id: 'cable2_4', x: 400, y: 70 },
        { id: 'cable2_5', x: 430, y: 160 },
        { id: 'cable2_6', x: 400, y: 250 }
      ];

      targets.forEach(t => {
        const c = document.getElementById(t.id);
        if (c) c.classList.add('active');
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        p.innerHTML = `
          <rect x="-42" y="-11" width="84" height="22" rx="11" fill="#881337" stroke="#f43f5e" stroke-width="1.5" filter="url(#glowRose)"/>
          <text x="0" y="4" text-anchor="middle" fill="#fff" font-size="7.5" font-weight="700" font-family="'JetBrains Mono', monospace">BROADCAST</text>
        `;
        p.setAttribute('transform', 'translate(250, 160)');
        p.style.transition = 'transform 0.9s ease-out';
        svgPacketsWrap2.appendChild(p);

        setTimeout(() => {
          p.setAttribute('transform', `translate(${t.x}, ${t.y})`);
        }, 50);
      });

      setTimeout(() => {
        targets.forEach(t => {
          const c = document.getElementById(t.id);
          if (c) c.classList.remove('active');
        });
        if (sim2Status) sim2Status.innerText = 'Ruido masivo: Ancho de banda y CPU desperdiciados en todas las PCs.';
        btnSim2Broadcast.disabled = false;
      }, 1100);
    }, 900);
  });
}

// ==============================================================================
// SIMULACIÓN 2 (SLIDE 2): CONTENCIÓN DE BROADCAST EN VLAN (SVG COORDINATES)
// ==============================================================================
const btnSim3Broadcast = document.getElementById('btnSim3Broadcast');
const btnSim3Reset = document.getElementById('btnSim3Reset');
const sim3Status = document.getElementById('sim3Status');
const svgPacketsWrap3 = document.getElementById('svgPacketsWrap3');
const vlanShieldBadge = document.getElementById('vlanShieldBadge');

function resetSim3() {
  if (svgPacketsWrap3) svgPacketsWrap3.innerHTML = '';
  for (let i = 1; i <= 4; i++) {
    const c = document.getElementById(`cable3_${i}`);
    if (c) c.classList.remove('active');
  }
  if (vlanShieldBadge) vlanShieldBadge.style.display = 'none';
  if (sim3Status) sim3Status.innerText = 'Switch segmentado en VLAN 10 y VLAN 20';
}

if (btnSim3Reset) btnSim3Reset.addEventListener('click', resetSim3);
if (btnSim3Broadcast) {
  btnSim3Broadcast.addEventListener('click', () => {
    resetSim3();
    btnSim3Broadcast.disabled = true;
    playTone(520, 'sine', 0.1);

    const pInit = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pInit.innerHTML = `
      <rect x="-48" y="-12" width="96" height="24" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" filter="url(#glowCyanVlan)"/>
      <text x="0" y="4" text-anchor="middle" fill="#e0f2fe" font-size="8" font-weight="700" font-family="'JetBrains Mono', monospace">VLAN 10 BCAST</text>
    `;
    pInit.setAttribute('transform', 'translate(120, 100)');
    pInit.style.transition = 'transform 0.8s ease-in-out';
    svgPacketsWrap3.appendChild(pInit);

    const c1 = document.getElementById('cable3_1');
    if (c1) c1.classList.add('active');
    if (sim3Status) sim3Status.innerText = 'PC A emite broadcast dentro de la VLAN 10...';

    setTimeout(() => {
      pInit.setAttribute('transform', 'translate(250, 160)');
    }, 50);

    setTimeout(() => {
      pInit.remove();
      if (c1) c1.classList.remove('active');
      if (sim3Status) sim3Status.innerText = 'El switch replica ÚNICAMENTE a puertos de la VLAN 10 (PC B)';
      playSuccessBeep();

      const c2 = document.getElementById('cable3_2');
      if (c2) c2.classList.add('active');

      const pVlan10 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      pVlan10.innerHTML = `
        <rect x="-48" y="-12" width="96" height="24" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" filter="url(#glowCyanVlan)"/>
        <text x="0" y="4" text-anchor="middle" fill="#e0f2fe" font-size="8" font-weight="700" font-family="'JetBrains Mono', monospace">VLAN 10 BCAST</text>
      `;
      pVlan10.setAttribute('transform', 'translate(250, 160)');
      pVlan10.style.transition = 'transform 0.8s ease-out';
      svgPacketsWrap3.appendChild(pVlan10);

      setTimeout(() => {
        pVlan10.setAttribute('transform', 'translate(120, 220)');
      }, 50);

      if (vlanShieldBadge) vlanShieldBadge.style.display = 'block';

      setTimeout(() => {
        if (c2) c2.classList.remove('active');
        if (sim3Status) sim3Status.innerText = 'Aislamiento confirmado: VLAN 20 (Ventas) no se entera de que el mensaje existió.';
        btnSim3Broadcast.disabled = false;
      }, 950);
    }, 900);
  });
}

// ==============================================================================
// SIMULACIÓN 3 (SLIDE 9): CICLO DEL PAQUETE EN ROUTER-ON-A-STICK (SVG COORDINATES)
// ==============================================================================
const btnSim4Step = document.getElementById('btnSim4Step');
const btnSim4Auto = document.getElementById('btnSim4Auto');
const btnSim4Reset = document.getElementById('btnSim4Reset');
const sim4Status = document.getElementById('sim4Status');
const packet4 = document.getElementById('packet4');
const packet4Text = document.getElementById('packet4Text');
const packet4Bg = document.getElementById('packet4Bg');

let roasStep = 0;
let roasAutoInterval = null;

const roasStepsData = [
  {
    text: "Paso 1: PC 1 entrega el paquete a su default gateway (subinterfaz Fa0/0.10).",
    x: 350, y: 210,
    fill: "#0c4a6e", stroke: "#38bdf8",
    badge: "IP: 10.11 ➔ 20.11",
    cableOn: "cable4A"
  },
  {
    text: "Paso 2: Switch inserta la etiqueta 802.1Q (VID 10) y la sube por el cable troncal.",
    x: 350, y: 75,
    fill: "#581c87", stroke: "#c084fc",
    badge: "TAG 802.1Q [VID 10]",
    cableOn: "cable4Trunk"
  },
  {
    text: "Paso 3: Subinterfaz Fa0/0.10 clasifica la trama, enruta a Fa0/0.20 y cambia etiqueta a VID 20.",
    x: 350, y: 75,
    fill: "#064e3b", stroke: "#10b981",
    badge: "Enrutado ➔ VID 20",
    cableOn: null
  },
  {
    text: "Paso 4: Router baja la trama etiquetada por el mismo troncal hacia el switch.",
    x: 350, y: 210,
    fill: "#581c87", stroke: "#c084fc",
    badge: "TAG 802.1Q [VID 20]",
    cableOn: "cable4Trunk"
  },
  {
    text: "Paso 5: Switch quita la etiqueta y entrega la trama limpia por puerto de acceso a PC 2.",
    x: 540, y: 260,
    fill: "#064e3b", stroke: "#10b981",
    badge: "Trama Limpia ➔ PC 2",
    cableOn: "cable4B"
  }
];

function resetSim4() {
  clearInterval(roasAutoInterval);
  roasAutoInterval = null;
  roasStep = 0;
  if (!packet4) return;
  packet4.style.display = 'none';
  packet4.setAttribute('transform', 'translate(160, 260)');
  ['cable4A', 'cable4Trunk', 'cable4B'].forEach(id => {
    const c = document.getElementById(id);
    if (c) c.classList.remove('active');
  });
  if (sim4Status) sim4Status.innerText = 'Topología ROAS Lista para transmisión';
  if (btnSim4Step) btnSim4Step.innerText = 'Paso Siguiente (1 / 5)';
  if (btnSim4Auto) btnSim4Auto.innerText = 'Reproducción Automática';
}

function executeRoasStep() {
  if (roasStep >= roasStepsData.length) {
    resetSim4();
    return;
  }

  const s = roasStepsData[roasStep];
  packet4.style.display = 'block';
  if (packet4Text) packet4Text.textContent = s.badge;
  if (packet4Bg) {
    packet4Bg.setAttribute('fill', s.fill);
    packet4Bg.setAttribute('stroke', s.stroke);
  }

  ['cable4A', 'cable4Trunk', 'cable4B'].forEach(id => {
    const c = document.getElementById(id);
    if (c) c.classList.remove('active');
  });

  if (s.cableOn) {
    const c = document.getElementById(s.cableOn);
    if (c) c.classList.add('active');
  }

  if (sim4Status) sim4Status.innerText = s.text;
  playTone(400 + roasStep * 80, 'sine', 0.1);

  setTimeout(() => {
    packet4.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    packet4.setAttribute('transform', `translate(${s.x}, ${s.y})`);
  }, 40);

  roasStep++;
  if (btnSim4Step) {
    btnSim4Step.innerText = roasStep < roasStepsData.length
      ? `Paso Siguiente (${roasStep + 1} / 5)`
      : 'Reiniciar Ciclo ROAS';
  }
}

if (btnSim4Reset) btnSim4Reset.addEventListener('click', resetSim4);
if (btnSim4Step) btnSim4Step.addEventListener('click', executeRoasStep);
if (btnSim4Auto) {
  btnSim4Auto.addEventListener('click', () => {
    if (roasAutoInterval) {
      clearInterval(roasAutoInterval);
      roasAutoInterval = null;
      btnSim4Auto.innerText = 'Reproducción Automática';
    } else {
      btnSim4Auto.innerText = 'Pausar Reproducción';
      resetSim4();
      executeRoasStep();
      roasAutoInterval = setInterval(() => {
        executeRoasStep();
      }, 1600);
    }
  });
}

// ==============================================================================
// SIMULACIÓN 4 (SLIDE 11): TTL EN IP VS. AUSENCIA DE TTL EN ETHERNET (SVG)
// ==============================================================================
const btnSimTtlIp = document.getElementById('btnSimTtlIp');
const btnSimTtlEth = document.getElementById('btnSimTtlEth');
const simTtlStatus = document.getElementById('simTtlStatus');
const packetIpTtl = document.getElementById('packetIpTtl');
const packetIpTtlText = document.getElementById('packetIpTtlText');
const packetEthLoop = document.getElementById('packetEthLoop');

let ethLoopInterval = null;

if (btnSimTtlIp) {
  btnSimTtlIp.addEventListener('click', () => {
    if (!packetIpTtl) return;
    clearInterval(ethLoopInterval);
    if (packetEthLoop) packetEthLoop.style.display = 'none';

    packetIpTtl.style.display = 'block';
    packetIpTtl.setAttribute('transform', 'translate(60, 90)');
    if (packetIpTtlText) packetIpTtlText.textContent = 'IP (TTL=3)';
    if (simTtlStatus) simTtlStatus.innerText = 'Capa 3: Paquete IP decrementa TTL en cada salto...';
    playTone(480, 'sine', 0.1);

    setTimeout(() => {
      packetIpTtl.style.transition = 'transform 1s linear';
      packetIpTtl.setAttribute('transform', 'translate(180, 90)');
      if (packetIpTtlText) packetIpTtlText.textContent = 'IP (TTL=2)';
      playTone(440, 'sine', 0.1);
    }, 600);

    setTimeout(() => {
      packetIpTtl.setAttribute('transform', 'translate(310, 90)');
      if (packetIpTtlText) packetIpTtlText.textContent = 'IP (TTL=1)';
      playTone(400, 'sine', 0.1);
    }, 1700);

    setTimeout(() => {
      packetIpTtl.setAttribute('transform', 'translate(430, 90)');
      if (packetIpTtlText) packetIpTtlText.textContent = 'TTL=0';
      playAlertBeep();
      if (simTtlStatus) simTtlStatus.innerText = 'TTL llega a 0: El router descarta el paquete. El bucle se extingue por diseño.';
      setTimeout(() => {
        packetIpTtl.style.display = 'none';
      }, 900);
    }, 2800);
  });
}

if (btnSimTtlEth) {
  btnSimTtlEth.addEventListener('click', () => {
    if (!packetEthLoop) return;
    if (packetIpTtl) packetIpTtl.style.display = 'none';
    packetEthLoop.style.display = 'block';
    if (simTtlStatus) simTtlStatus.innerText = 'Capa 2: La trama Ethernet no tiene TTL. Gira para siempre a la velocidad del cable.';
    playAlertBeep();

    let angle = 0;
    clearInterval(ethLoopInterval);
    ethLoopInterval = setInterval(() => {
      angle += 0.08;
      const cx = 250, cy = 205, r = 55;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      packetEthLoop.setAttribute('transform', `translate(${x}, ${y})`);
    }, 30);
  });
}

// ==============================================================================
// SIMULACIÓN 5 (SLIDE 13): STP TRÁFICO EN LOOP CONTINUO Y CORTE CON TIJERA (SVG)
// ==============================================================================
const btnStpCut = document.getElementById('btnStpCut');
const btnStpRestore = document.getElementById('btnStpRestore');
const btnStpReset = document.getElementById('btnStpReset');
const simStpStatus = document.getElementById('simStpStatus');
const pStpTraffic = document.getElementById('pStpTraffic');
const cableStp12 = document.getElementById('cableStp12');
const cableStp13 = document.getElementById('cableStp13');
const cableStp23 = document.getElementById('cableStp23');
const stpPortBadge = document.getElementById('stpPortBadge');
const stpPortBg = document.getElementById('stpPortBg');

let stpTrafficInterval = null;
let isStpCut = false;

function startStpTrafficLoop() {
  clearInterval(stpTrafficInterval);
  if (!pStpTraffic) return;
  pStpTraffic.style.display = 'block';
  let progress = 0;
  let direction = 1;

  stpTrafficInterval = setInterval(() => {
    progress += 0.024 * direction;
    if (progress >= 1) { progress = 1; direction = -1; }
    if (progress <= 0) { progress = 0; direction = 1; }

    let curX, curY;
    if (!isStpCut) {
      // Camino activo: Switch 2 (170, 250) <-> Root Bridge S1 (325, 70) <-> Switch 3 (480, 250)
      if (progress < 0.5) {
        const f = progress / 0.5;
        curX = 170 + (325 - 170) * f;
        curY = 250 + (70 - 250) * f;
      } else {
        const f = (progress - 0.5) / 0.5;
        curX = 325 + (480 - 325) * f;
        curY = 70 + (250 - 70) * f;
      }
    } else {
      // Camino de contingencia directo: Switch 2 (170, 250) <-> Switch 3 (480, 250)
      curX = 170 + (480 - 170) * progress;
      curY = 250;
    }
    // El transform del elemento SVG dentro del viewBox garantiza alineación perfecta a los cables
    pStpTraffic.setAttribute('transform', `translate(${curX}, ${curY})`);
  }, 35);
}

if (btnStpCut) {
  btnStpCut.addEventListener('click', () => {
    if (isStpCut) return;
    isStpCut = true;
    playAlertBeep();

    if (cableStp13) {
      cableStp13.classList.add('cut');
      cableStp13.classList.remove('active');
    }
    if (simStpStatus) simStpStatus.innerText = 'Corte en vivo con la tijera: Cable S1-S3 caído. Ping interrumpido unos segundos...';

    setTimeout(() => {
      if (cableStp23) {
        cableStp23.classList.remove('blocked');
        cableStp23.classList.add('active');
      }
      if (stpPortBadge) {
        stpPortBadge.textContent = '[HABILITADO - Verde]';
        stpPortBadge.setAttribute('fill', '#10b981');
      }
      if (stpPortBg) {
        stpPortBg.setAttribute('stroke', '#10b981');
      }
      if (simStpStatus) simStpStatus.innerText = 'Spanning Tree habilitó el puerto: El ping vuelve a responder. La red se arregló sola.';
      playSuccessBeep();
    }, 850);
  });
}

if (btnStpRestore) {
  btnStpRestore.addEventListener('click', () => {
    if (!isStpCut) return;
    isStpCut = false;
    if (cableStp13) {
      cableStp13.classList.remove('cut');
      cableStp13.classList.add('active');
    }
    if (cableStp23) {
      cableStp23.classList.add('blocked');
      cableStp23.classList.remove('active');
    }
    if (stpPortBadge) {
      stpPortBadge.textContent = '[BLOQUEADO - Ámbar]';
      stpPortBadge.setAttribute('fill', '#f59e0b');
    }
    if (stpPortBg) {
      stpPortBg.setAttribute('stroke', '#f59e0b');
    }
    if (simStpStatus) simStpStatus.innerText = 'Cable restaurado: STP bloquea nuevamente el puerto en ámbar para romper el círculo.';
    playSuccessBeep();
  });
}

if (btnStpReset) {
  btnStpReset.addEventListener('click', () => {
    isStpCut = false;
    if (cableStp13) {
      cableStp13.classList.remove('cut');
      cableStp13.classList.add('active');
    }
    if (cableStp23) {
      cableStp23.classList.add('blocked');
      cableStp23.classList.remove('active');
    }
    if (stpPortBadge) {
      stpPortBadge.textContent = '[BLOQUEADO - Ámbar]';
      stpPortBadge.setAttribute('fill', '#f59e0b');
    }
    if (stpPortBg) {
      stpPortBg.setAttribute('stroke', '#f59e0b');
    }
    if (simStpStatus) simStpStatus.innerText = 'STP Convergido: Tráfico fluyendo en loop continuo por camino principal';
    startStpTrafficLoop();
  });
}

// ------------------------------------------------------------------------------
// ACCIONES AUTOMÁTICAS AL CAMBIAR DE DIAPOSITIVA
// ------------------------------------------------------------------------------
function handleSlideAutoActions() {
  clearInterval(ethLoopInterval);

  const activeSlide = slides[currentSlide];
  if (activeSlide && (activeSlide.querySelector('#simStpCanvas') || activeSlide.querySelector('#btnStpCutCable') || activeSlide.querySelector('#btnStpCut') || activeSlide.querySelector('#cableStp13'))) {
    startStpTrafficLoop();
  } else if (currentSlide === 13) {
    // Slide 13: Demostración STP con loop continuo
    startStpTrafficLoop();
  }
}

// Inicialización de la presentación
updateSlideView();

// ------------------------------------------------------------------------------
// MODAL DE ZOOM DE IMÁGENES PARA EL EXPOSITOR
// ------------------------------------------------------------------------------
window.openImageModal = function(src, title = 'Detalle de Captura') {
  const modal = document.getElementById('imageModal');
  const img = document.getElementById('imgModalTarget');
  const caption = document.getElementById('imgModalTitle');
  if (modal && img && caption) {
    img.src = src;
    caption.innerText = title;
    modal.classList.add('open');
  }
};

window.closeImageModal = function(e) {
  const modal = document.getElementById('imageModal');
  if (modal) modal.classList.remove('open');
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

