# CÁTEDRA DE TELEINFORMÁTICA Y REDES DE DATOS - GRUPO VERDE
## GUÍA PEDAGÓGICA Y MANUAL DE EXPOSICIÓN EN CISCO PACKET TRACER
### De la Red Plana a la Alta Disponibilidad (VLANs, 802.1Q, ROAS y Spanning Tree)

**Equipo Exponente:** Grupo Verde  
**Duración Total Estimada:** 20 a 22 minutos  
**Herramienta de Demostración:** Cisco Packet Tracer  

---

## ESTRUCTURA Y TIEMPOS DE LA EXPOSICIÓN

| Módulo | Tema Central | Expositor | Tiempo Estimado |
| :--- | :--- | :--- | :--- |
| **Intro** | Planteo del problema: La Red Plana (Ruido y Seguridad) | Elu | ~1 min 20 s |
| **Parte 1** | VLANs: De la red plana a la segmentación y Demo PT | Compañero 2 | ~4 min 15 s |
| **Parte 2** | Troncales y 802.1Q: Cómo viaja la etiqueta y Demo PT | Sebita | ~4 min 45 s |
| **Parte 3** | Router-on-a-Stick y DHCP: Que se hablen y Demo PT | Compañero 4 | ~5 min 00 s |
| **Parte 4** | Redundancia y Spanning Tree: La mecha y Demo PT | Compañero 5 | ~5 min 42 s |

---

## GUION DETALLADO Y CONTENIDO DE CADA DIAPOSITIVA

### INTRODUCCIÓN — El Problema de la Red Plana (~1:20)
* **Diapositiva 0 (Portada):** Presentación del Grupo Verde y de la herramienta Cisco Packet Tracer.
* **Diapositiva 1 (La Red Plana):**
  * **El Escenario:** Una empresa con 500 computadoras en la misma red.
  * **Problema 1 - El Ruido:** Mensajes de difusión (broadcast) que el switch copia por todos sus puertos. Las 500 máquinas desperdician CPU y ancho de banda leyendo tramas que no eran para ellas.
  * **Problema 2 - La Seguridad:** Sin aislamiento perimetral; una notebook en la sala de visitas queda en el mismo dominio que el servidor de Recursos Humanos.
  * **La Solución:** Las VLANs dividen la red física en varias redes lógicas usando el mismo equipo.

---

### PARTE 1 — VLANs: De la Red Plana a la Segmentación (~4:15)
* **Diapositiva 2 (Concepto y Beneficios):**
  * **¿Qué hace un switch?:** Aprende direcciones MAC físicas y reenvía por puerto específico. Pero el broadcast lo copia a todos: por defecto, un switch entero es un solo dominio de difusión.
  * **Definición de VLAN:** Dominio de difusión independiente creado por software dentro de un switch físico.
  * **Ejemplo Práctico:** Puertos 1 al 12 en VLAN 10 (Admin), puertos 13 al 24 en VLAN 20 (Ventas). Dos switches lógicos en uno solo.
  * **4 Beneficios Clave:**
    1. *Rendimiento:* Ruido contenido en su propio dominio.
    2. *Seguridad:* Sin comunicación directa entre VLANs.
    3. *Flexibilidad:* Agrupación por función laboral, no por escritorio.
    4. *Costo:* 1 solo conmutador de calidad en lugar de muchos switches pequeños.
  * **Tipos de VLAN:** Datos, Voz sobre IP, y Gestión (para administrar equipos).
* **Diapositiva 3 (Demostración en Packet Tracer):**
  * Topología: 1 Switch 2950 con 4 computadoras asignadas a VLAN 10 y VLAN 20.
  * Comando: `show vlan brief` para auditar puertos en consola.
  * Prueba de Ping: Intra-VLAN responde de inmediato; inter-VLAN (a 30 cm en el mismo switch) da *Request timed out*.
  * **Herramienta Destacada de PT:** La lupa (*Inspect tool*), que permite ver tablas CAM y de VLANs en vivo sin escribir comandos.

---

### PARTE 2 — Troncales y 802.1Q: Cómo Viaja la Etiqueta (~4:45)
* **Diapositiva 4 (El Enlace Troncal):**
  * **El Escenario:** Universidad con dos edificios y tres carreras (Sistemas, Diseño, Administración).
  * **Inviabilidad del Cableado Dedicado:** 1 cable por cada VLAN exigiría decenas de cables y puertos entre edificios.
  * **Puerto de Acceso:** Asignado a una sola VLAN para terminales. Tramas limpias sin etiqueta.
  * **Puerto Troncal (Trunk):** Transporta múltiples VLANs por un único cable físico multiplexado.
