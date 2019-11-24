import { ICanvasTableTouchEvent } from "./CanvasTableTouchEvent";

export enum OffscreenCanvasMesssageType {
    create = 0,
    resize = 1,
    expendAll = 2, collapseAll = 3, setGroupBy = 4,
    scroll = 10,
    mouseDown = 20, mouseMove = 21, mouseUp = 22, mouseLeave = 23, mouseMoveExtended = 24, mouseUpExtended = 25,
    TouchStart = 30, TouchMove = 31, TouchEnd = 32,
    keyDown = 40,
    askForExtentedMouseMoveAndMaouseUp = 100, askForNormalMouseMoveAndMaouseUp = 101, setCursor = 102,
    }

interface IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType;
    mthbCanvasTable: number;
}

interface IOffscreenCanvasMessageCreate extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.create;
    offscreen: OffscreenCanvas;
    width: number;
    height: number;
    r: number;
}

interface IOffscreenCanvasMessageResize extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.resize;
    width: number;
    height: number;
    r: number;
}

interface IOffscreenCanvasMessageFunctions extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.expendAll
        | OffscreenCanvasMesssageType.collapseAll
        | OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp
        | OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp;
}

interface IOffscreenCanvasMessageScroll extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.scroll;
    deltaMode: number;
    deltaX: number;
    deltaY: number;
}

interface IOffscreenCanvasMessageMouse extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.mouseDown | OffscreenCanvasMesssageType.mouseMove
        | OffscreenCanvasMesssageType.mouseUp | OffscreenCanvasMesssageType.mouseMoveExtended
        | OffscreenCanvasMesssageType.mouseUpExtended;
    x: number;
    y: number;
}

interface IOffscreenCanvasMessageMouseLeave extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.mouseLeave;
}
interface IOffscreenCanvasMessageKeyDown extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.keyDown;
    keycode: number;
}
interface IOffscreenCanvasMesssageTouch extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.TouchStart |
    OffscreenCanvasMesssageType.TouchMove |
    OffscreenCanvasMesssageType.TouchEnd;
    event: ICanvasTableTouchEvent;
    offsetLeft: number;
    offsetTop: number;
}

interface IOffscreenCanvasMessageGroupBy extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.setGroupBy;
    groupBy?: string[];
}

interface IOffscreenCanvasMessageSetCursor extends IOffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.setCursor;
    cursor: string;
}

export type OffscreenCanvasMesssage =
      IOffscreenCanvasMessageScroll
    | IOffscreenCanvasMessageCreate
    | IOffscreenCanvasMessageResize
    | IOffscreenCanvasMessageSetCursor
    | IOffscreenCanvasMessageFunctions
    | IOffscreenCanvasMessageGroupBy
    | IOffscreenCanvasMessageMouse
    | IOffscreenCanvasMessageMouseLeave
    | IOffscreenCanvasMessageKeyDown
    | IOffscreenCanvasMesssageTouch;
