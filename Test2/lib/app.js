"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mthb_canvas_table_1 = require("mthb-canvas-table");
//import {Align, CanvasTableColumnConf} from "mthb-canvas-table";
const col = [
    {
        header: "Id",
        field: "__rownum__",
        width: 80,
    },
    {
        header: "Name",
        field: "name",
        width: 200
    }
];
let data = [{ name: 'magni' }, { name: 'dagrún' }];
let canvasTable = new mthb_canvas_table_1.CanvasTable("canvas", data, col);
