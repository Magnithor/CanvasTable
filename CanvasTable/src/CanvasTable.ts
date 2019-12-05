import { ICanvasContext2D } from "../../share/CanvasContext2D";
import { Align, CustomFilter, CustomSort, ICanvasTableColumnConf, ICanvasTableColumnSort, Sort } from "../../share/CanvasTableColum";
import { IGroupItem, RowItem } from "../../share/CustomCanvasIndex";
import { CanvasTableEdit, CanvasTableEditAction } from "./../../share/CanvasTableEdit";
import { TouchEventToCanvasTableTouchEvent } from "./../../share/CanvasTableTouchEvent";
import { CustomCanvasTable, ICanvasTableColumn, ICanvasTableConfig, ICanvasTableGroup } from "./../../share/CustomCanvasTable";
import { ScrollView } from "./../../share/ScrollView";

export { ICanvasTableColumnConf, Align, Sort, IGroupItem,
    ICanvasTableGroup, ICanvasTableColumnSort, CustomSort, CustomFilter,
    CustomCanvasTable, ICanvasContext2D };

/**
 * CanvasTable
 * draw table in canvas
 *
 *  ```typescript
 * import { CanvasTable, Align } from "mthb-canvas-table";
 *
 * const col:CanvasTableColumnConf[] = [
 *   {
 *       header: "Id",
 *       field: "__rownum__",
 *       width: 80,
 *       align: Align.center
 *   },
 *   {
 *       header: "Name",
 *       field: "name",
 *       width: 200
 *   },
 *   {
 *       header: "LastName",
 *       field: "lastName",
 *       width: 200
 *   }
 * ];
 *
 * let data = [{name: "Magni", lastName: "Birgisson"}, {name: "Dagrún", lastName: "Þorsteinsdóttir"}];
 *
 *  /// <canvas id="canvas" style="width:400px; height: 400px"> </canvas>
 * const canvasTable = new CanvasTable("canvas", col, data);
 * ```
 */
export class CanvasTable<T = any> extends CustomCanvasTable<T> {
    private readonly canvas: HTMLCanvasElement;
    private canvasTableEdit?: CanvasTableEdit;

    /**
     * Constructor of CanvasTable
     * @param canvas id of canvas or htmlCanvasElemnt
     * @param col columns
     * @param data array of data
     * @param config config
     */
    constructor(canvas: string|HTMLCanvasElement, col: Array<ICanvasTableColumnConf<T>>,
                data: T[] = [], config?: ICanvasTableConfig) {
        super(config);
        this.canvasTableEdit = undefined;
        this.data = data;
        this.canvas = (typeof canvas === "string") ? document.getElementById(canvas) as HTMLCanvasElement : canvas;
        const context = this.canvas.getContext("2d");
        if (context === null) { throw new Error("context is null"); }
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.context = context;

        this.scrollView = new ScrollView(
            this.context, this,
            config ? config.scrollView : undefined, this.askForExtentedMouseMoveAndMaouseUp,
            this.askForNormalMouseMoveAndMaouseUp, this.scrollViewChange);
        this.calcIndex();

        this.canvas.addEventListener("blur", this.canvasBlur);
        this.canvas.addEventListener("focus", this.canvasFocus);
        this.canvas.addEventListener("wheel", this.canvasWheel);
        this.canvas.addEventListener("dblclick", this.canvasDblClick);
        this.canvas.addEventListener("mousedown", this.canvasMouseDown);
        this.canvas.addEventListener("mousemove", this.canvasMouseMove);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp);
        this.canvas.addEventListener("mouseleave", this.canvasMouseLeave);
        this.canvas.addEventListener("touchstart", this.canvasTouchStart);
        this.canvas.addEventListener("touchmove", this.canvasTouchMove);
        this.canvas.addEventListener("touchend", this.canvasTouchEnd);
        this.canvas.addEventListener("keydown", this.canvasKeydown);
        this.UpdateColumns(col);
        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    public UpdateColumns(col: Array<ICanvasTableColumnConf<T>>) {
        super.UpdateColumns(col);
        if (this.canvasTableEdit) {
            this.canvasTableEdit.doRemove(true, undefined);
        }
    }

