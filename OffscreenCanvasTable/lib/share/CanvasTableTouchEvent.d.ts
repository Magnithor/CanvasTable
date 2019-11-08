export interface CanvasTableTouchEvent {
    changedTouches: {
        pageX: number;
        pageY: number;
    }[];
    touches: {
        pageX: number;
        pageY: number;
    }[];
}
interface MyTouchEvent {
    readonly altKey: boolean;
    readonly changedTouches: MyTouchList;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly shiftKey: boolean;
    readonly touches: MyTouchList;
}
interface MyTouchList {
    readonly length: number;
    item(index: number): MyTouch | null;
    [index: number]: MyTouch;
}
interface MyTouch {
    readonly pageX: number;
    readonly pageY: number;
}
export declare function TouchEventToCanvasTableTouchEvent(e: MyTouchEvent): CanvasTableTouchEvent;
export {};
