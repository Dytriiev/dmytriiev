export interface SharedState {
  processed: number;
  skipped: number;
}

export class DataProcess {
  bufferData: Int16Array;
  constructor(bufferData: SharedArrayBuffer) {
    this.bufferData = new Int16Array( bufferData,0,2);
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
  get state():SharedState {
    return {
      processed: this.processed,
      skipped: this.skipped,
    }
  }
}
