import { Injectable } from '@nestjs/common';
// import fs from 'fs';
// import fs from 'node:fs/promises';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { Worker } from 'worker_threads';
import { availableParallelism } from 'node:os';
import pLimit from 'p-limit';

@Injectable()
export class LimitService {
  async upload(filesZipArr: Express.Multer.File[]) {
    const uploadDir = path.join(__dirname, '..', 'temp');
    const outloadDir = path.join(__dirname, '..', 'outload');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(outloadDir, { recursive: true });
    for (const file of filesZipArr) {
      const zip: AdmZip = new AdmZip(file.buffer);
      zip.extractAllTo(uploadDir, true);
    }
    const fileList = (
      await fs.readdir(uploadDir, { recursive: true, withFileTypes: true })
    )
      .filter((dirent) => dirent.isFile())
      .map((dirent) => path.join(dirent.parentPath, dirent.name));

    const skippedShared = new SharedArrayBuffer(4);
    const skipped = new Int32Array(skippedShared);
    const processedShared = new SharedArrayBuffer(4); // 4 байти = Int32
    const processed = new Int32Array(processedShared);
    const start = performance.now();
    const limit = pLimit(availableParallelism());
    const promises = fileList.map((filePath) =>
      limit(() =>
        this.processFile(
          filePath,
          outloadDir,
          processedShared,
          skippedShared,
          processed,
          skipped,
        ),
      ),
    );

    await Promise.allSettled(promises);
    const durationMs = performance.now() - start;
    await fs.rmdir(uploadDir, { recursive: true });
    return {
      processed: processed[0],
      skipped: skipped[0],
      durationMs: durationMs,
    };
  }

  async processFile(
    filePath: string,
    outloadDir: string,
    processedShared: SharedArrayBuffer,
    skippedShared: SharedArrayBuffer,
    processed: Int32Array<SharedArrayBuffer>,
    skipped: Int32Array<SharedArrayBuffer>,
  ) {
    const fileName = path.basename(filePath);
    const outputPath = path.join(outloadDir, fileName);
    return new Promise((resolve) => {
      const worker = new Worker('./src/worker.js', {
        workerData: {
          name: 'Den',
          filePath: filePath,
          outputPath: outputPath,
          processedShared,
          skippedShared,
          fileName,
        },
      });
      worker.on('exit', () => {
        console.log('exit:', processed, skipped);
        resolve(worker.threadId);
      });
      worker.on('error', (err) => {
        console.log(err.message);
        resolve(err.message);
      });
    });
  }
}
