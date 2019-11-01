import { Drawable } from "./Drawable";
import { CircularBuffer } from 'mthb-circular-buffer';
import { CanvasContext2D } from "./CanvasContext2D";
import { CanvasTableTouchEvent } from 'mthb-canvas-table-touch-event';

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): number;

interface MouseMove {
    x: number;
    y: number;
    time: Date;
}
export class ScrollView {
    private drawable: Drawable;
    private askForExtentedMouseMoveAndMaouseUp: () => void;
    private askForNormalMouseMoveAndMaouseUp: () => void;
    private canvasWidth: number = -1;
    private canvasHeight: number = -1;
    private context: CanvasContext2D;
    private height?: number;
    private width?: number;
    private r: number = 1;
    private timeout?: number;

    private hasScrollBarY: boolean = false;
    private scrollBarThumbDownY: boolean = false;
    private isOverScrollUpY: boolean = false;
    private isOverScrollDownY: boolean = false;
    private isOverScollThumbY: boolean = false;
    private posYvalue: number = 0;
    private scrollBarThumbMinY: number = -1;
    private scrollBarThumbMaxY: number = -1;
    private scrollBarPosMaxY: number = 0;
    private pageY: number = -1;
    private touchStartY: number = -1;

    private hasScrollBarX: boolean = false;
    private scrollBarThumbDownX: boolean = false;
    private isOverScrollUpX: boolean = false;
    private isOverScrollDownX: boolean = false;
    private isOverScollThumbX: boolean = false;
    private posXvalue: number = 0;
    private scrollBarThumbMinX: number = -1;
    private scrollBarThumbMaxX: number = -1;
    private scrollBarPosMaxX: number = 0;
    private pageX: number = -1;
    private touchStartX: number = 1;

    private lastmove: CircularBuffer<MouseMove>;

    private scrollbarSize = 20;
    private cellHeight = 20;
    private run: boolean = false;
    private runXOrY: boolean = false;
    private runStart: number = -1;
    private speed: number = 1;


    public constructor(context: CanvasContext2D, drawable: Drawable, askForExtentedMouseMoveAndMaouseUp: () => void, askForNormalMouseMoveAndMaouseUp: () => void) {
        this.askForExtentedMouseMoveAndMaouseUp = askForExtentedMouseMoveAndMaouseUp;
        this.askForNormalMouseMoveAndMaouseUp = askForNormalMouseMoveAndMaouseUp;
        this.drawable = drawable;
        this.lastmove = new CircularBuffer<MouseMove>(100, true);
        this.context = context;
    }

    get posY(): number {
        return this.posYvalue;
    }
    set posY(value: number) {
        if (!this.hasScrollBarY) {
            value = 0;
        }
        
        if (value < 0) {
            value = 0;
        }
        else {
            if (value > this.scrollBarPosMaxY) {
                value = this.scrollBarPosMaxY;
            }
        }

        if (this.posYvalue != value) {
            this.posYvalue = value;
            this.drawable.askForReDraw();
        }
    }

    get posX(): number {
        return this.posXvalue;
    }
    set posX(value: number) {
        if (!this.hasScrollBarX) {
            value = 0;
        }
        
        if (value < 0) {
            value = 0;
        }
        else {
            if (value > this.scrollBarPosMaxX) {
                value = this.scrollBarPosMaxX;
            }
        }

        if (this.posXvalue != value) {
            this.posXvalue = value;
            this.drawable.askForReDraw();
        }
    }