* **Diapositiva 5 (Despiece de la Etiqueta IEEE 802.1Q):**
  * Se insertan **4 Bytes (32 bits)** dentro de la trama Ethernet tras la MAC origen:
    * **TPID (16 bits):** `0x8100` en hexadecimal (aviso de etiqueta).
    * **PCP (3 bits):** Prioridad QoS (voz sobre descargas).
    * **DEI (1 bit):** Bandera de descarte en congestión.
    * **VID (12 bits):** Identificador de VLAN ($2^{12} = 4096$ identificadores).
* **Diapositiva 6 (Demostración en Packet Tracer):**
  * **Modo Simulación:** Frena el tiempo y permite inspeccionar el sobre paso a paso.
  * **Inbound PDU Details:** Muestra en hexadecimal la etiqueta 802.1Q en el troncal y cómo el switch se la quita al entregarla en un puerto de acceso.
  * **Función Investigada:** *Complex PDU* (icono del sobre abierto) para fabricar paquetes a mano y probar errores en la red.

---

### PARTE 3 — Router-on-a-Stick y DHCP: Que se Hablen (~5:00)
* **Diapositiva 7 (El Salto a Capa 3):**
  * Las VLANs aíslan tanto que Contabilidad no llega al servidor de archivos.
  * El switch trabaja en Capa 2 (MACs); no lee ni modifica IPs.
  * La PC detecta que el destino está en otra red y envía el paquete al **Default Gateway** (MAC del router).
  * Un cable físico por VLAN al router no escala (los routers solo tienen 2 a 4 puertos).
* **Diapositiva 8 (Arquitectura ROAS y DHCP):**
  * **Router-on-a-Stick:** 1 solo cable troncal entre switch y router.
  * La interfaz física (ej. `GigabitEthernet0/0`) se divide en subinterfaces lógicas (`.10` y `.20`).
  * Cada subinterfaz lleva `encapsulation dot1Q <VID>` y la IP de Default Gateway.
  * **DHCP Integrado:** El router asigna IP, máscara y puerta de enlace automáticamente al encenderse las máquinas.
* **Diapositiva 9 (Demostración en Packet Tracer):**
  * El ping inter-VLAN ahora responde exitosamente.
  * PCs configuradas por DHCP sin ingresar direcciones a mano.
  * Tabla de ruteo visible con la lupa (*Inspect tool*).
  * **Investigación:** Packet Tracer es simulador (no emulador como GNS3/EVE-NG). Novedades: modo multiusuario y PT v9 con equipos industriales.

---

### PARTE 4 — Redundancia y Spanning Tree (~5:42)
* **Diapositiva 10 (La Paradoja de la Redundancia):**
  * Depender de un solo cable es un Punto Único de Falla (SPOF).
  * Conectar switches en triángulo da redundancia, pero sin control destruye la red.
* **Diapositiva 11 (¿Por qué Ethernet no tiene TTL?):**
  * IPv4 tiene **TTL** decremental protector; **Ethernet NO TIENE TTL**.
  * Una trama de broadcast en un círculo gira eternamente a la velocidad del medio físico.
  * Tres catástrofes: Tormenta de broadcast, tramas duplicadas y MAC Flapping (tablas enloquecidas).
* **Diapositiva 12 (Spanning Tree Protocol y PVST+):**
  * Los switches calculan un árbol sin círculos y bloquean puertos redundantes (**luz ámbar**).
  * Elección del *Root Bridge* por menor Bridge ID (Prioridad + MAC).
  * Ante una falla, STP recalcula y desbloquea el puerto ámbar en caliente.
  * **Cisco PVST+:** Un árbol por cada VLAN para aprovechar ambos cables en lugar de desperdiciar uno.
* **Diapositiva 13 (Demostración en Packet Tracer):**
  * Topología en triángulo con `show spanning-tree` mostrando el puerto ámbar.
  * Ping continuo corriendo en vivo.
  * **Corte con la Tijera de Packet Tracer:** El ping se detiene unos segundos, el puerto ámbar pasa a verde automáticamente y el ping se restablece solo.
  * Tiempos de convergencia: STP tradicional (30-50 s) vs Rapid STP 802.1w (< 1 s).
* **Diapositiva 14 (Conclusión y Cierre):**
  * Síntesis integradora de los 4 pilares: VLANs, Troncales, ROAS y STP.
  * Agradecimiento final por parte del Grupo Verde.
