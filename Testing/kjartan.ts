import { Align, ICanvasTableColumnConf, Sort } from "../share/CanvasTableColum";
import { CanvasTable } from "./../CanvasTable/src/CanvasTable";

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
       canvasTable.setGroupBy(["KingdomName"]);
       expendedAll.style.display = "";
       collapseAll.style.display = "";
       groupDom.innerText = "Ungroup";
    }
    isGroup = !isGroup;
};

const column: ICanvasTableColumnConf[] = [
    {
        align: Align.right,
        field: "__rownum__",
        header: "Id",
        width: 80,
    },
    {
        field: "TaxonName",
        header: "TaxonName",
        width: 100,
    },
    {
        field: "ClassName",
        header: "ClassName",
        width: 100,
    },
    {
        field: "FamilyName",
        header: "FamilyName",
        width: 30,
    },
    {
        field: "GenusName",
        header: "GenusName",
        width: 200,
    },
    {
        field: "KingdomName",
        header: "KingdomName",
        width: 200,
    },
    {
        field: "OrderName",
        header: "OrderName",
        width: 100,
    },
    {
        field: "PhylumName",
        header: "PhylumName",
        width: 100,
    },
    {
        field: "SubClassName",
        header: "SubClassName",
        width: 100,
    },
    {
        field: "SubPhylumName",
        header: "SubPhylumName",
        width: 100,
    },
    {
        field: "SuperDomainName",
        header: "SuperDomainName",
        width: 100,
    },
    {
        field: "SuperFamilyName",
        header: "SuperFamilyName",
        width: 100,
    },
];

const filter = document.getElementById("filter") as HTMLInputElement;
const canvasTable = new CanvasTable("canvas", column, []);
canvasTable.setFilter((data: any, row: any, col: ICanvasTableColumnConf[]) => {
    if (filter === null || filter.value === "") { return true; }
    const f = filter.value.toLowerCase();
    for (const key in row) {
        if (row.hasOwnProperty(key)) {
            const element = row[key];
            if (typeof element === "string") {
                if (element.toLowerCase().indexOf(f) >= 0) { return true; }
            }
        }
    }
    return false;
});
let dbData: any[] = [];

group();
canvasTable.addEvent("click", (table, row, col) => {
    if (typeof row === "number") {
        // tslint:disable-next-line: no-console
        console.log(dbData[row], row, col);
        return;
    }

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

const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        dbData = JSON.parse(httpRequest.responseText);
        canvasTable.setData(dbData);
    }
};

httpRequest.open("GET", "Taxonomy.json", true);
httpRequest.send();

const w = window as any;
w.canvasTable = canvasTable;
w.col = column;
w.group = group;