    public setSize(r:number, canvasWidth:number, canvasHeight:number, width?: number, height?: number) {        
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.width = width;
        this.height = height;
        this.r = r;

        if (this.height === undefined || this.width === undefined) {
            this.hasScrollBarX = false;
            this.hasScrollBarY = false
            return;
        }

        if ((this.height / (this.canvasHeight - (18 + this.scrollbarSize) * this.r) > 1) && (this.width / (this.canvasWidth - this.scrollbarSize * this.r) > 1)) {
            // has X and Y
            this.pageY = this.height / (this.canvasHeight - (18 + this.scrollbarSize) * this.r);
            if (this.pageY < 1) {
                this.hasScrollBarY = false;            
            } else {
                this.hasScrollBarY = true;
                this.scrollBarPosMaxY  = this.height - (this.canvasHeight - (18 + this.scrollbarSize) * this.r);        
            }

            this.pageX = this.width / (this.canvasWidth - this.scrollbarSize * this.r);
            if (this.pageX < 1) {
                this.hasScrollBarX = false;            
            } else {
                this.hasScrollBarX = true;
                this.scrollBarPosMaxX  = this.width - (this.canvasWidth - this.scrollbarSize * this.r);        
            }
        } else {
            // has x or Y
            this.pageY = this.height / (this.canvasHeight - 18 * this.r);
            if (this.pageY < 1) {
                this.hasScrollBarY = false;            
            } else {
                this.hasScrollBarY = true;
                this.scrollBarPosMaxY  = this.height - (this.canvasHeight - 18 * this.r);        
            }

            this.pageX = this.width / this.canvasWidth;
            if (this.pageX < 1) {
                this.hasScrollBarX = false;            
            } else {
                this.hasScrollBarX = true;
                this.scrollBarPosMaxX  = this.width - this.canvasWidth;        
            }
        }

        if (this.posY > this.height - this.canvasWidth) { this.posY = this.height - this.canvasWidth; }
        if (this.posX > this.width - this.canvasWidth) { this.posX = this.width - this.canvasWidth; }
    }

