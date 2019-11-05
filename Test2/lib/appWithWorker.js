"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mthb_offscreen_canvas_table_1 = require("mthb-offscreen-canvas-table");
const worker = new Worker('dist/worker.js');
const canvasTable = new mthb_offscreen_canvas_table_1.OffscreenCanvasTable(1, worker, "canvas");
worker.addEventListener('message', message => {
    console.log(message);
});
worker.postMessage('this is a test message to the worker');
var w = window;
w.canvasTable = canvasTable;
