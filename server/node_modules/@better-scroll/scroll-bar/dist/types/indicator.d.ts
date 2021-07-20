import BScroll, { TranslaterPoint } from '@better-scroll/core';
import EventHandler from './event-handler';
import { Direction } from './index';
export interface IndicatorOption {
    wrapper: HTMLElement;
    direction: Direction;
    fade: boolean;
    interactive: boolean;
}
interface KeysMap {
    hasScroll: 'hasVerticalScroll' | 'hasHorizontalScroll';
    size: 'height' | 'width';
    wrapperSize: 'clientHeight' | 'clientWidth';
    scrollerSize: 'scrollerHeight' | 'scrollerWidth';
    maxScroll: 'maxScrollY' | 'maxScrollX';
    pos: 'y' | 'x';
    pointPos: 'pageX' | 'pageY';
    translate: 'translateY' | 'translateX';
}
interface KeyValues {
    maxPos: number;
    sizeRatio: number;
    initialSize: number;
}
export default class Indicator {
    bscroll: BScroll;
    options: IndicatorOption;
    wrapper: HTMLElement;
    wrapperStyle: CSSStyleDeclaration;
    el: HTMLElement;
    elStyle: CSSStyleDeclaration;
    direction: Direction;
    visible: number;
    keyVals: KeyValues;
    curPos: number;
    keysMap: KeysMap;
    eventHandler: EventHandler;
    private hooksHandlers;
    constructor(bscroll: BScroll, options: IndicatorOption);
    private _listenHooks;
    _getKeysMap(): KeysMap;
    fade(visible?: boolean): void;
    refresh(): void;
    private _setShowBy;
    private _refreshKeyValues;
    updatePosAndSize(endPoint: TranslaterPoint): void;
    private _refreshPosAndSizeValue;
    private _refreshPosAndSizeStyle;
    setTransitionTime(time?: number): void;
    setTransitionTimingFunction(easing: string): void;
    startHandler(): void;
    moveHandler(moved: boolean, delta: number): void;
    private _calScrollDesPos;
    endHandler(moved: boolean): void;
    destroy(): void;
    private _listen;
}
export {};
