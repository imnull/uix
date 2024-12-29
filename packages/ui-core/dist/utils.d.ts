export type TPoint = {
    x: number;
    y: number;
};
export type TEventNames = 'pointerdown' | 'pointermove' | 'pointerup';
export declare const isTouchable: () => boolean;
export declare const getEventSupportType: () => "touch" | "mouse";
export declare const getEventNames: () => Record<TEventNames, string>;
export declare const getEventPoint: (e: unknown) => TPoint | null;
export declare const createEventBinder: (element: Element | Document | Window, name: TEventNames | "contextmenu", callback: (e: unknown) => void) => {
    attach: () => /*elided*/ any;
    detache: () => /*elided*/ any;
};
export declare const setEventSilence: (e: unknown) => void;
