import { CanvasTable, CanvasTableColumnConf, Align } from "mthb-canvas-table";

const col:CanvasTableColumnConf[] = [
    {
        header: "Id",
        field: "__rownum__",
        width: 80,
        align: Align.center
    },
    {
        header: "Name",
        field: "name",
        width: 200
    },
    {
        header: "LastName",
        field: "lastName",
        width: 200
    }
];
let data = [{name: 'Magni', lastName: 'Birgisson'}, {name: 'Dagrún', lastName: 'Þorsteinsdóttir'}];
const canvasTable = new CanvasTable("canvas", data, col);
let w = <any>window;
w.align = Align;