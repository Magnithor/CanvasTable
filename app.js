"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CanvasTable_1 = require("./Script/CanvasTable");
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
const onlyIceland = function (data, row, col) {
    return row.country === "Iceland";
};
const sortName = function (data, rowA, rowB) {
    return rowA.name.localeCompare(rowB.name);
};
const sort = function () {
    canvasTable.SetSort([{ col: col[6], sort: CanvasTable_1.Sort.ascending }, { col: col[5], sort: CanvasTable_1.Sort.ascending }, { col: col[4], sort: CanvasTable_1.Sort.ascending }]);
};
const col = [
    {
        header: "Id",
        field: "__rownum__",
        width: 80,
        align: CanvasTable_1.Align.center
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
        align: CanvasTable_1.Align.right
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
        align: CanvasTable_1.Align.right
    }
];
// data = data.splice(1, 20);
const canvasTable = new CanvasTable_1.CanvasTable("canvas", data, col);
var w = window;
w.canvasTable = canvasTable;
w.onlyIceland = onlyIceland;
w.sortName = sortName;
w.col = col;
w.sort = sort;

//# sourceMappingURL=app.js.map