    public beforeDraw(): boolean{
        if (this.run) {
            if (this.runStart === -1) {
                if (this.runXOrY){
                    this.posY -= (this.speed * this.r);
                } else {
                    this.posX -= (this.speed * this.r);
                }
                return true;
            }
            const time = (new Date()).getTime() - this.runStart;
            if (time < 1500) {
                if (this.runXOrY) {
                    this.posY -= (this.speed * this.r) * (1-time/1500);
                } else {
                    this.posX -= (this.speed * this.r) * (1-time/1500);
                }
                return true;
            }
        }
        return false;
    }
    public OnKeydown(keyCode: number): boolean {
        switch (keyCode) {
            case 33: // pagedown
                this.posY -= this.canvasHeight;
                return true;
            case 34: // pageup
                this.posY += this.canvasHeight;
                return true;
            case 38: // up
                this.posY -= this.cellHeight * this.r;
                return true;
            case 40: // down
                this.posY += this.cellHeight * this.r;
                return true;
            default:
                return false;
        }        
    }
    public OnTouchStart(e:CanvasTableTouchEvent, offsetLeft: number, offsetTop:number):boolean {
        this.run = false;
        this.lastmove.clear();
        const y = e.changedTouches[0].pageY - offsetTop;
        const x = e.changedTouches[0].pageX - offsetLeft;
        if (this.scrollClick(x, y, true)) {            
            return true;
        }
        this.touchStartY = e.changedTouches[0].pageY;
        this.touchStartX = e.changedTouches[0].pageX;
        this.lastmove.push({ x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, time: new Date() });

        return false;
    }
    public OnTouchMove(e:CanvasTableTouchEvent, offsetLeft: number, offsetTop:number) {       
        this.run = false;
        if (this.scrollBarThumbDownY) {
            const y = e.changedTouches[0].pageY - offsetTop;
            this.posY = this.scrollBarPosMaxY * ((y - 20) / (this.canvasHeight / this.r - 20 * 2));
            return;
        }

        if (this.scrollBarThumbDownX) {
            const x = e.changedTouches[0].pageX - offsetLeft;
            this.posX = this.scrollBarPosMaxX * (x / (this.canvasWidth / this.r - 20 * 2));
            return;
        }

        if (this.lastmove.size() === 0) {
            return;
        }

        this.lastmove.push({ x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, time: new Date() });
        this.posY -=  (e.changedTouches[0].pageY - this.touchStartY) * this.r;
        this.posX -=  (e.changedTouches[0].pageX - this.touchStartX) * this.r;
        
        this.touchStartY = e.changedTouches[0].pageY;
        this.touchStartX = e.changedTouches[0].pageX;
    }
    public OnTouchEnd(e:CanvasTableTouchEvent) {
        if (e.touches.length === 0) {
            let needToReDraw = false;    
            if (this.isOverScollThumbY) {
                this.isOverScollThumbY = false;
                needToReDraw = true;
            }
            if (this.isOverScrollUpY) {
                this.isOverScrollUpY = false;
                needToReDraw = true;
            }
            if (this.isOverScrollDownY) {
                this.isOverScrollDownY = false;
                needToReDraw = true;
            }
            if (this.isOverScollThumbX) {
                this.isOverScollThumbX = false;
                needToReDraw = true;
            }
            if (this.isOverScrollUpX) {
                this.isOverScrollUpX = false;
                needToReDraw = true;
            }
            if (this.isOverScrollDownX) {
                this.isOverScrollDownX = false;
                needToReDraw = true;
            }
            if (needToReDraw) {
                this.drawMe();
            }
            this.scrollBarThumbDownY = false;
            this.scrollBarThumbDownX = false;
            if (this.run || this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = undefined;
                this.run = false;     
            }       
        }

        const list = this.lastmove.export();
        if (list.length > 2) {
            var i = list.length - 2;
            for (; i >= 0 && (list[list.length - 1].time.getTime() - list[i].time.getTime()) < 1000; i--) { }
            if (i < 0) { i = 0;}
            const time = list[list.length-1].time.getTime() - list[i].time.getTime();
            const speedY = this.r * (list[list.length-1].y - list[i].y) / time;

            if (Math.abs(speedY) > 1)
            {
                this.speed = speedY * 10;
                this.runXOrY = true;
                this.run = true;
                this.runStart = (new Date()).getTime();
                this.drawable.askForReDraw();
                return;
            }

            const speedX = this.r * (list[list.length-1].x - list[i].x) / time;

            if (Math.abs(speedX) > 1)
            {
                this.speed = speedX * 10;
                this.runXOrY = false;
                this.run = true;
                this.runStart = (new Date()).getTime();
                this.drawable.askForReDraw();
                return;
            }
        }
    }
    public onScroll = (deltaMode:number, deltaX: number, deltaY:number) => {
        switch (deltaMode) {
            case 0: // DOM_DELTA_PIXEL	0x00	The delta values are specified in pixels.
                this.posY += deltaY;
                this.posX += deltaX;
                break;
            case 1: // DOM_DELTA_LINE	0x01	The delta values are specified in lines.
                this.posY += deltaY * this.cellHeight * this.r;
                this.posX += deltaX * this.cellHeight * this.r;
                break;
            case 2: // DOM_DELTA_PAGE	0x02	The delta values are specified in pages.
                this.posY += deltaY * this.canvasHeight * this.r;
                this.posX += deltaX * this.canvasWidth * this.r;
                break;
            default:
                // uups
                return;
        }

        this.fixPos();
    }
    public onMouseLeave() {
        var needToReDraw = false;
        if (this.isOverScollThumbY && !this.scrollBarThumbDownY) {
            this.isOverScollThumbY = false;
            needToReDraw = true;
        }
        if (this.isOverScrollUpY) {
            this.isOverScrollUpY = false;
            needToReDraw = true;
        }
        if (this.isOverScrollDownY) {
            this.isOverScrollDownY = false;
            needToReDraw = true;
        }

        if (this.isOverScollThumbX && !this.scrollBarThumbDownX) {
            this.isOverScollThumbX = false;
            needToReDraw = true;
        }
        if (this.isOverScrollUpX) {
            this.isOverScrollUpX = false;
            needToReDraw = true;
        }
        if (this.isOverScrollDownX) {
            this.isOverScrollDownX = false;
            needToReDraw = true;
        }

        if (needToReDraw) {
            this.drawMe();
        }
    }
    public onExtendedMouseUp(x: number, y: number): boolean{
        this.askForNormalMouseMoveAndMaouseUp.call(this.drawable);

        this.scrollBarThumbDownY = false;
        this.scrollBarThumbDownX = false;
        if (this.isOverScollThumbY && (
            x > this.canvasWidth / this.r
            || (x < this.canvasWidth / this.r - this.scrollbarSize) 
            || (this.scrollBarThumbMinY > y)
            || (y > this.scrollBarThumbMaxY) 
            )) {
            this.isOverScollThumbY = false;
            this.drawMe();
        }

        if (this.isOverScollThumbX && (
            y > this.canvasHeight / this.r
            || (y < this.canvasHeight / this.r - this.scrollbarSize) 
            || (this.scrollBarThumbMinX > x)
            || (x > this.scrollBarThumbMaxX) 
            )) {
            this.isOverScollThumbY = false;
            this.drawMe();
        }

        return false;
    }
    public onExtendedMouseMove(x: number, y: number): boolean {
        if (this.scrollBarThumbDownY) {
            this.posY = this.scrollBarPosMaxY * ((y - 20) / (this.canvasHeight / this.r - 20 * 2));
        }
        if (this.scrollBarThumbDownX) {
            this.posX = this.scrollBarPosMaxX * (x / (this.canvasWidth / this.r - 20 * 2));
        }
        return true;
    }
    public onMouseDown(x: number, y: number): boolean {
        return this.scrollClick(x, y, false);
    }
    public onMouseMove(x: number, y: number): boolean {
        if (!this.hasScrollBarY && !this.hasScrollBarX) { return false; }

        const canvasWidth = this.canvasWidth / this.r;
        const canvasHeight = this.canvasHeight / this.r;

        if (this.hasScrollBarX && this.hasScrollBarY && x > canvasWidth - this.scrollbarSize && y > canvasHeight - this.scrollbarSize) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }
            
