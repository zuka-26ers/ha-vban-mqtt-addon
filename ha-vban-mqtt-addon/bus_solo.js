export function applyBusSolo(target, buses, sendVBAN) {
  buses.forEach(b => {
    const mute = (`Bus${b}` === target) ? 0 : 1;
    sendVBAN(`Bus(${b}).mute=${mute};`);
  });
}
