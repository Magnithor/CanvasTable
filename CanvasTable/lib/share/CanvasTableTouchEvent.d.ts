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
export declare function TouchEventToCanvasTableTouchEvent(e: TouchEvent): CanvasTableTouchEvent;
