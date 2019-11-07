import { ScrollView } from './../../share/ScrollView';
import { CustomCanvasTable, CanvasTableConfig } from './../../share/CustomCanvasTable';
import { TouchEventToCanvasTableTouchEvent } from './../../share/CanvasTableTouchEvent';
import { CanvasTableColumnConf, Align, Sort } from '../../share/CanvasTableColum';

export { Align, Sort }

export class CanvasTable extends CustomCanvasTable {
    private canvas: HTMLCanvasElement;
   
    constructor(htmlId: string, data: any[], col: CanvasTableColumnConf[], config?: CanvasTableConfig) {
        super(config);
        this.data = data;
        this.canvas = <HTMLCanvasElement>document.getElementById(htmlId);
        const context = this.canvas.getContext("2d");
        if (context === null) { throw "context is null"; }
        this.setR(window.devicePixelRatio);
        this.doReize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.context = context;
        
        this.scrollView = new ScrollView(this.context, this, config ? config.scrollView : undefined, this.askForExtentedMouseMoveAndMaouseUp, this.askForNormalMouseMoveAndMaouseUp);
        this.calcIndex();
        
        this.canvas.addEventListener("wheel", this.canvasWheel);
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

    private canvasWheel = (e: WheelEvent) => {
        e.preventDefault();
        this.wheel(e.deltaMode, e.deltaX, e.deltaY);
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

}