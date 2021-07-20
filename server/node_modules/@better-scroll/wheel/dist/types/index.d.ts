import BScroll from '@better-scroll/core';
import { EaseItem } from '@better-scroll/shared-utils';
export declare type WheelOptions = Partial<WheelConfig> | true;
export interface WheelConfig {
    selectedIndex: number;
    rotate: number;
    adjustTime: number;
    wheelWrapperClass: string;
    wheelItemClass: string;
    wheelDisabledItemClass: string;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        wheel?: WheelOptions;
    }
    interface CustomAPI {
        wheel: PluginAPI;
    }
}
interface PluginAPI {
    wheelTo(index?: number, time?: number, ease?: EaseItem): void;
    getSelectedIndex(): number;
}
export default class Wheel implements PluginAPI {
    scroll: BScroll;
    static pluginName: string;
    options: WheelConfig;
    wheelItemsAllDisabled: boolean;
    items: HTMLCollection;
    itemHeight: number;
    selectedIndex: number;
    target: EventTarget | null;
    constructor(scroll: BScroll);
    init(): void;
    private handleBScroll;
    private handleOptions;
    private handleHooks;
    private refreshBoundary;
    private handleSelectedIndex;
    getSelectedIndex(): number;
    wheelTo(index?: number, time?: number, ease?: EaseItem): boolean;
    private wheelToAfterClick;
    private transitionDuration;
    private timeFunction;
    private rotateX;
    private findNearestValidWheel;
    private checkWheelAllDisabled;
}
export {};
