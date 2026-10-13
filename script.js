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
// GUION EXACTO DEL EXPOSITOR (ALINEADO 100% CON LO QUE DICE EL ALUMNO EN CADA SLIDE)
// ------------------------------------------------------------------------------
const speakerNotes = [
  // Slide 0: Portada
  "Buenos días. Somos el grupo verde y vamos a hablar de Cisco Packet Tracer. Hoy vamos a recorrer cómo pasar de una red plana problemática a una infraestructura profesional segmentada con VLANs, comunicada con Router-on-a-Stick y protegida ante caídas con Spanning Tree Protocol.",

  // Slide 1: Intro - La Red Plana (Elu)
  "Primero, veremos un problema que resuelven las VLANs: una empresa con quinientas computadoras, todas en la misma red. A eso se lo llama red plana, y trae dos problemas.\n\n1 El ruido: hay mensajes que se envían a todos los equipos a la vez, los broadcasts. El switch no los puede filtrar, los copia a todos sus puertos, y las quinientas computadoras tienen que leerlos para darse cuenta de que no eran para ellas. Se desperdicia ancho de banda y procesador.\n\n2 La seguridad: cualquiera puede enchufar su notebook en una toma de la sala de visitas y queda en la misma red que el servidor de Recursos Humanos, sin nada en el medio que lo filtre.\n\nUn switch solo no resuelve esto, y poner uno por sector es muy costoso. Por eso existen las VLANs: dividen una red física en varias redes separadas, usando el mismo equipo. Continúa mi compañero.",

  // Slide 2: Parte 1 - VLANs: Definición y Beneficios
  "Gracias. Yo voy a contar cómo se resuelve ese problema. La solución se llama VLAN, Red de Área Local Virtual. Pero antes de definirla, un repaso breve de qué hace un switch, porque de ahí sale todo: un switch es el equipo donde se enchufan las computadoras de una oficina. Trabaja con direcciones MAC, las direcciones físicas que trae cada placa de red de fábrica. Cuando una computadora manda un mensaje, el switch mira a qué MAC va dirigido y lo reenvía solo por el puerto donde está esa máquina.\n\nEl problema aparece con los mensajes de broadcast, los que van dirigidos a todos. Ahí el switch no tiene a quién elegir y los copia por todos sus puertos. A ese conjunto de equipos que reciben todos los broadcast se lo llama dominio de difusión. Y acá está la clave: por defecto, un switch entero es un solo dominio de difusión. Veinticuatro puertos, veinticuatro computadoras, un solo dominio.\n\nEntonces, la definición: Una VLAN es un dominio de difusión independiente, creado por software dentro de un switch físico.\n\nEn un switch de 24 puertos configuramos los puertos 1 al 12 en la VLAN 10, y los puertos 13 al 24 en la VLAN 20. Con esa sola decisión partimos el switch en dos switches lógicos separados. Físicamente comparten el mismo equipo. Lógicamente están en mundos separados.\n\nEsto nos da cuatro beneficios: Rendimiento (ruido contenido), Seguridad (obligados a pasar por un router), Flexibilidad (agrupar por rol, no por dónde se sientan) y Costo (un solo equipo bueno). No todas las VLANs son iguales: hay de datos, de voz y de gestión, que dejamos en el documento.",

  // Slide 3: Parte 1 - Demo Packet Tracer: Aislamiento y Lupa
  "Ahora pasemos a Packet Tracer. Acá tenemos un switch con cuatro computadoras. Creamos las dos VLANs y asignamos los puertos. Con el comando show vlan brief el switch muestra la tabla: la VLAN diez con sus puertos, la VLAN veinte con los suyos.\n\nY ahora la prueba: Ping entre dos computadoras de la misma VLAN: responde. Ping entre una de la VLAN diez y una de la VLAN veinte, enchufadas al mismo switch, a treinta centímetros una de otra: no responde. El aislamiento es real.\n\nUna última cosa de la herramienta: Packet Tracer tiene esta lupa, el Inspect tool, que abre las tablas internas de cualquier equipo sin escribir un comando. Acá está la tabla de VLANs del switch, en vivo. Casi nadie la usa y ahorra mucho tiempo cuando algo no funciona.\n\nEntonces quedamos así: las VLANs resuelven el ruido y la seguridad, pero aíslan tanto que ahora tenemos un problema nuevo. Sigue mi compañero.",

  // Slide 4: Parte 2 - Troncales: El Problema de Edificios
  "Gracias. Las VLANs funcionan dentro de un switch. Veamos qué pasa cuando la empresa tiene más de uno.\n\nImaginemos una universidad con dos edificios. En los dos hay alumnos de Sistemas, de Diseño y de Administración, y queremos que cada carrera esté en su propia VLAN. En cada edificio hay un switch.\n\nSi solo existieran los puertos normales, para unir los dos switches respetando las VLANs habría que tirar un cable por cada VLAN. Tres VLANs, tres cables entre edificios. Con cincuenta VLANs serían cincuenta puertos de cada switch y cincuenta tiradas de cable, solo para unirlos. Y cada VLAN nueva exigiría un cable nuevo. Es inviable.\n\nPor eso existen dos modos de funcionamiento para los puertos de un switch:\n- El puerto de acceso: pertenece a una sola VLAN para computadoras e impresoras. Las tramas viajan limpias, sin ninguna etiqueta.\n- El puerto troncal (trunk): es un enlace entre dos equipos de red, y puede transportar el tráfico de muchas VLANs al mismo tiempo por un solo cable.",

  // Slide 5: Parte 2 - La Etiqueta IEEE 802.1Q (Diapositiva 6)
  "Ahí surge la pregunta clave: si por ese único cable troncal viajan mezcladas las tramas de Sistemas y de Administración, ¿cómo hace el switch del otro edificio para saber a qué VLAN pertenece cada una si todas son tramas Ethernet estándar?\n\nLa respuesta es que el switch que las transmite les inserta una etiqueta estandarizada por el IEEE 802.1Q. En vez de encapsular la trama entera como hacía el viejo protocolo propietario ISL de Cisco, inyecta cuatro bytes (32 bits) justo después de la dirección MAC de origen.\n\nEn Packet Tracer esto se ve claramente en el antes y el después de la PDU:\n- En el puerto de acceso la trama es Ethernet II convencional, limpia y sin etiqueta, porque las computadoras finales no entienden 802.1Q.\n- Pero cuando entra al cable troncal, el formato cambia a Ethernet 802.1q y se ven dos campos de dos bytes cada uno: TPID y TCI.\n\nEl TPID vale 0x8100 (abreviado 0x81), que avisa que lo que sigue es una etiqueta de VLAN. Y en el TCI están empaquetados los campos que define la teoría: tres bits de prioridad PCP, un bit de descarte DEI y doce bits de VID para el número de VLAN.\n\n¿Y por qué Packet Tracer muestra TCI: 0xa? Porque al no haber prioridad ni descarte, los bits de PCP y DEI son cero, y el VID es 0000 0000 1010, que es el número 10 en binario. Esos dieciséis bits convertidos a hexadecimal dan exactamente 0x000A, abreviado como 0xa. Es la demostración matemática de que la trama viaja identificada como VLAN 10.",

  // Slide 6: Parte 2 - Ciclo Simétrico y Prueba de Aislamiento (Diapositiva 7)
  "Para cerrar nuestra parte, veamos qué ocurre cuando la trama llega a la computadora de destino: al salir por el puerto de acceso, el switch le retira la etiqueta 802.1Q antes de entregarla. Y cuando esa computadora responde al ping con un ICMP Echo Reply, el proceso se repite exactamente como un espejo: el switch le vuelve a inyectar la etiqueta para cruzar el troncal y el switch emisor se la saca antes de entregársela al origen.\n\nLa gran conclusión operativa es que las computadoras finales son totalmente agnósticas a las VLANs: jamás se enteran de las etiquetas ni de la multiplexación del cable.\n\nY por último, realizamos la prueba crítica de aislamiento: ¿qué ocurre si intentamos enviar un ping desde una máquina de Sistemas (VLAN 10) hacia una de Administración (VLAN 20)? Como ven en pantalla, el ping falla de inmediato en la propia máquina de origen con una cruz roja, y el paquete ni siquiera puede salir.\n\n¿Por qué? Porque pertenecen a subredes IP distintas y la regla de TCP/IP exige obligatoriamente un Default Gateway para comunicarse. Pero los switches trabajan estrictamente en Capa 2 con direcciones MAC: garantizan el aislamiento pero no enrutan IPs.\n\nPara que Sistemas y Administración puedan comunicarse manteniendo la seguridad, necesitamos un equipo de Capa 3 que aproveche este mismo enlace troncal: la técnica Router-on-a-Stick. Le cedo la palabra a mi compañero.",

  // Slide 7: Parte 3 - El Salto a Capa 3
  "Gracias. Tenemos las VLANs creadas y sabemos transportarlas entre switches. Pero sigue abierto el problema de antes: dos computadoras en VLANs distintas no se pueden comunicar. En la vida real Contabilidad necesita llegar al servidor de archivos de forma controlada.\n\n¿Por qué el switch no puede hacerlo solo? Porque trabaja en Capa 2, con direcciones MAC. No sabe leer direcciones IP ni modificarlas. Lo único que sabe es que la VLAN 10 y la VLAN 20 no se tocan.\n\nVeamos qué pasa cuando una computadora quiere salir de su VLAN: una máquina 192.168.10.10 quiere hablarle a 192.168.20.20. Compara con su máscara y concluye que el destino está en otra red. Y acá está el detalle fino: en ese caso la computadora no pregunta por la MAC destino; pregunta por la MAC de su default gateway (el router), le entrega el paquete y se desentiende.\n\nNecesitamos un equipo de Capa 3. La forma obvia de tirar un cable por VLAN hacia el router funciona pero no escala: los routers tienen 2 o 4 interfaces físicas, no 15.",

  // Slide 8: Parte 3 - Router-on-a-Stick y DHCP
  "La solución se llama Router on a Stick, router de una sola pata, y es bastante ingeniosa.\n\nSe usa un solo cable entre el switch y el router, configurado como enlace troncal. Y del lado del router, la interfaz física única se divide por software en varias subinterfaces lógicas: si se llama GigabitEthernet0/0, las subinterfaces son punto diez y punto veinte.\n\nCada subinterfaz lleva dos cosas: primero, el comando encapsulation dot1Q seguido del número de VLAN; y segundo, una dirección IP propia, que va a ser la puerta de enlace de todas las computadoras de esa VLAN.\n\nCon un solo cable, el router pasa a tener un pie en cada VLAN. Las tramas suben etiquetadas, el router las clasifica, las enruta y las baja hacia la VLAN de destino.\n\nY además le agregamos DHCP: en vez de cargar la IP a mano, el router las entrega automáticamente cuando las máquinas se encienden.",

  // Slide 9: Parte 3 - Demo Packet Tracer: ROAS y Simulador vs Emulador
  "Vamos a la demostración: este es el mismo ping entre VLANs que hace un rato no funcionaba; ahora, con las subinterfaces configuradas, responde. Estas computadoras tomaron dirección, máscara y gateway solas del DHCP del router. Y con la lupa abro la tabla de ruteo: acá se ven las dos redes apuntando a su subinterfaz.\n\nPara cerrar, algo que investigamos sobre la herramienta: Packet Tracer es un simulador, no un emulador. No ejecuta el sistema operativo real Cisco: imita su comportamiento e implementa parte de los comandos (para el sistema real están GNS3 y EVE-NG). Aun así tiene modo multiusuario para conectar dos instalaciones y la versión 9 sumó equipos industriales.\n\nNos queda un último problema, y es el más grave de todos. Sigue mi compañero.",

  // Slide 10: Parte 4 - La Debilidad Fatal: La Redundancia
  "Gracias. Hasta acá armamos una red que funciona, pero tiene una debilidad que la deja inservible: todo lo que mostramos depende de un cable. Si ese cable se corta o el switch se quema, la empresa deja de operar. En una red real eso no es aceptable.\n\nLa solución parece obvia: poner cables de más. Conectar los switches formando un triángulo, de manera que si se cae un camino quede otro. Eso se llama redundancia.\n\nEl problema es que la redundancia, hecha así, destruye la red. Y acá está el punto más interesante de todo:\n\nEl dilema queda planteado así: sin redundancia, cualquier cable cortado detiene la empresa. Con redundancia, la red se destruye a sí misma.",

  // Slide 11: Parte 4 - ¿Por qué Ethernet no tiene TTL?
  "Cuando hay un camino circular entre switches, un broadcast entra en ese círculo y empieza a dar vueltas. El primer switch lo copia al segundo, el segundo al tercero, el tercero al primero, y vuelve a empezar.\n\n¿Por qué no se muere solo? Porque un paquete IP tiene un campo llamado TTL (tiempo de vida) que se descuenta en cada salto y cuando llega a cero el paquete se descarta. Es la protección contra bucles.\n\nLa trama Ethernet NO TIENE TTL: no existe ese campo. Entonces la trama gira para siempre, a la velocidad del cable, multiplicándose en cada vuelta porque cada switch la copia por todos sus puertos.\n\nEso produce tres cosas:\n1 Una tormenta de broadcast que satura los enlaces en segundos.\n2 Las computadoras reciben la misma trama duplicada muchas veces.\n3 Y las tablas de direcciones de los switches se vuelven locas con MAC Flapping al ver la misma MAC entrando por puertos distintos. La red no se degrada: se cae por completo y no se recupera sola.",

  // Slide 12: Parte 4 - Spanning Tree Protocol (STP)
  "El protocolo que resuelve esto se llama Spanning Tree.\n\nLa idea es elegante: los switches se hablan entre ellos, arman un mapa de la red y sobre ese mapa calculan un árbol: un conjunto de caminos sin ningún círculo. A los enlaces que sobran los dejan bloqueados. Físicamente el cable sigue enchufado; lógicamente no pasa tráfico por él.\n\nPara lograrlo eligen primero un switch central (root bridge) por votación: gana el que tiene menor identificador (prioridad + MAC). Después cada uno calcula su mejor camino hacia la raíz y bloquea los puertos que no hacen falta (luz ámbar).\n\nY si el enlace principal se corta, Spanning Tree se da cuenta, recalcula el árbol y desbloquea el enlace de reserva solo, sin que nadie toque nada.\n\nAdemás, los switches Cisco corren PVST+: una instancia de Spanning Tree por cada VLAN. Permite configurar un switch como central para VLAN 10 y otro para VLAN 20, aprovechando ambos cables en vez de desperdiciar uno.",

  // Slide 13: Parte 4 - Demo Packet Tracer: Corte con la Tijera en Vivo
  "Vamos a verlo funcionando en Packet Tracer: esta es la topología en triángulo, tres switches conectados entre sí. Con el comando show spanning-tree vemos cuál quedó como central y qué puerto quedó bloqueado en ámbar. Está enchufado, pero no pasa tráfico porque Spanning Tree rompió el círculo.\n\nAhora dejo corriendo un ping continuo entre dos computadoras de extremos opuestos: responde normalmente.\n\nY acá viene la prueba: con la tijera de Packet Tracer corto el cable principal, en vivo.\n\nMiren lo que pasa: el ping se interrumpe unos segundos. El puerto que estaba en ámbar se pone verde: Spanning Tree lo acaba de habilitar. Y el ping vuelve a responder. La red se arregló sola.\n\nEsa espera es el tiempo de convergencia: en la versión original son entre 30 y 50 segundos; en Rapid Spanning Tree (802.1w) toma menos de un segundo.",

  // Slide 14: Cierre y Despedida Grupo Verde
  "Con esto cerramos. Vimos por qué una red plana no sirve, cómo se segmenta con VLANs, cómo viajan con la etiqueta 802.1Q, cómo se las hace dialogar con Router on a Stick y cómo se las protege con Spanning Tree. Todo en Packet Tracer, que es un simulador con sus límites, pero que deja ver cosas que en un laboratorio físico serían invisibles.\n\nEn el documento que dejamos están los temas que no entraron en los veinte minutos y los videos de las funciones que investigamos. Muchas gracias."
];

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

  updateSpeakerNotes();
  playStepBeep();
  handleSlideAutoActions();
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

function updateSpeakerNotes() {
  const content = document.getElementById('speakerNotesContent');
  if (content && speakerNotes[currentSlide]) {
    const formatted = speakerNotes[currentSlide]
      .split('\n\n')
      .map(p => `<p style="margin-bottom:0.75rem;">${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
    content.innerHTML = formatted;
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

const notesDrawer = document.getElementById('speakerNotesDrawer');
const btnNotesToggle = document.getElementById('btnNotesToggle');
const btnCloseNotes = document.getElementById('btnCloseNotes');
if (btnNotesToggle && notesDrawer) {
  btnNotesToggle.addEventListener('click', () => notesDrawer.classList.toggle('open'));
}
if (btnCloseNotes && notesDrawer) {
  btnCloseNotes.addEventListener('click', () => notesDrawer.classList.remove('open'));
}

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
  } else if (e.key.toLowerCase() === 'n') {
    if (notesDrawer) notesDrawer.classList.toggle('open');
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

  if (currentSlide === 13) {
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

