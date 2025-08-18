import { workerData, parentPort } from 'node:worker_threads';
import { Mutex } from 'async-mutex'
import sharp from 'sharp';
import { promises as fs } from 'fs';


const mutex = new Mutex();
async function Work() {
const release = await mutex.acquire();
const processed = new Int32Array(workerData.processedShared);
const skipped = new Int32Array(workerData.skippedShared)

try {
  console.log(`[${new Date().toISOString()}] Воркер стартовал`, workerData.fileName);
    console.log('worker', workerData.filePath)
const fileBuffer = await fs.readFile(workerData.filePath)
// console.log('buffer: ', fileBuffer)
await createThumbnail(fileBuffer, workerData.outputPath)
// const current = processed[0]
// processed[0] = current + 1
///
Atomics.add(processed, 0, 1);
} 
catch{
  // const skipped = new Int32Array(workerData.skippedShared)
  // const current = skipped[0]
  // skipped[0]= current + 1
  //
  Atomics.add(skipped, 0, 1);
}
finally {
  const result = {
    processed,
    skipped,
  }
  // parentPort.postMessage(result); 
  console.log('finally:')
    release();
 }
}
async function createThumbnail(fileBuffer: Buffer,  outputPath: string){
  await sharp(fileBuffer)
    .resize(150, 150, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
};
Work()

