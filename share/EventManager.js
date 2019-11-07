"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventManager {
    constructor() {
        this.eventClick = [];
        this.eventClickHeader = [];
    }
    EventManager() { }
    getEvent(eventName) {
        switch (eventName) {
            case "click":
                return this.eventClick;
            case "clickHeader":
                return this.eventClickHeader;
            default:
                throw "unknown;";
        }
    }
    fireClick(rowId, col) {
        for (var i = 0; i < this.eventClick.length; i++) {
            this.eventClick[i](rowId, col);
        }
    }
    fireClickHeader(col) {
        for (var i = 0; i < this.eventClick.length; i++) {
            this.eventClickHeader[i](col);
        }
    }
    addEvent(eventName, event) {
        this.getEvent(eventName).push(event);
    }
    removeEvent(eventName, event) {
        const e = this.getEvent(eventName);
        const index = e.indexOf(event);
        if (index != -1) {
            e.splice(index, 1);
        }
    }
}
exports.EventManager = EventManager;
