import { TPoint } from './utils';
export declare const initGestureEvents: (element: HTMLElement | string, options: {
    onStart: () => void;
    onMove: (p: TPoint) => void;
    onEnd: () => void;
}) => {
    init: () => void;
    dispose: () => void;
};
