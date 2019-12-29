import {OffscreenCanvasTable} from "../OffscreenCanvasTable/src/OffscreenCanvasTable";

const worker = new Worker("dist/worker.js");
const filter = document.getElementById("filter") as HTMLInputElement;
const canvasTable = new OffscreenCanvasTable(1, worker, "canvas");

worker.addEventListener("message", (message) => {
    // tslint:disable-next-line: no-console
    console.log(message);
});

worker.postMessage("this is a test message to the worker");
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
       canvasTable.setGroupBy(["country", "subcountry"]);
       expendedAll.style.display = "";
       collapseAll.style.display = "";
       groupDom.innerText = "Ungroup";
    }
    isGroup = !isGroup;
};

group();

if (filter != null) {
    filter.addEventListener("keyup", () => {
        worker.postMessage({filter: filter.value});
    });
}

const w = window as any;
w.canvasTable = canvasTable;
w.group = group;
