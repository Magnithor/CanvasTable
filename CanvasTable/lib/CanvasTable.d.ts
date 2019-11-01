import { CustomCanvasTable, CanvasTableColumnConf } from './CustomCanvasTable';
export declare class CanvasTable extends CustomCanvasTable {
    private canvas;
    constructor(htmlId: string, data: any[], col: CanvasTableColumnConf[]);
    private askForExtentedMouseMoveAndMaouseUp;
    private askForNormalMouseMoveAndMaouseUp;
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
    protected setCanvasSize(width: number, height: number): void;
}
