import { ScrollView } from './../../share/ScrollView';
import { CanvasTableEdit } from './../../share/CanvasTableEdit';
import { CustomCanvasTable, CanvasTableConfig, CanvasTableGroup, CanvasTableColumn } from './../../share/CustomCanvasTable';
import { TouchEventToCanvasTableTouchEvent } from './../../share/CanvasTableTouchEvent';
import { CanvasTableColumnConf, Align, Sort, CanvasTableColumnSort, CustomFilter, CustomSort } from '../../share/CanvasTableColum';
import { GroupItem, RowItem } from '../../share/CustomCanvasIndex';

export { CanvasTableColumnConf, Align, Sort, GroupItem, CanvasTableGroup, CanvasTableColumnSort, CustomSort, CustomFilter }

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
export class CanvasTable extends CustomCanvasTable {
    private readonly canvas: HTMLCanvasElement;
    private canvasTableEdit?: CanvasTableEdit;
   
   
    /**
     * Constructor of CanvasTable
     * @param canvas id of canvas or htmlCanvasElemnt
     * @param col columns
     * @param data array of data
     * @param config config
     */
    constructor(canvas: string|HTMLCanvasElement, col: CanvasTableColumnConf[], data: any[] = [], config?: CanvasTableConfig) {
        super(config);
        this.canvasTableEdit = undefined;
        this.data = data;
        this.canvas = (typeof canvas === "string") ? <HTMLCanvasElement>document.getElementById(canvas) : canvas; 
        const context = this.canvas.getContext("2d");
        if (context === null) { throw "context is null"; }
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.context = context;
        
        this.scrollView = new ScrollView(this.context, this, config ? config.scrollView : undefined, this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp, this.scrollViewChange);
        this.calcIndex();
        
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
    // #region override
    public UpdateColumns(col: CanvasTableColumnConf[]) {
        super.UpdateColumns(col);
        if (this.canvasTableEdit) {
            this.canvasTableEdit.doRemove(true);
        }
    }
    protected update(col:CanvasTableColumnConf, i:number) {
        const column = this.getColumnByCanvasTableColumnConf(col);
        if (!column) { return; }
        this.canvasTableEdit = new CanvasTableEdit(column, i, this.data[i][column.field], this.cellHeight, this.onEditRemove);
       
        this.updateEditLocation();
          
    }
    private onEditRemove = (cancel:boolean, newData: string) => {
        if (!this.canvasTableEdit) { return; }
        const old = this.canvasTableEdit;
        this.canvasTableEdit = undefined;
        if (cancel) {
            return;
        }

        this.data[old.getRow()][old.getColumn().field] = newData;    
        this.askForReDraw();
    }
    private updateEditLocation() {
        if (!this.canvasTableEdit || !this.scrollView ) { return; }
        this.canvasTableEdit.updateEditLocation(this.r, this.scrollView.posX, this.scrollView.posY,
            this.canvas.offsetTop, this.canvas.offsetLeft, this.cellHeight);


    }
    protected scrollViewChange():void {
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

    protected resize() {
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);

        this.reCalcForScrollView();
        this.askForReDraw();
    }
    protected setCursor(cursor: string): void {
        this.canvas.style.cursor = cursor;
    }
    protected setCanvasSize(width:number, height:number) {
        this.canvas.width = width;
        this.canvas.height = height;
        super.setCanvasSize(width, height);
    }
    protected fireDblClick(row: RowItem, col: CanvasTableColumn | null) {  
        if (this.allowEdit && typeof row === "number" && col !== null) {
            this.update(col.orginalCol, row);
        }

        super.fireDblClick(row, col);
    }
    // #endregion

    // #region key Event
    private canvasKeydown = (e: KeyboardEvent) => {
        this.keydown(e.keyCode);
    }
    // #endregion
    // #region Touch Event
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
    // #endregion
    // #region Mouse Event
    private canvasDblClick = (e:MouseEvent) => {
        e.preventDefault();
        this.dblClick(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);        
    }
    private canvasWheel = (e: WheelEvent) => {
        e.preventDefault();
        this.wheel(e.deltaMode, e.deltaX, e.deltaY);
    }
    private canvasMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        this.mouseDown(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }
    private canvasMouseLeave = () => {
        this.mouseLeave();
    }
    private canvasMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        this.mouseUp(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }
    private canvasMouseUpExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.mouseUpExtended(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }
    private canvasMouseMoveExtended = (e: MouseEvent) => {
        e.preventDefault();
        this.mouseMoveExtended(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }
    private canvasMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const x = e.clientX - this.canvas.offsetLeft;
        const y = e.clientY - this.canvas.offsetTop;
        this.mouseMove(x, y);
    }
    // #endregion    
}