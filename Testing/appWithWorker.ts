import {OffscreenCanvasTable} from '../OffscreenCanvasTable/src/OffscreenCanvasTable';

const worker = new Worker('dist/worker.js');
const filter = <HTMLInputElement>document.getElementById("filter");
const canvasTable = new OffscreenCanvasTable(1, worker, "canvas");

worker.addEventListener('message', message => {
    console.log(message);
});

worker.postMessage('this is a test message to the worker');
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
       canvasTable.setGroupBy(["country", "subcountry"]);
       expendedAll.style.display = "";
       collapseAll.style.display = "";
       groupDom.innerText = "Ungroup";
    }
    isGroup = !isGroup;
}

group();

if (filter != null) {
    filter.addEventListener("keyup", function() {
        worker.postMessage({filter:filter.value});
    });
}

var w = (<any>window);
w.canvasTable = canvasTable;
w.group = group;
