import { CustomCanvasTable, CanvasTableConfig } from "../../share/CustomCanvasTable";
import { OffscreenCanvasMesssage } from "../../share/OffscreenCanvasTableMessage";
import { CanvasTableColumnConf } from "../../share/CanvasTableColum";
export declare class OffscreenCanvasTableWorker extends CustomCanvasTable {
    protected drawCanvas(): void;
    protected setCanvasSize(width: number, height: number): void;
    private id;
    private canvas?;
    constructor(offscreenCanvasTableId: number, col: CanvasTableColumnConf[], config?: CanvasTableConfig);
    message(data: OffscreenCanvasMesssage): void;
    protected resize(): void;
    protected setCursor(cursor: string): void;
    protected askForExtentedMouseMoveAndMaouseUp(): void;
    protected askForNormalMouseMoveAndMaouseUp(): void;
}
