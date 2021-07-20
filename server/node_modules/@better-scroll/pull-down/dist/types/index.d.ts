import BScroll from '@better-scroll/core';
export declare type PullDownRefreshOptions = Partial<PullDownRefreshConfig> | true;
export interface PullDownRefreshConfig {
    threshold: number;
    stop: number;
}
declare module '@better-scroll/core' {
    interface CustomOptions {
        pullDownRefresh?: PullDownRefreshOptions;
    }
    interface CustomAPI {
        pullDownRefresh: PluginAPI;
    }
}
interface PluginAPI {
    finishPullDown(): void;
    openPullDown(config?: PullDownRefreshOptions): void;
    closePullDown(): void;
    autoPullDownRefresh(): void;
}
export default class PullDown implements PluginAPI {
    scroll: BScroll;
    static pluginName: string;
    private hooksFn;
    pulling: boolean;
    watching: boolean;
    options: PullDownRefreshConfig;
    cachedOriginanMinScrollY: number;
    currentMinScrollY: number;
    constructor(scroll: BScroll);
    private init;
    private handleBScroll;
    private handleOptions;
    private handleHooks;
    private registerHooks;
    private watch;
    private unwatch;
    private checkPullDown;
    private modifyBehaviorYBoundary;
    finishPullDown(): void;
    openPullDown(config?: PullDownRefreshOptions): void;
    closePullDown(): void;
    autoPullDownRefresh(): void;
}
export {};
