import { CanvasTable } from './../CanvasTable/src/CanvasTable';
import { CanvasTableColumnConf, Sort, Align } from '../share/CanvasTableColum';

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
       canvasTable.setGroupBy(["KingdomName"]);
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
        align: Align.right
    },
    {
        header: "TaxonName",
        field: "TaxonName",
        width: 100
    },
    {
        header: "ClassName",
        field: "ClassName",
        width: 100
    },
    {
        header: "FamilyName",
        field: "FamilyName",
        width: 30
    },
    {
        header: "GenusName",
        field: "GenusName",
        width: 200
    },
    {
        header: "KingdomName",
        field: "KingdomName",
        width: 200
    },
    {
        header: "OrderName",
        field: "OrderName",
        width: 100
    },
    {
        header: "PhylumName",
        field: "PhylumName",
        width: 100
    },
    {
        header: "SubClassName",
        field: "SubClassName",
        width: 100
    },
    {
        header: "SubPhylumName",
        field: "SubPhylumName",
        width: 100
    },
    {
        header: "SuperDomainName",
        field: "SuperDomainName",
        width: 100
    },
    {
        header: "SuperFamilyName",
        field: "SuperFamilyName",
        width: 100
    }
];

const filter = <HTMLInputElement>document.getElementById("filter");
const canvasTable = new CanvasTable("canvas", [], col);
canvasTable.setFilter(function(data: any, row: any, col: CanvasTableColumnConf[]) {
    if (filter === null || filter.value === "") { return true; }
    let f = filter.value.toLowerCase();
    for (const key in row) {
        if (row.hasOwnProperty(key)) {
            const element = row[key];
            if (typeof element === "string") {
                if (element.toLowerCase().indexOf(f) >=0) { return true; }
            }                       
        }
    }
    return false;
});
let data:any[] = [];

group();
canvasTable.addEvent("click", (row,col) => { 
    if (typeof row === "number"){
        console.log(data[row], row, col);
        return;
    }
    console.log(row,col);
 });
canvasTable.addEvent("clickHeader", (col) => { console.log(col); });

if (filter != null) {
    filter.addEventListener("keyup", function(){
        canvasTable.askForReIndex();
    });
}

const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        data = JSON.parse(httpRequest.responseText);
        canvasTable.setData(data);
    }
};

httpRequest.open('GET', 'Taxonomy.json', true);
httpRequest.send();

var w = (<any>window);
w.canvasTable = canvasTable;
w.col = col;
w.group = group;