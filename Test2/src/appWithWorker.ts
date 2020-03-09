
import { OffscreenCanvasTable } from 'mthb-offscreen-canvas-table';

const worker = new Worker('dist/worker.js');
const canvasTable = new OffscreenCanvasTable(1, worker, "canvas");

worker.addEventListener('message', message => {
});

worker.postMessage('this is a test message to the worker');


var w = (<any>window);
w.canvasTable = canvasTable;
