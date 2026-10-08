/**
 * Executable model of the HD-GTLM 8-dimension interlock described in the
 * attached specification. This is a software state machine with the same
 * transition rules as the supplied Verilog. It is not a taped-out chip,
 * not a power measurement, and not a safety certification.
 */

export const LIMITS = {
  x: 0x73a,
  y: 0x4b0,
  z: 0x834,
  roll: 0x3b6,
  pitch: 0x3b6,
  yaw: 0x700,
  thermal: 0x3e8,
  torque: 0x640
} as const;

export type GtlmState = "BOOT" | "NOMINAL" | "LOCKDOWN";

export interface GtlmInput {
  x: number;
  y: number;
  z: number;
  roll: number;
  pitch: number;
  yaw: number;
  thermal: number;
  torque: number;
  reset: boolean;
  strobeHigh: boolean;
}

export interface GtlmOutput {
  state: GtlmState;
  relayEnable: boolean;
  drives: number[];
  fault: string | null;
}

const ZERO = [0, 0, 0, 0, 0, 0, 0, 0];

function clamp12(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 0xfff) {
    throw new Error("Input must be an integer in 0..4095.");
  }
  return n;
}

export function faultOf(input: GtlmInput): string | null {
  const checks: Array<[string, number, number]> = [
    ["x", input.x, LIMITS.x],
    ["y", input.y, LIMITS.y],
    ["z", input.z, LIMITS.z],
    ["roll", input.roll, LIMITS.roll],
    ["pitch", input.pitch, LIMITS.pitch],
    ["yaw", input.yaw, LIMITS.yaw],
    ["thermal", input.thermal, LIMITS.thermal],
    ["torque", input.torque, LIMITS.torque]
  ];
  for (const [name, value, limit] of checks) {
    clamp12(value);
    if (value > limit) return `${name} ${value} exceeds ${limit}`;
  }
  if (input.strobeHigh) return "wavefront strobe not valid";
  return null;
}

export class HdGtlmModel {
  state: GtlmState = "BOOT";

  step(input: GtlmInput): GtlmOutput {
    if (input.reset) {
      this.state = "BOOT";
      return { state: this.state, relayEnable: false, drives: [...ZERO], fault: "reset" };
    }
    if (this.state === "BOOT") {
      this.state = input.strobeHigh ? "BOOT" : "NOMINAL";
      return { state: this.state, relayEnable: false, drives: [...ZERO], fault: input.strobeHigh ? "waiting for strobe" : null };
    }
    if (this.state === "LOCKDOWN") {
      return { state: "LOCKDOWN", relayEnable: false, drives: [...ZERO], fault: "lockdown requires reset" };
    }
    const fault = faultOf(input);
    if (fault) {
      this.state = "LOCKDOWN";
      return { state: this.state, relayEnable: false, drives: [...ZERO], fault };
    }
    this.state = "NOMINAL";
    return {
      state: this.state,
      relayEnable: true,
      drives: [input.x, input.y, input.z, input.roll, input.pitch, input.yaw, input.thermal, input.torque],
      fault: null
    };
  }
}

export function nominalSample(): GtlmInput {
  return { x: 10, y: 10, z: 10, roll: 1, pitch: 1, yaw: 1, thermal: 20, torque: 20, reset: false, strobeHigh: false };
}
