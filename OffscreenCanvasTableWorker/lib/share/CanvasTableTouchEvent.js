"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
function TouchEventToCanvasTableTouchEvent(e) {
    const x = { changedTouches: [], touches: [] };
    for (var i = 0; i < e.changedTouches.length; i++) {
        x.changedTouches.push({
            pageX: e.changedTouches[i].pageX,
            pageY: e.changedTouches[i].pageY
        });
    }
    for (var i = 0; i < e.touches.length; i++) {
        x.touches.push({
            pageX: e.touches[i].pageX,
            pageY: e.touches[i].pageY
        });
    }
    return x;
}
exports.TouchEventToCanvasTableTouchEvent = TouchEventToCanvasTableTouchEvent;
//# sourceMappingURL=CanvasTableTouchEvent.js.map