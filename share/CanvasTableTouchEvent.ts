export interface CanvasTableTouchEvent {
    changedTouches: {pageX:number, pageY:number}[],
    touches: {pageX:number, pageY:number}[]
};

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

export function TouchEventToCanvasTableTouchEvent(e: MyTouchEvent):CanvasTableTouchEvent{
    const x: CanvasTableTouchEvent = { changedTouches:[], touches:[] };
    for (var i = 0; i< e.changedTouches.length; i++){
        x.changedTouches.push({
            pageX : e.changedTouches[i].pageX, 
            pageY : e.changedTouches[i].pageY})
    }
    for (var i = 0; i< e.touches.length; i++){
        x.touches.push({
            pageX : e.touches[i].pageX, 
            pageY : e.touches[i].pageY})
    }
    return x;
}