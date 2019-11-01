import { CanvasTableTouchEvent } from "./CanvasTableTouchEvent";

export enum OffscreenCanvasMesssageType { 
    create = 0, 
    resize = 1,
    expendedAll = 2, collapseAll = 3,
    scroll = 10, 
    mouseDown = 20, mouseMove = 21, mouseUp = 22, mouseLeave = 23, mouseMoveExtended = 24, mouseUpExtended = 25,
    TouchStart = 30, TouchMove = 31, TouchEnd = 32,
    keyDown = 40,
    askForExtentedMouseMoveAndMaouseUp = 100, askForNormalMouseMoveAndMaouseUp = 101
    }

interface OffscreenCanvasMesssageParnet {
    type:OffscreenCanvasMesssageType,
    mthbCanvasTable:number
}

interface OffscreenCanvasMessageCreate extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.create,
    offscreen: OffscreenCanvas,
    width: number,
    height: number,
    r: number
}

interface OffscreenCanvasMessageResize extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.resize,
    width: number,
    height: number,
    r: number
}


interface OffscreenCanvasMessageFunctions extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.expendedAll 
        | OffscreenCanvasMesssageType.collapseAll 
        | OffscreenCanvasMesssageType.askForExtentedMouseMoveAndMaouseUp 
        | OffscreenCanvasMesssageType.askForNormalMouseMoveAndMaouseUp
}

interface OffscreenCanvasMessageScroll extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.scroll,
    deltaMode: number,
    deltaX: number,
    deltaY: number
}

interface OffscreenCanvasMessageMouse extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.mouseDown | OffscreenCanvasMesssageType.mouseMove | OffscreenCanvasMesssageType.mouseUp
        | OffscreenCanvasMesssageType.mouseMoveExtended | OffscreenCanvasMesssageType.mouseUpExtended,
    x: number,
    y: number
}

interface OffscreenCanvasMessageMouseLeave extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.mouseLeave
}
interface OffscreenCanvasMessageKeyDown extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.keyDown,
    keycode: number
}
interface OffscreenCanvasMesssageTouch extends OffscreenCanvasMesssageParnet {
    type: OffscreenCanvasMesssageType.TouchStart | 
    OffscreenCanvasMesssageType.TouchMove |
    OffscreenCanvasMesssageType.TouchEnd,
    event: CanvasTableTouchEvent, 
    offsetLeft: number, 
    offsetTop: number
}


export type OffscreenCanvasMesssage = 
      OffscreenCanvasMessageScroll 
    | OffscreenCanvasMessageCreate
    | OffscreenCanvasMessageResize
    | OffscreenCanvasMessageFunctions
    | OffscreenCanvasMessageMouse
    | OffscreenCanvasMessageMouseLeave
    | OffscreenCanvasMessageKeyDown
    | OffscreenCanvasMesssageTouch;