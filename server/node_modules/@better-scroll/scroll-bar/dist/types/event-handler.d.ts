import BScroll from '@better-scroll/core';
import { EventRegister, EventEmitter } from '@better-scroll/shared-utils';
import Indicator from './indicator';
interface EventHandlerOptions {
    disableMouse: boolean | '';
}
export default class EventHandler {
    indicator: Indicator;
    options: EventHandlerOptions;
    startEventRegister: EventRegister;
    moveEventRegister: EventRegister;
    endEventRegister: EventRegister;
    initiated: boolean;
    moved: boolean;
    private lastPoint;
    bscroll: BScroll;
    hooks: EventEmitter;
    constructor(indicator: Indicator, options: EventHandlerOptions);
    private _start;
    private _move;
    private _end;
    destroy(): void;
}
export {};
