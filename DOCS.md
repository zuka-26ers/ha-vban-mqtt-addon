# VBAN MQTT Bridge Add-on

Home Assistant Add-on that bridges MQTT to Voicemeeter VBAN (UDP text protocol).

---

## Configuration

### vban
- host: Voicemeeter machine IP
- port: 6980

### mqtt
- prefix: MQTT topic prefix

### strip
Array of strip indexes

### bus
Array of bus indexes

---

## Features

- MQTT → VBAN control
- Strip mute/gain/solo
- Bus mute/gain
- Bus solo (select-based pseudo solo)
- Restart command

---

## MQTT Topics
