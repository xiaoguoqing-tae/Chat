import BScroll from '@better-scroll/core';
import Indicator from './indicator';
export declare const enum Direction {
    Horizontal = "horizontal",
    Vertical = "vertical"
}
export declare type ScrollbarOptions = Partial<ScrollbarConfig> | true;
export interface ScrollbarConfig {
    fade: boolean;
    interactive: boolean;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        scrollbar?: ScrollbarOptions;
    }
}
export default class ScrollBar {
    static pluginName: string;
    indicators: Array<Indicator>;
    constructor(scroll: BScroll);
    private createIndicators;
    private createIndicatorElement;
    destroy(): void;
}