        if (( this.hasScrollBarX &&  this.hasScrollBarY && x < canvasWidth - this.scrollbarSize && y < canvasHeight - this.scrollbarSize) || 
            (!this.hasScrollBarX &&  this.hasScrollBarY && x < canvasWidth - this.scrollbarSize) ||
            ( this.hasScrollBarX && !this.hasScrollBarY && y < canvasHeight - this.scrollbarSize) ) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return false; 
        }    
        
        if (this.scrollBarThumbDownY) {
            this.posY = this.scrollBarPosMaxY * ((y-20) / (this.canvasHeight / this.r-20*2));
            return true;
        }

        if (this.scrollBarThumbDownX) {
            this.posX = this.scrollBarPosMaxX * ((x) / (this.canvasWidth / this.r-20*2));
            return true;
        }
        
        if (this.hasScrollBarY && y < 20) {
            if (!this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX)
            {
                this.isOverScrollUpY = true;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }

        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y > this.canvasHeight / this.r - 20 - (this.hasScrollBarX?this.scrollbarSize:0)) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || !this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX)
            {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = true;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }

        if (this.hasScrollBarY && this.scrollBarThumbMinY <= y && y <= this.scrollBarThumbMaxY) {
            if (this.isOverScrollUpY || !this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = true;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }

        if (this.hasScrollBarX && x < 20) {
            if (!this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX || this.isOverScrollUpY || !this.isOverScollThumbY || this.isOverScrollDownY)
            {
                this.isOverScrollUpX = true;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = false;
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.drawMe();
            }
            return true;
        }

        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x > this.canvasWidth / this.r - 20 - (this.hasScrollBarY?this.scrollbarSize:0)) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || !this.isOverScrollDownX)
            {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = false;
                this.isOverScrollDownX = true;
                this.drawMe();
            }
            return true;
        }

        if (this.hasScrollBarX && this.scrollBarThumbMinX <= x && x <= this.scrollBarThumbMaxX) {
            if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || !this.isOverScollThumbX || this.isOverScrollDownX) {
                this.isOverScrollUpY = false;
                this.isOverScollThumbY = false;
                this.isOverScrollDownY = false;
                this.isOverScrollUpX = false;
                this.isOverScollThumbX = true;
                this.isOverScrollDownX = false;
                this.drawMe();
            }
            return true;
        }

        if (this.isOverScrollUpY || this.isOverScollThumbY || this.isOverScrollDownY || this.isOverScrollUpX || this.isOverScollThumbX || this.isOverScrollDownX) {
            this.isOverScrollUpY = false;
            this.isOverScollThumbY = false;
            this.isOverScrollDownY = false;
            this.isOverScrollUpX = false;
            this.isOverScollThumbX = false;
            this.isOverScrollDownX = false;
            this.drawMe();
            return true;
        }

        return true;
    }
    public onMouseUp(x: number, y: number): boolean {
        this.scrollBarThumbDownY = false;

        this.isOverScollThumbY = false;
        this.drawMe();

        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
            this.run = false;
        }
        return false;
    }

    private scrollClick(x: number, y: number, isTouch: boolean): boolean {
        if (!this.hasScrollBarY && !this.hasScrollBarX) { return false; }

        const canvasWidth = this.canvasWidth / this.r;
        const canvasHeight = this.canvasHeight / this.r;
        if (this.hasScrollBarX && this.hasScrollBarY && x > canvasWidth - this.scrollbarSize && y > canvasHeight - this.scrollbarSize) {
            return true;
        }
            
        if (( this.hasScrollBarX &&  this.hasScrollBarY && x < canvasWidth - this.scrollbarSize && y < canvasHeight - this.scrollbarSize) || 
            (!this.hasScrollBarX &&  this.hasScrollBarY && x < canvasWidth - this.scrollbarSize) ||
            ( this.hasScrollBarX && !this.hasScrollBarY && y < canvasHeight - this.scrollbarSize) ) { 
            return false; 
        }            

        if (this.hasScrollBarY && y < 20) {
            if (this.posY === 0) { return true; }
            this.posY -= this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = +7;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y > canvasHeight - 20 - (this.hasScrollBarX?this.scrollbarSize:0)) {
            if (this.posY === this.scrollBarPosMaxY) { return true; }
            this.posY += this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = -7;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y > this.scrollBarThumbMaxY) {
            this.posY += canvasHeight - 20; 
            this.timeout = setTimeout(() => {
                this.speed = -14;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize && y < this.scrollBarThumbMinY) {
            this.posY -= canvasHeight - 20 ;
            this.timeout = setTimeout(() => {
                this.speed = +14;
                this.runStart = -1;
                this.runXOrY = true;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarY && x >= canvasWidth - this.scrollbarSize){
            this.scrollBarThumbDownY = true;
        }

        if (this.hasScrollBarX && x < 20) {
            if (this.posX === 0) { return true; }
            this.posX -= this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = +7;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        
        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x > canvasWidth - 20 - (this.hasScrollBarY?this.scrollbarSize:0)) {
            if (this.posX === this.scrollBarPosMaxY) { return true; }
            this.posX += this.cellHeight * this.r;
            this.timeout = setTimeout(() => {
                this.speed = -7;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x > this.scrollBarThumbMaxX) {
            this.posX += canvasHeight - 20; 
            this.timeout = setTimeout(() => {
                this.speed = -14;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize && x < this.scrollBarThumbMinX) {
            this.posX -= canvasHeight - 20 ;
            this.timeout = setTimeout(() => {
                this.speed = +14;
                this.runStart = -1;
                this.runXOrY = false;
                this.run = true;
                this.drawable.askForReDraw();
            }, 500);
            return true;
        }

        if (this.hasScrollBarX && y >= canvasHeight - this.scrollbarSize){
            this.scrollBarThumbDownX = true;
        }


        if (!isTouch) {
            this.askForExtentedMouseMoveAndMaouseUp.call(this.drawable);
        }

        return true;
    }

    private drawMe() {
        if (!this.drawable.isPlanToRedraw()) {
            this.draw();
        }
    }
        
    public draw() {
        if (this.height === undefined || this.width === undefined) {
            return;
        }

        if (this.hasScrollBarY) {
            const canvasHeight = this.canvasHeight - (this.hasScrollBarX ? this.scrollbarSize*this.r:0);
            const height = canvasHeight - this.r * 16 * 2;
            const ratioY = this.scrollBarPosMaxY === 0 ? 1 : (this.posY / this.scrollBarPosMaxY);        
            const scrollBarSizeY = Math.max(10 * this.r, (height / this.pageY));
            const scrollBarPosY = 16 * this.r + ratioY * (height - scrollBarSizeY);            
            this.scrollBarThumbMinY = scrollBarPosY / this.r;
            this.scrollBarThumbMaxY = (scrollBarPosY + scrollBarSizeY) / this.r;
                    

            this.context.fillStyle = '#f0f0f0';
            this.context.fillRect(this.canvasWidth - this.r * this.scrollbarSize, 0, this.r * this.scrollbarSize, canvasHeight);

            this.context.fillStyle = this.isOverScrollUpY ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.canvasWidth - this.r * 10, this.r * 3);
            this.context.lineTo(this.canvasWidth - this.r * 18, this.r * 13);
            this.context.lineTo(this.canvasWidth - this.r * 2, this.r * 13);
            this.context.fill();

            this.context.fillStyle = this.isOverScrollDownY ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.canvasWidth - this.r * 10, canvasHeight - this.r * 3);
            this.context.lineTo(this.canvasWidth - this.r * 18, canvasHeight - this.r * 13);
            this.context.lineTo(this.canvasWidth - this.r * 2, canvasHeight - this.r * 13);
            this.context.fill();

            this.context.fillStyle = this.isOverScollThumbY ? 'red' : '#b0b0b0';
    
            this.context.beginPath();
            this.context.moveTo(this.canvasWidth - this.r * this.scrollbarSize, scrollBarPosY);
            this.context.lineTo(this.canvasWidth, scrollBarPosY);
            this.context.lineTo(this.canvasWidth, scrollBarPosY + scrollBarSizeY);
            this.context.lineTo(this.canvasWidth - this.r * this.scrollbarSize, scrollBarPosY + scrollBarSizeY);
            this.context.fill();
        }

        if (this.hasScrollBarX) {
            const canvasWidth = this.canvasWidth - (this.hasScrollBarY ? this.scrollbarSize*this.r:0);
            const width = canvasWidth - this.r * 16 * 2;
            const ratioX = this.scrollBarPosMaxX === 0 ? 1 : (this.posX / this.scrollBarPosMaxX);        
            const scrollBarSizeX = Math.max(10 * this.r, (width / this.pageX));
            const scrollBarPosX = 16 * this.r + ratioX * (width - scrollBarSizeX);
            this.scrollBarThumbMinX = scrollBarPosX / this.r;
            this.scrollBarThumbMaxX = (scrollBarPosX + scrollBarSizeX) / this.r;
                    

            this.context.fillStyle = '#f0f0f0';
            this.context.fillRect(0, this.canvasHeight - this.r * this.scrollbarSize, canvasWidth, this.r * this.scrollbarSize);

            this.context.fillStyle = this.isOverScrollUpX ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(this.r * 3, this.canvasHeight - this.r * 10);
            this.context.lineTo(this.r * 13, this.canvasHeight - this.r * 18);
            this.context.lineTo(this.r * 13, this.canvasHeight - this.r * 2);
            this.context.fill();

            this.context.fillStyle = this.isOverScrollDownX ? 'red' : '#b0b0b0';
            this.context.beginPath();
            this.context.moveTo(canvasWidth - this.r * 3, this.canvasHeight - this.r * 10);
            this.context.lineTo(canvasWidth - this.r * 13, this.canvasHeight - this.r * 18);
            this.context.lineTo(canvasWidth - this.r * 13, this.canvasHeight - this.r * 2);
            this.context.fill();
            
            this.context.fillStyle = this.isOverScollThumbX ? 'red' : '#b0b0b0';
    
            this.context.beginPath();
            this.context.moveTo(scrollBarPosX, this.canvasHeight - this.r * this.scrollbarSize);
            this.context.lineTo(scrollBarPosX, this.canvasHeight);
            this.context.lineTo(scrollBarPosX + scrollBarSizeX, this.canvasHeight);
            this.context.lineTo(scrollBarPosX + scrollBarSizeX, this.canvasHeight - this.r * this.scrollbarSize);
            this.context.fill();
        }
        
        if (this.hasScrollBarX && this.hasScrollBarY) {
            this.context.fillStyle = '#f0f0f0';
            this.context.fillRect(this.canvasWidth - this.r * this.scrollbarSize, this.canvasHeight - this.r * this.scrollbarSize, this.r * this.scrollbarSize, this.r * this.scrollbarSize);   
        }
    }

    private fixPos() {
        if (!this.hasScrollBarY) {
            this.posY = 0;
            return;
        }
        
        if (this.posY < 0) {
            this.posY = 0;
        }
        else {
            if (this.posY > this.scrollBarPosMaxY) {
                this.posY = this.scrollBarPosMaxY;
            }
        }
    }
}