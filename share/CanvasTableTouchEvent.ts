export interface ICanvasTableTouchEvent {
    changedTouches: Array<{pageX: number, pageY: number}>;
    touches: Array<{pageX: number, pageY: number}>;
}

interface IMyTouchEvent {
    readonly altKey: boolean;
    readonly changedTouches: IMyTouchList;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly shiftKey: boolean;
    readonly touches: IMyTouchList;
}
interface IMyTouchList {
    readonly length: number;
    item(index: number): IMyTouch | null;
    [index: number]: IMyTouch;
}
interface IMyTouch {
    readonly pageX: number;
    readonly pageY: number;
}

export function TouchEventToCanvasTableTouchEvent(e: IMyTouchEvent): ICanvasTableTouchEvent {
    const x: ICanvasTableTouchEvent = { changedTouches: [], touches: [] };
    let i;
    for (i = 0; i < e.changedTouches.length; i++) {
        x.changedTouches.push({
            pageX : e.changedTouches[i].pageX,
            pageY : e.changedTouches[i].pageY});
    }
    for (i = 0; i < e.touches.length; i++) {
        x.touches.push({
            pageX : e.touches[i].pageX,
            pageY : e.touches[i].pageY});
    }
    return x;
}
