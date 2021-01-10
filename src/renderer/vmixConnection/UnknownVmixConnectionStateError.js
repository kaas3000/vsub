import VmixConnectionState from "./vmixConnectionState";

export default class UnknownVmixConnectionStateError extends Error {
  constructor(connectionState) {
    const states = Object.keys(VmixConnectionState).join(", ");
    super(
      `${connectionState} is not a valid vmix connection state. Valid states are ${states}`
    );
    this.name = "UnknownVmixConnectionStateError";
  }
}
