# HA VBAN MQTT Add-on

Home Assistant Add-on (Node.js) that bridges MQTT ⇄ VBAN (Voicemeeter Potato) via UDP text commands.

## Architecture

```
Home Assistant
   ├─ MQTT (Discovery + State)
   └─ Add-on (Node.js)
          ├─ MQTT Subscribe
          ├─ MQTT Publish (Discovery)
          └─ VBAN Text UDP
                 ↓
        Voicemeeter Potato (Windows)
```

## Features

- MQTT Discovery (Home Assistant compatible)
- Strip / Bus control
  - mute
  - solo (strip only)
  - gain (number slider)
- Bus pseudo-solo via select helper
- Restart command button
- Configurable MQTT prefix

## MQTT Topics

Example (prefix: `vban`):

```
vban/strip/0/mute
vban/strip/0/gain
vban/bus/0/mute
vban/restart
```

## Entity Examples

```
switch.vban_strip_0_mute
number.vban_strip_0_gain
select.vban_bus_solo_select
button.vban_restart
```

## Gain Range

- min: -60
- max: +12
- step: 1 (configurable 0.5 optional)
- mode: slider

## Install

1. Add repository to Home Assistant Add-on Store
2. Install add-on
3. Configure `config.yaml`
4. Start add-on

## License
MIT
