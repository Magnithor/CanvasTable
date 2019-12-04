import { CanvasTable, ICanvasTableColumnConf, Align } from "mthb-canvas-table";

const col:ICanvasTableColumnConf[] = [
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
const canvasTable = new CanvasTable("canvas", col, data);
let w = <any>window;
w.align = Align;