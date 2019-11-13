import { CanvasTable } from './../CanvasTable/src/CanvasTable';
import { CustomCanvasTable } from './../share/CustomCanvasTable';
import { CanvasTableColumnConf, Sort, Align } from '../share/CanvasTableColum';
import { GroupItem } from '../share/CustomCanvasIndex';

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
function g1(v:GroupItem):string {
    return v.child.list.length.toString();
}
function g2(v:GroupItem):string {
    return v.child.list.length.toString();
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
var isGroup = true;
const group = function() {
    const expendedAll = document.getElementById("expendedAll");
    const collapseAll = document.getElementById("collapseAll");
    const groupDom = document.getElementById("group");
    if (!expendedAll || !collapseAll || !groupDom) { return; }
    if (isGroup) {
       canvasTable.setGroupBy();
       expendedAll.style.display = "none";
       collapseAll.style.display = "none";
       groupDom.innerText = "Group";
    } else {
       canvasTable.setGroupBy([{field:"country",aggregate:g1}, {field:"subcountry",aggregate:g2}]);
       expendedAll.style.display = "";
       collapseAll.style.display = "";
       groupDom.innerText = "Ungroup";
    }
    isGroup = !isGroup;
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

declare let data: { country: string, geonameid: number, name: string, subcountry: string }[];
// data = data.splice(1, 20);

const filter = <HTMLInputElement>document.getElementById("filter");
const canvasTable = new CanvasTable("canvas", data, col);
canvasTable.setRowColStyle(function(data:any, row: any, col: CanvasTableColumnConf, isOver: boolean, isSepra: boolean, dataRowCol: string){
    if (dataRowCol === "Iceland") {
        return { fontStyle: "bold", fontColor: "red",align:Align.center };
    }

    return null;
});
canvasTable.setFilter(function(data: any, row: any, col: CanvasTableColumnConf[]) {
    if (filter === null) { return true; }
    return !((row.country||'').indexOf(filter.value) === -1 && (row.name||'').indexOf(filter.value) === -1 && (row.subcountry||'').indexOf(filter.value) === -1);
});
canvasTable.setSort([{ col: col[2], sort: Sort.ascending }, {col:col[5], sort:Sort.ascending}]);
group();
canvasTable.addEvent("click", (row,col) => { console.log(row,col); });
canvasTable.addEvent("clickHeader", (col) => { console.log(col); });

if (filter != null) {
    filter.addEventListener("keyup", function(){
        canvasTable.askForReIndex();
    });
}

var w = (<any>window);
w.canvasTable = canvasTable;
w.onlyIceland = onlyIceland;
w.sortName = sortName;
w.col = col;
w.sort = sort;
w.group = group;


