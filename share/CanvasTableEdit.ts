import { ICanvasTableColumn } from "./CustomCanvasTable";
export class CanvasTableEdit {
    private readonly column: ICanvasTableColumn;
    private readonly row: number;
    private readonly inputeElement: HTMLInputElement;
    private readonly onRemove: (cancel: boolean, newData: string) => void;

    constructor(col: ICanvasTableColumn, row: number, data: string,
                cellHeight: number, onRemve: (cancel: boolean, newData: string) => void) {
        this.column = col;
        this.row = row;
        this.onRemove = onRemve;
        this.inputeElement = document.createElement("input");
        this.inputeElement.style.position = "absolute";
        this.inputeElement.style.border = "none";
        this.inputeElement.type = "text";
        this.inputeElement.value = data;

        this.inputeElement.style.width = (col.width - 7) + "px";
        this.inputeElement.style.height = cellHeight + "px";
        this.inputeElement.style.padding = "0px 3px";

        document.body.appendChild(this.inputeElement);

        this.inputeElement.focus();

        this.inputeElement.addEventListener("blur", this.onBlur);
        this.inputeElement.addEventListener("keyup", this.onKeyup);
    }
    public getRow() { return this.row; }
    public getColumn() {return this.column; }

    public updateEditLocation(r: number, posX: number, posY: number,
                              offsetTop: number, offsetLeft: number, cellHeight: number) {
        const y = -(posY / r) + this.row * cellHeight;
        const x = -(posX / r) + (this.column.leftPos / r);

        this.inputeElement.style.top = offsetTop + 18 + y + "px";
        this.inputeElement.style.left = offsetLeft + x + "px";
        // console.log(x, y, this.inputeElement.style.left, this.inputeElement.style.top);
        if (y < 0) {
            // rect(<top>, <right>, <bottom>, <left>)
            if (x < 0) {
                this.inputeElement.style.clip = "rect(" + (-y) + "px, auto,auto," + (-x) + "px)";
            } else {
                this.inputeElement.style.clip = "rect(" + (-y) + "px, auto,auto,auto)";
            }
        } else if (x < 0) {
            this.inputeElement.style.clip = "rect(auto,auto,auto," + (-x) + "px)";
        } else {
            this.inputeElement.style.clip = "";
        }
    }

    public doRemove(cancel: boolean) {
        try {
            this.onRemove(cancel, this.inputeElement.value);
        } catch {
            console.log("doRemove");
        }

        this.inputeElement.removeEventListener("blur", this.onBlur);
        this.inputeElement.removeEventListener("keyup", this.onKeyup);
        document.body.removeChild(this.inputeElement);
    }

    private onKeyup = (ev: KeyboardEvent) => {
        switch (ev.code) {
            case "Escape":
                setTimeout(() => {
                    this.doRemove(true);
                }, 1);
                break;
            case "Enter":
                setTimeout(() => {
                    this.doRemove(false);
                }, 1);
                break;
        }
    }

    private onBlur = () => {
        setTimeout(() => {
            this.doRemove(false);
        }, 1);
    }
}
