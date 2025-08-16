import { Injectable } from '@nestjs/common';
// import fs from 'fs';
// import fs from 'node:fs/promises';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { Worker } from 'worker_threads';
import { availableParallelism } from 'node:os';

@Injectable()
export class AppService {
  async upload(filesZipArr: Array<Express.Multer.File>) {
    const projectRoot = process.cwd();
    const uploadDir: string = path.join(projectRoot, 'temp');
    console.log('uploadDir:', uploadDir);
    const outloadDir: string = path.join(projectRoot, 'outLoad');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(outloadDir, { recursive: true });

    const workers = availableParallelism();
    for (const file of filesZipArr) {
      const zip: AdmZip = new AdmZip(file.buffer);
      zip.extractAllTo(uploadDir, true);
    }
    const fileList = (
      await fs.readdir(uploadDir, { recursive: true, withFileTypes: true })
    )
      .filter((dirent) => dirent.isFile())
      .map((dirent) => path.join(dirent.parentPath, dirent.name));
    // console.log(fileList);
    const skippedShared = new SharedArrayBuffer(4);
    const skipped = new Int32Array(skippedShared);
    const processedShared = new SharedArrayBuffer(4); // 4 байти = Int32
    const processed = new Int32Array(processedShared);

    const res: Array<PromiseSettledResult<any>> = [];
    try {
      const start = performance.now();
      for (let i = 0; i < fileList.length; i += workers) {
        const fileGroup = fileList.slice(i, i + workers);
        // console.log('fileGroup', fileGroup);
        const filePromices = fileGroup.map((filePath) =>
          this.processFile(
            filePath,
            outloadDir,
            processedShared,
            skippedShared,
            processed,
            skipped,
          ),
        );
        // console.log('filePromices:', filePromices);
        res.push(...(await Promise.allSettled(filePromices)));
      }
      // console.log('RESULT:', processed, skipped);
      const durationMs = performance.now() - start;
      await fs.rm(uploadDir, { recursive: true });

      // console.log('res', res);
      return {
        processed: processed[0],
        skipped: skipped[0],
        durationMs: durationMs,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async processFile(
    filePath: string,
    outloadDir: string,
    processedShared: SharedArrayBuffer,
    skippedShared: SharedArrayBuffer,
    processed: Int32Array<SharedArrayBuffer>,
    skipped: Int32Array<SharedArrayBuffer>,
  ): Promise<any> {
    try {
      const fileName = path.basename(filePath);
      const outputPath = path.join(outloadDir, fileName);
      const workerPath = path.join(__dirname, '../../workers/dist/worker.js');
      return new Promise((resolve) => {
        console.log('new Promise');
        console.log('WorkerPath:', workerPath);
        const worker = new Worker(workerPath, {
          workerData: {
            name: 'Den',
            filePath: filePath,
            outputPath: outputPath,
            processedShared,
            skippedShared,
            fileName,
          },
        });
        console.log('workerThreadId:', worker.threadId);
        // worker.on('message', resolve);
        worker.on('exit', () => {
          console.log('exit', processed, skipped, worker.threadId);
          resolve(worker.threadId);
        });
        worker.on('error', (err) => resolve({ error: err.message }));
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      return { error: err.message };
    }
  }
}
