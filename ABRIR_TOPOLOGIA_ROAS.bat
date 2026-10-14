@echo off
title Abriendo Topologia ROAS - Router on a Stick y VLANs
echo ========================================================
echo Abriendo Cisco Packet Tracer con Topologia ROAS (VLAN 10, 20, 30)...
echo ========================================================
if exist "%~dp0Topologia_ROAS_Router1941_6PCs.pkt" (
    start "" "C:\Users\Danie\Desktop\Telco\Packet Tracer\bin\PacketTracer6.exe" "%~dp0Topologia_ROAS_Router1941_6PCs.pkt"
) else (
    start "" "C:\Users\Danie\Desktop\Telco\Packet Tracer\bin\PacketTracer6.exe" "%~dp0Topologia_ROAS_6PCs.pkt"
)
exit
