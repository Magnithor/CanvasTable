import { Align, ICanvasTableColumnConf, IEditRowItem, Sort } from "../share/CanvasTableColum";
import { CanvasTableMode } from "../share/CanvasTableMode";
import { CanvasTable } from "./../CanvasTable/src/CanvasTable";
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

function g1(v: any): string {
    return v.child.list.length.toString();
}

function g2(v: any): string {
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
        lookupData: ["Lookup 1", "Lookup 2", "Lookup 2"],
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
canvasTable.setTableMode(CanvasTableMode.RowMode);
canvasTable.setAllowEdit(true);
canvasTable.setRowColStyle( (dbData: IData[], row: IData, col: ICanvasTableColumnConf, isOver: boolean,
                             isSepra: boolean, dataRowCol: string) => {
    if (dataRowCol === "Iceland") {
        return { fontStyle: "bold", fontColor: "red", align: Align.center };
    }

    return null;
});
canvasTable.setFilter((dbData: any, row: any, col: ICanvasTableColumnConf[], i: number, editRowItem: IEditRowItem) => {
    if (filter === null) { return true; }
    return !((row.country || "").indexOf(filter.value) === -1 &&
             (row.name || "").indexOf(filter.value) === -1 &&
             (row.subcountry || "").indexOf(filter.value) === -1 &&
             (editRowItem.country || "").indexOf(filter.value) === -1 &&
             (editRowItem.name || "").indexOf(filter.value) === -1 &&
             (editRowItem.subcountry || "").indexOf(filter.value) === -1
             );
});
canvasTable.setSort([{ col: column[0], sort: Sort.ascending }]);
group();

if (filter != null) {
    filter.addEventListener("keyup", () => {
        canvasTable.askForReIndex();
    });
}

canvasTable.setRowTableGroup({
    field: "country",
});

function getText(mode: CanvasTableMode) {
    switch (mode) {
        case CanvasTableMode.ColMode:
            return "Col mode";
        case CanvasTableMode.RowMode:
            return "Row mode";
    }
}

const modeButton = document.getElementById("mode");
if (modeButton !== null) {

   modeButton.addEventListener("click", () => {
        if (canvasTable.getTableMode() === CanvasTableMode.ColMode) {
            canvasTable.setTableMode(CanvasTableMode.RowMode);
        } else {
            canvasTable.setTableMode(CanvasTableMode.ColMode);
        }

        modeButton.innerHTML = getText(canvasTable.getTableMode());
    });

   modeButton.innerHTML = getText(canvasTable.getTableMode());
}

const w = window as any;
w.canvasTable = canvasTable;
w.onlyIceland = onlyIceland;
w.sortName = sortName;
w.col = column;
w.sort = sort;
w.group = group;
