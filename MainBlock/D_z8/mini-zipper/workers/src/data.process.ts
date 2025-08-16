export interface SharedState {
  processed: number;
  skipped: number;
}

export class DataProcess {
  bufferData: Int16Array;
  // state: SharedState;
  constructor(bufferData: Int16Array) {
    this.bufferData = bufferData;
    // this.bufferData[0] = state.processed;
    // this.bufferData[1] = state.skipped;
  }
  get processed(): number {
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
