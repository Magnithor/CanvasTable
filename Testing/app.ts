import { CanvasTable } from './../CanvasTable/src/CanvasTable';
import { CanvasTableColumnConf, Align, Sort, CustomCanvasTable } from './../share/CustomCanvasTable';

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

const onlyIceland = function (data: any, row: any, col: CanvasTableColumnConf[]): boolean {
    return row.country === "Iceland";
}
const sortName = function (data: any, rowA: any, rowB: any) {
    return rowA.name.localeCompare(rowB.name);
}
const sort = function () {
    canvasTable.setSort([{ col: col[6], sort: Sort.ascending }, { col: col[5], sort: Sort.ascending }, { col: col[4], sort: Sort.ascending }]);
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
        visible: false
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

declare let data: { country: string, geonameid: number, name: string, subcountry: string }[];
// data = data.splice(1, 20);

const canvasTable = new CanvasTable("canvas", data, col);
// canvasTable.setSort([{ col: col[2], sort: Sort.ascending }, {col:col[5], sort:Sort.ascending}]);
// canvasTable.setGroupBy(["country", "subcountry"]);
var w = (<any>window);
w.canvasTable = canvasTable;
w.onlyIceland = onlyIceland;
w.sortName = sortName;
w.col = col;
w.sort = sort;


