import { ICanvasContext2D } from "../../share/CanvasContext2D";
import { Align, CustomFilter, CustomSort, ICanvasTableColumnConf, ICanvasTableColumnSort, Sort } from "../../share/CanvasTableColum";
import { IGroupItem } from "../../share/CustomCanvasIndex";
import { CustomCanvasTable, ICanvasTableConfig, ICanvasTableGroup, ICanvasTableColumn } from "../../share/CustomCanvasTable";
import { OffscreenCanvasMesssage, OffscreenCanvasMesssageType } from "../../share/OffscreenCanvasTableMessage";
import { ScrollView } from "../../share/ScrollView";

declare function postMessage(message: any): void;

export { ICanvasTableColumnConf, Align, Sort, IGroupItem,
    ICanvasTableGroup, ICanvasTableColumnSort, CustomSort, CustomFilter,
    CustomCanvasTable, ICanvasContext2D };

export class OffscreenCanvasTableWorker<T = any> extends CustomCanvasTable {

    private id: number;
    private canvas?: OffscreenCanvas;

    constructor(offscreenCanvasTableId: number, col: ICanvasTableColumnConf[], config?: ICanvasTableConfig) {
        super(config);
        this.id = offscreenCanvasTableId;
        this.updateColumns(col);
    }

    public message(data: OffscreenCanvasMesssage) {
        if (data.mthbCanvasTable !== this.id) { return; }

        switch (data.type) {
            case OffscreenCanvasMesssageType.create:
                this.canvas = data.offscreen;
                this.setR(data.r);
                const context =  this.canvas.getContext("2d") as ICanvasContext2D;
                if (context === null) { return; }
                this.scrollView = new ScrollView(context, this,
                    this.config ? this.config.scrollView : undefined,
                    this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp,
                    this.scrollViewChange);

                this.context = context;
                this.doReize(data.width, data.height);
                this.askForReDraw();
                break;
            case OffscreenCanvasMesssageType.resize:
                this.setR(data.r);
                this.doReize(data.width, data.height);
                this.askForReDraw();
                break;
            case OffscreenCanvasMesssageType.collapseAll:
                this.collapseAll();
                break;
            case OffscreenCanvasMesssageType.expendAll:
                this.expendAll();
                break;
            case OffscreenCanvasMesssageType.setGroupBy:
                this.setGroupBy(data.groupBy);
                break;
            case OffscreenCanvasMesssageType.focus:
                this.setIsFocus(data.focus);
                break;
            case OffscreenCanvasMesssageType.scroll:
                this.wheel(data.deltaMode, data.deltaX, data.deltaY);
                break;
            case OffscreenCanvasMesssageType.mouseDown:
                this.mouseDown(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseMove:
                this.mouseMove(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseUp:
                this.mouseUp(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseDblClick:
                this.dblClick(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseMoveExtended:
                this.mouseMoveExtended(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseUpExtended:
                this.mouseUpExtended(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseLeave:
                this.mouseLeave();
                break;
            case OffscreenCanvasMesssageType.touchStart:
                this.TouchStart(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasMesssageType.touchMove:
                this.TouchMove(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasMesssageType.touchEnd:
                this.TouchEnd(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasMesssageType.keyDown:
                this.keydown(data.keycode);
                break;
        }
    }

    public resize() {
        /** */
    }
    protected drawCanvas(): void {
        if (this.context === undefined || this.dataIndex === undefined) {
            this.requestAnimationFrame = undefined;
            this.askForReDraw(this.drawconf);
            return;
        }

        super.drawCanvas();
    }

    protected scrollViewChange(): void {
        /** */
    }

    protected updateForEdit(col: ICanvasTableColumn<T>, i: number) {
        /*
        if (this.canvasTableEdit) {
            this.canvasTableEdit.doRemove(true, undefined);
        }

        this.canvasTableEdit = new CanvasTableEdit(col, i, (this.data[i] as any)[col.field],
            this.cellHeight, this.onEditRemove);
        this.updateEditLocation();
        */
    }

    protected setCanvasSize(width: number, height: number): void {
        if (this.canvas === undefined) { return; }
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }
    protected setCursor(cursor: string): void {
        const data: OffscreenCanvasMesssage = { cursor, mthbCanvasTable: this.id,
              type: OffscreenCanvasMesssageType.setCursor };
        postMessage(data);
    }
    protected askForExtentedMouseMoveAndMaouseUp() {
        const data: OffscreenCanvasMesssage = { mthbCanvasTable: this.id,
              type: OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp };
        postMessage(data);
    }
    protected askForNormalMouseMoveAndMaouseUp() {
        const data: OffscreenCanvasMesssage = { mthbCanvasTable: this.id,
              type: OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp };
        postMessage(data);
    }
}
