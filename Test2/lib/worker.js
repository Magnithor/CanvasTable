"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mthb_offscreen_canvas_table_worker_1 = require("mthb-offscreen-canvas-table-worker");
function customDraw(canvasTable, context, rowIndex, col, left, top, right, bottom, width, height, r, dataValue, row, data) {
    context.fillStyle = "lightgreen";
    context.fillRect(left, top, width, height);
    context.strokeStyle = "red";
    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(right, bottom);
    context.moveTo(left, bottom);
    context.lineTo(right, top);
    context.stroke();
}
const col = [
    {
        header: "Id",
        field: "__rownum__",
        width: 80,
        align: mthb_offscreen_canvas_table_worker_1.Align.center
    },
    {
        header: "Render",
        field: "__rownum__",
        width: 80,
        renderer: customDraw,
        visible: true
    },
    {
        header: "Country",
        field: "country",
        width: 100
    },
    {
        header: "Id",
        field: "__rownum__",
        width: 30,
        align: mthb_offscreen_canvas_table_worker_1.Align.right
    },
    {
        header: "Name",
        field: "name",
        width: 200
    },
    {
        header: "Subcountry",
        field: "subcountry",
        width: 200
    },
    {
        header: "geonameid",
        field: "geonameid",
        width: 100,
        align: mthb_offscreen_canvas_table_worker_1.Align.right
    }
];
const offscreenCanvasTableWorker = new mthb_offscreen_canvas_table_worker_1.OffscreenCanvasTableWorker(1, col);
offscreenCanvasTableWorker.setSort([{ col: col[2], sort: mthb_offscreen_canvas_table_worker_1.Sort.ascending }, { col: col[5], sort: mthb_offscreen_canvas_table_worker_1.Sort.ascending }]);
offscreenCanvasTableWorker.setGroupBy(["country", "subcountry"]);
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        const data = JSON.parse(httpRequest.responseText);
        offscreenCanvasTableWorker.setData(data);
    }
};
httpRequest.open('GET', '../data.json', true);
httpRequest.send();
addEventListener('message', (message) => {
    if (message.data.mthbCanvasTable !== undefined) {
        offscreenCanvasTableWorker.message(message.data);
        return;
    }
    console.log('in webworker', message);
    postMessage('this is the response ' + message.data);
});
