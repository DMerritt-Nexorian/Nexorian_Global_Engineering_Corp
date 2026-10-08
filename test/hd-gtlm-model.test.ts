
import assert from "assert";
import { HdGtlmModel, LIMITS, nominalSample } from "../src/lib/hd-gtlm-model";

const model = new HdGtlmModel();
const reset = model.step({ ...nominalSample(), reset: true });
assert.strictEqual(reset.state, "BOOT");
assert.strictEqual(reset.relayEnable, false);

const boot = model.step({ ...nominalSample(), strobeHigh: true });
assert.strictEqual(boot.state, "BOOT");

const released = model.step(nominalSample());
assert.strictEqual(released.state, "NOMINAL");
assert.strictEqual(released.relayEnable, false);

const driving = model.step(nominalSample());
assert.strictEqual(driving.state, "NOMINAL");
assert.strictEqual(driving.relayEnable, true);
assert.deepStrictEqual(driving.drives, [10, 10, 10, 1, 1, 1, 20, 20]);

const tripped = model.step({ ...nominalSample(), x: LIMITS.x + 1 });
assert.strictEqual(tripped.state, "LOCKDOWN");
assert.strictEqual(tripped.relayEnable, false);
assert.ok(tripped.fault && tripped.fault.includes("x"));

const held = model.step(nominalSample());
assert.strictEqual(held.state, "LOCKDOWN");
assert.strictEqual(held.relayEnable, false);

console.log("hd-gtlm interlock model passed");
