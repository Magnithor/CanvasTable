import {CanvasTable} from "mthb-canvas-table";
//import {Align, CanvasTableColumnConf} from "mthb-canvas-table";
const col:any[] = [
    {
        header: "Id",
        field: "__rownum__",
        width: 80,
        //align: Align.center
    },
    {
        header: "Name",
        field: "name",
        width: 200
    }
];
let data = [{name:'magni'},{name:'dagrún'}];
let canvasTable = new CanvasTable("canvas", data, <any>col);