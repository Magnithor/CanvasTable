import { CustomCanvasTable, CanvasTableConfig, CanvasTableColumn } from "../../share/CustomCanvasTable";
import { ScrollView } from "../../share/ScrollView";
import { OffscreenCanvasMesssage, OffscreenCanvasMesssageType } from "../../share/OffscreenCanvasTableMessage";
import { CanvasTableColumnConf } from "../../share/CanvasTableColum";
import { CanvasContext2D } from "../../share/CanvasContext2D";
import { RowItem } from "../../share/CustomCanvasIndex";

export class OffscreenCanvasTableWorker extends CustomCanvasTable {
    protected drawCanvas(): void {
        if (this.context === undefined || this.dataIndex === undefined) { 
            this.requestAnimationFrame = undefined;
            this.askForReDraw(this.drawconf);
            return; 
        }

        super.drawCanvas();
    }

    protected setCanvasSize(width: number, height: number): void {
        if (this.canvas === undefined) { return; }
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }

    private id: number;
    private canvas?: OffscreenCanvas;

    constructor (offscreenCanvasTableId: number, col: CanvasTableColumnConf[], config?: CanvasTableConfig){
        super(config);
        this.id = offscreenCanvasTableId;
        this.UpdateColumns(col);
    }

    public message(data: OffscreenCanvasMesssage) {
        if (data.mthbCanvasTable !== this.id) { return; }

        switch (data.type) {
            case OffscreenCanvasMesssageType.create:
                this.canvas = data.offscreen;                    
                this.setR(data.r);
                const context = <CanvasContext2D>this.canvas.getContext('2d');
                if (context === null) { return; }
                this.scrollView = new ScrollView(context, this, this.config ? this.config.scrollView : undefined, this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp);

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
            case OffscreenCanvasMesssageType.mouseMoveExtended:
                this.mouseMoveExtended(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseUpExtended:
                this.mouseUpExtended(data.x, data.y);
                break;
            case OffscreenCanvasMesssageType.mouseLeave:
                this.mouseLeave();
                break;
            case OffscreenCanvasMesssageType.TouchStart:
                this.TouchStart(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasMesssageType.TouchMove:
                this.TouchMove(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasMesssageType.TouchEnd:
                this.TouchEnd(data.event, data.offsetLeft, data.offsetTop);
                break;
            case OffscreenCanvasMesssageType.keyDown:
                this.keydown(data.keycode);
                break;
        }
    }

    protected resize() {}
    protected setCursor(cursor: string): void {
        const data:OffscreenCanvasMesssage = { mthbCanvasTable:this.id, type:OffscreenCanvasMesssageType.setCursor, cursor: cursor };
        postMessage(data);
    }
    protected askForExtentedMouseMoveAndMaouseUp() {
        const data:OffscreenCanvasMesssage = { mthbCanvasTable:this.id, type:OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp };
        postMessage(data);
    }
    protected askForNormalMouseMoveAndMaouseUp() {
        const data:OffscreenCanvasMesssage = { mthbCanvasTable:this.id, type:OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp };
        postMessage(data);
    }
    protected fireClick(row: RowItem, col:CanvasTableColumn | null) {        
        super.fireClick(row, col);
        const data:OffscreenCanvasMesssage = { mthbCanvasTable:this.id, type:OffscreenCanvasMesssageType.fireClick, row: row, col: col };
        postMessage(data);
    }
    protected fireClickHeader(col:CanvasTableColumn | null) {
        super.fireClickHeader(col);
        const data:OffscreenCanvasMesssage = { mthbCanvasTable:this.id, type:OffscreenCanvasMesssageType.fireClickHeader, col: col };
        postMessage(data);
    }
}