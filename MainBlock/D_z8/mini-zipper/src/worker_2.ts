import { workerData, parentPort } from 'node:worker_threads';
import { Mutex, MutexInterface } from 'async-mutex';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { DataProcess } from './data.process';

const mutex = new Mutex();

async function Work() {
  const release = await mutex.acquire();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const processed = new Int32Array(workerData.processedShared);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const skipped = new Int32Array(workerData.skippedShared);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const dataProcessBufferInt = new Int16Array(workerData.dataProcessBuffer);

  const dataProcess = new DataProcess(dataProcessBufferInt);
  try {
    console.log(
      `[${new Date().toISOString()}] Воркер стартовал`,
      workerData.fileName,
    );
    console.log('worker', workerData.filePath);
    const fileBuffer = await fs.readFile(workerData.filePath);
    // console.log('buffer: ', fileBuffer);

    await createThumbnail(fileBuffer, workerData.outputPath);
    // const current = processed[0]
    // processed[0] = current + 1
    ///
    dataProcess.addProcess();
    Atomics.add(processed, 0, 1);
  } catch {
    // const skipped = new Int32Array(workerData.skippedShared)
    // const current = skipped[0]
    // skipped[0]= current + 1
    //
    dataProcess.addSkipped();
    Atomics.add(skipped, 0, 1);
  } finally {
    const result = {
      processed: dataProcess.processed,
      skipped: dataProcess.skipped,
    };
    parentPort?.postMessage(result);
    console.log('finally:');
    release();
  }
}

// Создание thumbnail с сохранением пропорций
async function createThumbnail(fileBuffer: Buffer, outputPath: string) {
  console.log('outPutPath: ', outputPath);
  console.log('fileBuffer:', fileBuffer);
  await sharp(fileBuffer)
    .resize(150, 150, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}
Work();
