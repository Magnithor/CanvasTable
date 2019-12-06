import { OffscreenCanvasTableWorker } from "../OffscreenCanvasTableWorker/src/OffscreenCanvasTableWorker";
import { Align, ICanvasTableColumnConf, Sort } from "../share/CanvasTableColum";
import { CustomCanvasTable } from "../share/CustomCanvasTable";

declare function postMessage(message: any): void;

function customDraw(canvasTable: CustomCanvasTable, context: CanvasRenderingContext2D, rowIndex: number,
                    col: ICanvasTableColumnConf, left: number, top: number, right: number, bottom: number,
                    width: number, height: number, r: number, dataValue: any, row: any, data: any): void {
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

const column: ICanvasTableColumnConf[] = [
    {
        align: Align.center,
        field: "__rownum__",
        header: "Id",
        width: 80,
    },
    {
        field: "__rownum__",
        header: "Render",
        renderer: customDraw,
        visible: true,
        width: 80,
    },
    {
        field: "country",
        header: "Country",
        width: 100,
    },
    {
        align: Align.right,
        field: "__rownum__",
        header: "Id",
        width: 30,
    },
    {
        field: "name",
        header: "Name",
        width: 200,
    },
    {
        field: "subcountry",
        header: "Subcountry",
        width: 200,
    },
    {
        align: Align.right,
        field: "geonameid",
        header: "geonameid",
        width: 100,
    },
];

let filter = "";
const offscreenCanvasTableWorker = new OffscreenCanvasTableWorker(1, column);
offscreenCanvasTableWorker.setAllowEdit(true);
offscreenCanvasTableWorker.setSort([
    { col: column[2], sort: Sort.ascending },
    { col: column[5], sort: Sort.ascending },
]);
offscreenCanvasTableWorker.setFilter( (data: any, row: any, col: ICanvasTableColumnConf[]) => {
    if (filter === null) { return true; }
    return !((row.country || "").indexOf(filter) === -1 && (row.name || "").indexOf(filter) === -1 && (row.subcountry || "").indexOf(filter) === -1);
});

const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        const data = JSON.parse(httpRequest.responseText);
        offscreenCanvasTableWorker.setData(data);
    }
};

httpRequest.open("GET", "../data.json", true);
httpRequest.send();

addEventListener("message", (message) => {
    if (message.data.mthbCanvasTable !== undefined) {
        offscreenCanvasTableWorker.message(message.data);
        return;
    }
    if (message.data.filter) {
        filter = message.data.filter;
        offscreenCanvasTableWorker.askForReIndex();
    }

    console.log("in webworker", message);
    postMessage("this is the response " + message.data);
});
