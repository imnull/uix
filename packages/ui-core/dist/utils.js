"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEventSilence = exports.createEventBinder = exports.getEventPoint = exports.getEventNames = exports.getEventSupportType = exports.isTouchable = void 0;
const isTouchable = () => {
    return 'ontouchstart' in window && navigator.maxTouchPoints > 0;
};
exports.isTouchable = isTouchable;
const getEventSupportType = () => {
    // if (typeof PointerEvent === 'function') {
    //     return 'pointer'
    // } else
    if ((0, exports.isTouchable)()) {
        return 'touch';
    }
    else {
        return 'mouse';
    }
};
exports.getEventSupportType = getEventSupportType;
const getEventNames = () => {
    const eventType = (0, exports.getEventSupportType)();
    let pointerdown = 'mousedown';
    let pointermove = 'mousemove';
    let pointerup = 'mouseup';
    switch (eventType) {
        // case 'pointer': {
        //     pointerdown = 'pointerdown'
        //     pointermove = 'pointermove'
        //     pointerup = 'pointerup'
        //     break
        // }
        case 'touch': {
            pointerdown = 'touchstart';
            pointermove = 'touchmove';
            pointerup = 'touchend';
            break;
        }
    }
    return { pointerdown, pointermove, pointerup };
};
exports.getEventNames = getEventNames;
const getEventPoint = (e) => {
    if (e instanceof MouseEvent || (typeof PointerEvent === 'function' && e instanceof PointerEvent)) {
        return { x: e.clientX, y: e.clientY };
    }
    else if (e instanceof TouchEvent) {
        const touch = e.touches[0];
        if (touch) {
            return { x: touch.clientX, y: touch.clientY };
        }
    }
    return null;
};
exports.getEventPoint = getEventPoint;
const createEventBinder = (element, name, callback) => {
    const eventName = (0, exports.getEventNames)()[name];
    let attached = false;
    const R = {
        attach: () => {
            if (!attached) {
                attached = true;
                element.addEventListener(eventName, callback, { passive: false, capture: false });
            }
            return R;
        },
        detache: () => {
            element.removeEventListener(eventName, callback, { capture: false });
            attached = false;
            return R;
        }
    };
    return R;
};
exports.createEventBinder = createEventBinder;
const setEventSilence = (e) => {
    if (e instanceof Event) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
    }
};
exports.setEventSilence = setEventSilence;
