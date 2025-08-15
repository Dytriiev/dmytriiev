import { Injectable } from '@nestjs/common';
// import fs from 'fs';
// import fs from 'node:fs/promises';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { Worker } from 'worker_threads';
import { availableParallelism } from 'node:os';
import { DataProcess } from './data.process.js';

@Injectable()
export class FileService {
  async upload(filesZipArr: Express.Multer.File[]) {
    const uploadDir: string = path.join(__dirname, '..', 'temp');
    const outloadDir: string = path.join(__dirname, '..', 'outLoad');
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
    ///////////////////////////
    const dataProcessBuffer = new SharedArrayBuffer(4);
    // const sharedState = { processed: 0, skipped: 0 };
    const bufferDataInt = new Int16Array(dataProcessBuffer, 0, 2);
    const dataProcess = new DataProcess(bufferDataInt);
    console.log('dataProcess', dataProcess);
    //////////////////////////

    const pendingWorkers: Promise<any>[] = [];
    const start = performance.now();
    for (const filePath of fileList) {
      if (pendingWorkers.length >= workers) {
        await Promise.race(pendingWorkers);
      }

      const fileName = path.basename(filePath);
      const outputPath = path.join(outloadDir, fileName);
      const workerPath = path.join(__dirname, 'worker_2.js');
      const filePromise = new Promise((resolve) => {
        // const worker = new Worker('./src/worker.js', {
        //   workerData: {
        //     name: 'Den',
        //     filePath: filePath,
        //     outputPath: outputPath,
        //     processedShared,
        //     skippedShared,
        //     fileName,
        //   },
        // });
        ///////////////////////////////////////
        const worker = new Worker(workerPath, {
          workerData: {
            name: 'Den',
            filePath: filePath,
            outputPath: outputPath,

            dataProcessBuffer,
            fileName,
            processedShared,
            skippedShared,
          },
        });
        /////////////////////////////////////////////////
        console.log('workerThreadId:', worker.threadId);
        const id = worker.threadId;
        // worker.on('message', (msg) => {
        //   console.log(msg);
        // });
        worker.on('message', (msg) => {
          console.log('message', msg);
          resolve(worker.threadId);
        });

        worker.on('exit', (code) => {
          console.log('exit', id, fileName, code);
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
      ////////////////////////////
      processed_1: bufferDataInt[0],
      skipped_2: bufferDataInt[1],
      ////////////////////////////
    };
  }
}
