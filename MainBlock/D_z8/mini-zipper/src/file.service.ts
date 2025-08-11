import { Injectable } from '@nestjs/common';
// import fs from 'fs';
// import fs from 'node:fs/promises';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { Worker } from 'worker_threads';
import { availableParallelism } from 'node:os';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File) {
    const uploadDir: string = path.join(__dirname, '..', 'temp');
    const outloadDir: string = path.join(__dirname, '..', 'outLoad');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(outloadDir, { recursive: true });

    const workers = availableParallelism();

    const zip: AdmZip = new AdmZip(file.buffer);
    zip.extractAllTo(uploadDir, true);
    const fileList = (await fs.readdir(uploadDir)).map((f) =>
      path.join(uploadDir, f),
    );
    // console.log(fileList);
    const skippedShared = new SharedArrayBuffer(4);
    const skipped = new Int32Array(skippedShared);
    const processedShared = new SharedArrayBuffer(4); // 4 байти = Int32
    const processed = new Int32Array(processedShared);

    const pendingWorkers: Promise<any>[] = [];
    const start = performance.now();
    for (const f of fileList) {
      if (pendingWorkers.length >= workers) {
        await Promise.race(pendingWorkers);
      }

      const fileName = path.basename(f);
      const outputPath = path.join(outloadDir, fileName);
      const filePromise = new Promise((resolve) => {
        const worker = new Worker('./src/worker.js', {
          workerData: {
            name: 'Den',
            buffer: f,
            outputPath: outputPath,
            processedShared,
            skippedShared,
            fileName,
          },
        });
        console.log('workerThreadId:', worker.threadId);
        worker.on('exit', () => {
          console.log('exit', processed, skipped, worker.threadId);
          resolve(worker.threadId);
        });
        worker.on('error', (err) => resolve({ error: err.message }));
      });
      pendingWorkers.push(filePromise);
    }
    await Promise.allSettled(pendingWorkers);
    const durationMs = performance.now() - start;
    await fs.rm(uploadDir, { recursive: true });
    return {
      processed: processed[0],
      skipped: skipped[0],
      durationMs,
    };
  }
}
