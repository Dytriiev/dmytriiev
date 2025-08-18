import { workerData, parentPort } from 'node:worker_threads';
import { Mutex, MutexInterface } from 'async-mutex';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { DataProcess } from './data.process';
const mutex = new Mutex();

async function Work() {
  const release = await mutex.acquire();
  const processed = new Int32Array(workerData.processedShared);
  const skipped = new Int32Array(workerData.skippedShared);
  const dataProcess = new DataProcess(workerData.dataProcessBuffer);
  try {
    console.log(
      `[${new Date().toISOString()}] Воркер стартовал`,
      workerData.fileName,
    );
    console.log('worker', workerData.filePath);
    const fileBuffer = await fs.readFile(workerData.filePath);

    await createThumbnail(fileBuffer, workerData.outputPath);
    dataProcess.addProcess();
    Atomics.add(processed, 0, 1);
  } catch {
    dataProcess.addSkipped();
    Atomics.add(skipped, 0, 1);
  } finally {
    const result = dataProcess.state
    parentPort?.postMessage(result);
    console.log('finally:');
    release();
  }
}

async function createThumbnail(fileBuffer: Buffer, outputPath: string) {
  await sharp(fileBuffer)
    .resize(150, 150, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}
Work();