    public resize() {
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.askForReDraw();
    }
    protected update(col: ICanvasTableColumnConf<T>, i: number) {
        const column = this.getColumnByCanvasTableColumnConf(col);
        if (!column || column.allowEdit) { return; }

        if (this.canvasTableEdit) {
            this.canvasTableEdit.doRemove(true, undefined);
        }

        this.canvasTableEdit = new CanvasTableEdit(column, i, (this.data[i] as any)[column.field],
            this.cellHeight, this.onEditRemove);
        this.updateEditLocation();
    }
    protected scrollViewChange(): void {
        this.updateEditLocation();
    }
    protected askForExtentedMouseMoveAndMaouseUp() {
        this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
        this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
        window.addEventListener("mousemove", this.canvasMouseMoveExtended);
        window.addEventListener("mouseup", this.canvasMouseUpExtended);
    }
    protected askForNormalMouseMoveAndMaouseUp() {
        window.removeEventListener("mousemove", this.canvasMouseMoveExtended);
        window.removeEventListener("mouseup", this.canvasMouseUpExtended);
        this.canvas.addEventListener("mousemove", this.canvasMouseMove);
        this.canvas.addEventListener("mouseup", this.canvasMouseUp);
    }
    protected setCursor(cursor: string): void {
        this.canvas.style.cursor = cursor;
    }
    protected setCanvasSize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }
    protected fireDblClick(row: RowItem, col: ICanvasTableColumn<T> | null) {
        if (this.allowEdit && typeof row === "number" && col !== null) {
            this.update(col.orginalCol, row);
        }

        super.fireDblClick(row, col);
    }

    private canvasFocus = (ev: FocusEvent) => {
        this.setIsFocus(true);
    }

    private canvasBlur = (ev: FocusEvent) => {
        this.setIsFocus(false);
    }

    private canvasKeydown = (e: KeyboardEvent) => {
        this.keydown(e.keyCode);
    }

    private canvasTouchStart = (e: TouchEvent) => {
        e.preventDefault();
        this.TouchStart(TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetLeft, this.canvas.offsetTop);
    }
    private canvasTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        this.TouchMove(TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetLeft, this.canvas.offsetTop);
    }
    private canvasTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        this.TouchEnd(TouchEventToCanvasTableTouchEvent(e), this.canvas.offsetLeft, this.canvas.offsetTop);
    }
    private canvasDblClick = (e: MouseEvent) => {
        e.preventDefault();
        //  this.dblClick(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.dblClick(e.offsetX, e.offsetY);
    }
    private canvasWheel = (e: WheelEvent) => {
        e.preventDefault();
        this.wheel(e.deltaMode, e.deltaX, e.deltaY);
    }
    private canvasMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this.canvas.focus();
        // this.mouseDown(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.mouseDown(e.offsetX, e.offsetY);
    }
    private canvasMouseLeave = () => {
        this.mouseLeave();
    }
    private canvasMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        // this.mouseUp(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.mouseUp(e.offsetX, e.offsetY);
    }
    private canvasMouseUpExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.mouseUpExtended(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }
    private canvasMouseMoveExtended = (e: MouseEvent) => {
        e.preventDefault();
        // this.mouseMoveExtended(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.mouseMoveExtended(e.offsetX, e.offsetY);
    }
    private canvasMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        // this.mouseMove(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.mouseMove(e.offsetX, e.offsetY);
    }

    private onEditRemove = (cancel: boolean, newData: string, action: CanvasTableEditAction | undefined) => {
        if (!this.canvasTableEdit) {
            return;
        }

        const old = this.canvasTableEdit;
        this.canvasTableEdit = undefined;
        if (cancel) {
            return;
        }

        const columnField = old.getColumn().field;
        const row = old.getRow();

        if (String(this.getUpdateDataOrData(row, columnField)) !== String(newData)) {
            this.setUpdateData(row, columnField, newData);
            this.reCalcIndexIfNeed(columnField);
            this.askForReDraw();
        }

        if (action !== undefined) {
            switch (action) {
                case CanvasTableEditAction.moveNext:
                    if (this.column.length > old.getColumn().index + 1) {
                        const column = this.column[old.getColumn().index + 1];
                        const i = old.getRow();
                        this.canvasTableEdit = new CanvasTableEdit(column, i, (this.data[i] as any)[column.field],
                            this.cellHeight, this.onEditRemove);
                        this.updateEditLocation();
                    }
                    break;
                case CanvasTableEditAction.movePrev:
                        if (0 < old.getColumn().index) {
                            const column = this.column[old.getColumn().index - 1];
                            const i = old.getRow();
                            this.canvasTableEdit = new CanvasTableEdit(column, i, (this.data[i] as any)[column.field],
                                this.cellHeight, this.onEditRemove);
                            this.updateEditLocation();
                        }
                        break;
            }
        }
    }
    private updateEditLocation() {
        if (!this.canvasTableEdit || !this.scrollView ) {
            return;
        }

        const row = this.canvasTableEdit.getRow();
        const topPos = this.findTopPosByRow(row);
        if (topPos === undefined) {
            return;
        }

        const column = this.canvasTableEdit.getColumn();

        const y = (topPos - this.scrollView.getPosY()) / this.r;
        const x = -(this.scrollView.getPosX() / this.r) + (column.leftPos / this.r);
        const top = this.canvas.offsetTop + y;
        const left = this.canvas.offsetLeft + x;

        let clipTop: number | undefined;
        const clipRight: number | undefined = undefined;
        const clipBottom: number | undefined = undefined;
        let clipLeft: number | undefined;

        if (y < this.headerHeight) {
            // rect(<top>, <right>, <bottom>, <left>)
            if (x < 0) {
                clipTop = -y + this.headerHeight;
                clipLeft = -x;
            } else {
                clipTop = -y + this.headerHeight;
            }
        } else if (x < 0) {
            clipLeft = -x;
        }

        this.canvasTableEdit.updateEditLocation(top, left, column.width , this.cellHeight,
                                                clipTop, clipRight, clipBottom, clipLeft);
    }
}
