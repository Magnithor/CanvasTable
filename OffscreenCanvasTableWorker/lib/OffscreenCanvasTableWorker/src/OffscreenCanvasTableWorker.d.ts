import { CustomCanvasTable, CanvasTableColumnConf } from "../../share/CustomCanvasTable";
import { OffscreenCanvasMesssage } from "../../share/OffscreenCanvasTableMessage";
export declare class OffscreenCanvasTableWorker extends CustomCanvasTable {
    protected drawCanvas(): void;
    protected setCanvasSize(width: number, height: number): void;
    private id;
    private canvas?;
    constructor(offscreenCanvasTableId: number, col: CanvasTableColumnConf[]);
    message(data: OffscreenCanvasMesssage): void;
    protected resize(): void;
    private askForExtentedMouseMoveAndMaouseUp;
    private askForNormalMouseMoveAndMaouseUp;
}
