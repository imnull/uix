"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGestureEvents = void 0;
const utils_1 = require("./utils");
const initGestureEvents = (element, options) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) {
        throw `Need a html-element to initialize gesture events.`;
    }
    const { onStart, onMove, onEnd, } = options;
    let point = null;
    const pointerdown = (0, utils_1.createEventBinder)(el, 'pointerdown', e => {
        (0, utils_1.setEventSilence)(e);
        if (typeof onStart === 'function') {
            onStart();
        }
        point = (0, utils_1.getEventPoint)(e);
        pointermove.attach();
        pointerup.attach();
    });
    const pointermove = (0, utils_1.createEventBinder)(document, 'pointermove', e => {
        (0, utils_1.setEventSilence)(e);
        if (!point) {
            return;
        }
        const p = (0, utils_1.getEventPoint)(e);
        if (!p) {
            return;
        }
        const x = p.x - point.x;
        const y = p.y - point.y;
        const offset = { x, y };
        if (typeof onMove === 'function') {
            onMove(offset);
        }
    });
    const pointerup = (0, utils_1.createEventBinder)(document, 'pointerup', e => {
        (0, utils_1.setEventSilence)(e);
        point = null;
        pointermove.detache();
        pointerup.detache();
        if (typeof onEnd === 'function') {
            onEnd();
        }
    });
    const contextmenu = (0, utils_1.createEventBinder)(el, 'contextmenu', utils_1.setEventSilence);
    const R = {
        init: () => {
            pointerdown.attach();
            contextmenu.attach();
        },
        dispose: () => {
            pointerdown.detache();
            pointermove.detache();
            pointerup.detache();
            contextmenu.detache();
        }
    };
    return R;
};
exports.initGestureEvents = initGestureEvents;
