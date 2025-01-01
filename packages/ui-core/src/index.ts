import {
    getEventPoint,
    createEventBinder,
    setEventSilence,
    TPoint,
} from './utils'

export const initGestureEvents = (element: HTMLElement | string, options: {
    onStart: () => void;
    onMove: (p: TPoint) => void;
    onEnd: () => void;
}) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if(!el) {
        throw `Need a html-element to initialize gesture events.`
    }
    const {
        onStart,
        onMove,
        onEnd,
    } = options
    let point: TPoint | null = null
    let locked = false
    const pointerdown = createEventBinder(el, 'pointerdown', e => {
        setEventSilence(e)
        if(locked) {
            return
        }
        if(typeof onStart === 'function') {
            onStart()
        }
        point = getEventPoint(e)
        pointermove.attach()
        pointerup.attach()
    })

    const pointermove = createEventBinder(document, 'pointermove', e => {
        setEventSilence(e)
        if(!point) {
            return
        }
        const p = getEventPoint(e)
        if(!p) {
            return
        }
        const x = p.x - point.x
        const y = p.y - point.y
        const offset: TPoint = { x, y }
        if(typeof onMove === 'function') {
            onMove(offset)
        }
    })

    const pointerup = createEventBinder(document, 'pointerup', e => {
        setEventSilence(e)
        point = null
        pointermove.detache()
        pointerup.detache()
        if(typeof onEnd === 'function') {
            onEnd()
        }
    })

    const contextmenu = createEventBinder(el, 'contextmenu', setEventSilence)

    const R = {
        lock: (status: boolean) => {
            locked = status
            return R
        },
        init: () => {
            pointerdown.attach()
            contextmenu.attach()
        },
        dispose: () => {
            pointerdown.detache()
            pointermove.detache()
            pointerup.detache()
            contextmenu.detache()
        }
    }

    return R
}

export const calDampingOffset = (dOffset: number, size: number, limit: number, threshold: number, damping: number) => {
    const abs = Math.abs(dOffset)
    const sign = Math.sign(dOffset)
    let offset = abs
    if(offset > size * threshold) {
        offset = size * threshold + ((abs - size * threshold) * damping)
    }
    offset = Math.min(size * limit, offset)
    return offset * sign
}

export {
    getEventPoint,
    createEventBinder,
    setEventSilence,
    TPoint,
}

export { rpxToPx, rpxToVw, getEventNames, TEventNames } from './utils'