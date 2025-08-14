export interface SharedState {
  process: number;
  skipped: number;
}

export class DataProcess {
  bufferData: Int32Array;
  state: SharedState;
  constructor(bufferData: Int32Array, state: SharedState) {
    this.bufferData = bufferData;
    this.state = state;
    this.bufferData[0] = this.state.process;
    this.bufferData[1] = this.state.skipped;
  }
  get process(): number {
    return Atomics.load(this.bufferData, 0);
  }
  get skipped(): number {
    return Atomics.load(this.bufferData, 1);
  }
  addProcess(): void {
    Atomics.add(this.bufferData, 0, 1);
  }
  addSkipped(): void {
    Atomics.add(this.bufferData, 1, 1);
  }
}
