// Unreal's Wasm preview reads four array slots. Chrome can leave holes and put
// the only connected Xbox controller at index 4 or higher. Give native input
// stable logical slots while retaining the original Gamepad objects and controls.
(() => {
  if (!navigator.getGamepads || window.sandSailsGamepads) return;
  const readBrowser = navigator.getGamepads.bind(navigator);
  const assignments = new Map();
  const capacity = 4;
  function readNative() {
    const pads = Array.from(readBrowser()).filter(pad => pad && pad.connected && pad.mapping === 'standard');
    const present = new Set(pads.map(pad => pad.index));
    for (const index of assignments.keys()) if (!present.has(index)) assignments.delete(index);
    const occupied = new Set(assignments.values());
    for (const pad of pads) {
      if (assignments.has(pad.index)) continue;
      const available = Array.from({length:capacity}, (_,slot) => slot).find(slot => !occupied.has(slot));
      if (available === undefined) break;
      assignments.set(pad.index, available);
      occupied.add(available);
      console.info(`Sand Sails controller: browser index ${pad.index} -> native slot ${available} (${pad.id})`);
    }
    const slots = Array(capacity).fill(null);
    for (const pad of pads) if (assignments.has(pad.index)) slots[assignments.get(pad.index)] = pad;
    return slots;
  }
  Object.defineProperty(navigator, 'getGamepads', {configurable:true, writable:true, value:readNative});
  window.sandSailsGamepads = {readBrowser, assignments:() => Array.from(assignments.entries())};
})();
