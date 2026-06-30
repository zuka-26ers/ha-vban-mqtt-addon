import mqtt from 'mqtt';
import dgram from 'dgram';
import fs from 'fs';

// Load Home Assistant add-on options
const config = JSON.parse(fs.readFileSync('/data/options.json', 'utf8'));

const MQTT_PREFIX = config.mqtt?.prefix ?? 'vban';
const VBAN_HOST = config.vban?.host ?? '127.0.0.1';
const VBAN_PORT = config.vban?.port ?? 6980;

const client = mqtt.connect('mqtt://localhost:1883');
const udp = dgram.createSocket('udp4');

function sendVBAN(text) {
  const msg = Buffer.from(text);
  udp.send(msg, VBAN_PORT, VBAN_HOST);
}

function topic(...parts) {
  return [MQTT_PREFIX, ...parts].join('/');
}

client.on('connect', () => {
  console.log('MQTT connected');

  client.subscribe(`${MQTT_PREFIX}/#`);

  // minimal discovery example (expand later)
  publishDiscovery();
});

client.on('message', (t, payload) => {
  const value = payload.toString();

  console.log('MQTT:', t, value);

  // strip gain
  const matchGain = t.match(/strip\/(\d+)\/gain/);
  if (matchGain) {
    const i = matchGain[1];
    sendVBAN(`Strip(${i}).gain=${value};`);
  }

  // strip mute
  const matchMute = t.match(/strip\/(\d+)\/mute/);
  if (matchMute) {
    const i = matchMute[1];
    sendVBAN(`Strip(${i}).mute=${value};`);
  }

  // bus mute
  const matchBusMute = t.match(/bus\/(\d+)\/mute/);
  if (matchBusMute) {
    const i = matchBusMute[1];
    sendVBAN(`Bus(${i}).mute=${value};`);
  }

  // restart
  if (t.endsWith('/restart')) {
    sendVBAN('Command.Restart=1;');
  }
});

function publishDiscovery() {
  const base = `${MQTT_PREFIX}`;

  // example entity: strip 0 gain
  client.publish(
    `homeassistant/number/${MQTT_PREFIX}_strip_0_gain/config`,
    JSON.stringify({
      name: "VBAN Strip 0 Gain",
      command_topic: `${base}/strip/0/gain`,
      state_topic: `${base}/strip/0/gain/state`,
      min: -60,
      max: 12,
      step: 1,
      unique_id: `${MQTT_PREFIX}_strip_0_gain`
    }),
    { retain: true }
  );

  // mute switch
  client.publish(
    `homeassistant/switch/${MQTT_PREFIX}_strip_0_mute/config`,
    JSON.stringify({
      name: "VBAN Strip 0 Mute",
      command_topic: `${base}/strip/0/mute`,
      state_topic: `${base}/strip/0/mute/state`,
      unique_id: `${MQTT_PREFIX}_strip_0_mute`
    }),
    { retain: true }
  );

  // restart button
  client.publish(
    `homeassistant/button/${MQTT_PREFIX}_restart/config`,
    JSON.stringify({
      name: "VBAN Restart",
      command_topic: `${base}/restart`,
      unique_id: `${MQTT_PREFIX}_restart`
    }),
    { retain: true }
  );
}
