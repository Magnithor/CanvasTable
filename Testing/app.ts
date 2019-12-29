import { Align, ICanvasTableColumnConf, Sort } from "../share/CanvasTableColum";
import { IGroupItem } from "../share/CustomCanvasIndex";
import { CanvasTable, ICanvasContext2D } from "./../CanvasTable/src/CanvasTable";
import { CustomCanvasTable } from "./../share/CustomCanvasTable";

interface IData {
    country: string;
    geonameid: number;
    name: string;
    subcountry: string;
 }

function customDraw(canvasTable1: CustomCanvasTable, context: CanvasRenderingContext2D,
                    rowIndex: number, col: ICanvasTableColumnConf, left: number, top: number,
                    right: number, bottom: number, width: number, height: number, r: number,
                    dataValue: any, row: any, dbData: any): void {
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

function g1(v: IGroupItem): string {
    return v.child.list.length.toString();
}

function g2(v: IGroupItem): string {
    return v.child.list.length.toString();
}

const onlyIceland = (dbData: any, row: any, col: ICanvasTableColumnConf[]): boolean => {
    return row.country === "Iceland";
};
const sortName = (dbData: any, rowA: any, rowB: any) => {
    return rowA.name.localeCompare(rowB.name);
};
const sort = () => {
    canvasTable.setSort([
        { col: column[6], sort: Sort.ascending },
        { col: column[5], sort: Sort.ascending },
        { col: column[4], sort: Sort.ascending },
    ]);
};

let isGroup = true;

const group = () => {
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
       canvasTable.setGroupBy([{aggregate: g1, field: "country"}, {aggregate: g2, field: "subcountry"}]);
       expendedAll.style.display = "";
       collapseAll.style.display = "";
       groupDom.innerText = "Ungroup";
    }
    isGroup = !isGroup;
};

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

declare let data: IData[];
// data = data.splice(1, 20);

const filter = document.getElementById("filter") as HTMLInputElement;
const canvasTable = new CanvasTable<IData>("canvas", column, data);
canvasTable.addEvent("reCalcForScrollView", (a: any, width: number, height: number) => {
    // tslint:disable-next-line: no-console
    console.log({width, height});
});
canvasTable.setAllowEdit(true);
canvasTable.setRowColStyle( (dbData: IData[], row: IData, col: ICanvasTableColumnConf, isOver: boolean,
                             isSepra: boolean, dataRowCol: string) => {
    if (dataRowCol === "Iceland") {
        return { fontStyle: "bold", fontColor: "red", align: Align.center };
    }

    return null;
});
canvasTable.setFilter((dbData: any, row: any, col: ICanvasTableColumnConf[]) => {
    if (filter === null) { return true; }
    return !((row.country || "").indexOf(filter.value) === -1 &&
             (row.name || "").indexOf(filter.value) === -1 &&
             (row.subcountry || "").indexOf(filter.value) === -1);
});
canvasTable.setSort([{ col: column[0], sort: Sort.descending }]);
group();
canvasTable.addEvent("click", (table, row, col) => {
        // tslint:disable-next-line: no-console
        console.log(row, col);
});
canvasTable.addEvent("clickHeader", (table, col) => {
        // tslint:disable-next-line: no-console
        console.log(col);
});

if (filter != null) {
    filter.addEventListener("keyup", () => {
        canvasTable.askForReIndex();
    });
}

const w = window as any;
w.canvasTable = canvasTable;
w.onlyIceland = onlyIceland;
w.sortName = sortName;
w.col = column;
w.sort = sort;
w.group = group;
