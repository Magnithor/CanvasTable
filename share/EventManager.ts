import { CanvasTableColumnConf } from "./CanvasTableColum";

export type EventManagerClick = (rowId:number, col:CanvasTableColumnConf)=>void;
export type EventManagerClickHeader = (col:CanvasTableColumnConf)=>void;
export class EventManager {
    private eventClick: EventManagerClick[] = [];
    private eventClickHeader: EventManagerClickHeader[] = [];
    public EventManager() { }

    private getEvent(eventName: string): any[] {
        switch(eventName) {
            case "click":
                return this.eventClick;
            case "clickHeader":
                return this.eventClickHeader;
            default:
                throw "unknown;"
        }
    }

    public fireClick(rowId: number, col:CanvasTableColumnConf) {
        for (var i =0; i < this.eventClick.length; i++) {
            this.eventClick[i](rowId, col);
        }
    }
    public fireClickHeader(col:CanvasTableColumnConf) {
        for (var i =0; i < this.eventClick.length; i++) {
            this.eventClickHeader[i](col);
        }
    }

    public addEvent(eventName: "clickHeader", event:EventManagerClickHeader): void;
    public addEvent(eventName: "click", event:EventManagerClick): void;
    public addEvent(eventName: string, event:any):void {
        this.getEvent(eventName).push(event);
    }

    public removeEvent(eventName:"clickHeader", event:EventManagerClickHeader): void;
    public removeEvent(eventName:"click", event:EventManagerClick): void;
    public removeEvent(eventName:string, event:any): void {
        const e = this.getEvent(eventName);
        const index = e.indexOf(event);
        if (index != -1) {
            e.splice(index, 1);
        }
    }
}