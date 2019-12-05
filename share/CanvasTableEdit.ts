import { ICanvasTableColumn } from "./CustomCanvasTable";
export enum CanvasTableEditAction {
    moveNext,
    movePrev,
}

export class CanvasTableEdit<T = any> {
    private hasBeenRemoved: boolean = false;
    private readonly column: ICanvasTableColumn<T>;
    private readonly row: number;
    private readonly inputeElement: HTMLInputElement;
    private onRemove?: (cancel: boolean, newData: string, action: CanvasTableEditAction | undefined) => void;

    constructor(col: ICanvasTableColumn<T>, row: number, data: string, cellHeight: number,
                onRemve: (cancel: boolean, newData: string, action: CanvasTableEditAction | undefined) => void) {
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
        this.inputeElement.addEventListener("keydown", this.onKeydown);
    }
    public getRow() { return this.row; }
    public getColumn() {return this.column; }

    public updateEditLocation(top: number, left: number, width: number, height: number,
                              clipTop?: number, clipRight?: number, clipBottom?: number, clipLeft?: number) {
        this.inputeElement.style.top = top + "px";
        this.inputeElement.style.left = left + "px";
        this.inputeElement.style.width = (width - 7) + "px";
        this.inputeElement.style.height = height + "px";
        if (clipTop === undefined && clipRight === undefined && clipBottom === undefined && clipLeft === undefined) {
            this.inputeElement.style.clip = "";
        }  else {
            this.inputeElement.style.clip = "rect(" +
                (clipTop === undefined    ? "auto," : clipTop + "px," ) +
                (clipRight === undefined  ? "auto," : clipRight + "px," ) +
                (clipBottom === undefined ? "auto," : clipBottom + "px," ) +
                (clipLeft === undefined   ? "auto"  : clipLeft + "px" ) +
                ")";
        }
    }

    public doRemove(cancel: boolean, action: CanvasTableEditAction | undefined) {
        let error;
        try {
            if (this.onRemove) {
                this.onRemove(cancel, this.inputeElement.value, action);
            }
        } catch (e) {
            error = e;
        }

        this.onRemove = undefined;

        this.inputeElement.removeEventListener("blur", this.onBlur);
        this.inputeElement.removeEventListener("keydown", this.onKeydown);
        if (!this.hasBeenRemoved) {
            document.body.removeChild(this.inputeElement);
            this.hasBeenRemoved = true;
        }
        if (error) {
            throw error;
        }
    }

    private onKeydown = (ev: KeyboardEvent) => {
        let cancel: boolean | undefined;
        let action: CanvasTableEditAction | undefined;
        switch (ev.code) {
            case "Escape":
                cancel = true;
                break;
            case "Enter":
                cancel = false;
                break;
            case "Tab":
                cancel = false;
                action = ev.shiftKey ? CanvasTableEditAction.movePrev : CanvasTableEditAction.moveNext;
                ev.preventDefault();
                break;
        }

        if (cancel !== undefined) {
            const cancelArg = cancel;
            setTimeout(() => {
                this.doRemove(cancelArg, action);
            }, 1);
        }

    }

    private onBlur = () => {
        if (!this.hasBeenRemoved) {
            setTimeout(() => {
                this.doRemove(false, undefined);
            }, 1);
        }
    }
}
