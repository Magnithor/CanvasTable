/*
import { OffscreenCanvasTableWorker } from './../src/OffscreenCanvasTableWorker';
import { CanvasTableColumnConf, Align, CustomCanvasTable, Sort } from './../src/CustomCanvasTable';

function customDraw(canvasTable: CustomCanvasTable, context: CanvasRenderingContext2D, rowIndex: number, col: CanvasTableColumnConf, left: number, top: number, right: number, bottom: number, width: number, height: number, r: number, dataValue: any, row: any, data: any): void {
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

const col: CanvasTableColumnConf[] = [
    {
        header: "Id",
        field: "__rownum__",
        width: 80,
        align: Align.center
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
        align: Align.right
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
        align: Align.right
    }
];
const offscreenCanvasTableWorker = new OffscreenCanvasTableWorker(1, col);
offscreenCanvasTableWorker.setSort([{ col: col[2], sort: Sort.ascending }, {col:col[5], sort:Sort.ascending}]);
offscreenCanvasTableWorker.setGroupBy(["country", "subcountry"]);


const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
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
*/