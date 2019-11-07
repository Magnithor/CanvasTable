import { CustomCanvasTable, CanvasTableConfig } from './../../share/CustomCanvasTable';
import { CanvasTableColumnConf, Align, Sort } from '../../share/CanvasTableColum';
export { Align, Sort };
export declare class CanvasTable extends CustomCanvasTable {
    private canvas;
    constructor(htmlId: string, data: any[], col: CanvasTableColumnConf[], config?: CanvasTableConfig);
    protected askForExtentedMouseMoveAndMaouseUp(): void;
    protected askForNormalMouseMoveAndMaouseUp(): void;
    private canvasWheel;
    private canvasKeydown;
    private canvasTouchStart;
    private canvasTouchMove;
    private canvasTouchEnd;
    private canvasMouseDown;
    private canvasMouseLeave;
    private canvasMouseUp;
    private canvasMouseUpExtended;
    private canvasMouseMoveExtended;
    private canvasMouseMove;
    protected resize(): void;
    protected setCursor(cursor: string): void;
    protected setCanvasSize(width: number, height: number): void;
}
