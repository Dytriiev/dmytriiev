import { workerData, parentPort } from 'node:worker_threads';
import { Mutex } from 'async-mutex';
import sharp from 'sharp';
// const { parentPort, workerData } = require('worker_threads');
// const sharp = require('sharp');
// const  Mutex = require('acync-mutex')


const mutex = new Mutex();
const release = await mutex.acquire();
const processed = new Int32Array(workerData.processedShared);
const skipped = new Int32Array(workerData.skippedShared)

try {
  console.log(`[${new Date().toISOString()}] Воркер стартовал`, workerData.fileName);
    console.log('worker', workerData.name)
// console.log('workerBuffer', workerData.buffer)
// console.log('outputPath', workerData.outputPath)
// console.log('processed', workerData.processedShared)
// const processed = new Int32Array(workerData.processedShared);
// console.log('processed', processed)
await createThumbnail(workerData.buffer, workerData.outputPath)
const current = processed[0]
processed[0] = current + 1
} 
catch{
  // const skipped = new Int32Array(workerData.skippedShared)
  const current = skipped[0]
  skipped[0]= current + 1
}
finally {
  const result = {
    processed,
    skipped,
  }
  parentPort.postMessage(result); 
  console.log('finally:')
    release();
}


// Создание thumbnail с сохранением пропорций
async function createThumbnail(sharedArray,  outputPath){
  await sharp(sharedArray)
    .resize(150, 150, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
};

