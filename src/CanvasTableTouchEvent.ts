export interface CanvasTableTouchEvent {
    changedTouches: {pageX:number, pageY:number}[],
    touches: {pageX:number, pageY:number}[]
};

export function TouchEventToCanvasTableTouchEvent(e: TouchEvent):CanvasTableTouchEvent{
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