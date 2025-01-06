import {
    getEventPoint,
    createEventBinder,
    setEventSilence,
    TPoint,
    TDiredtion,
    setEventStop,
} from './utils'

const getDirection = (p: TPoint, o: TPoint): TDiredtion => {
    const x = Math.abs(p.x - o.x)
    const y = Math.abs(p.y - o.y)
    if(x === 0 && y === 0) {
        return 0
    } else {
        return x > y ? 1 : 2
    }
}

const DEG = Math.PI / 180

const testTrigger = (p: TPoint, trigger?: (p: TPoint) => boolean) => {
    if(typeof trigger !== 'function') {
        return true
    }
    return trigger(p)
}

export const initGestureEvents = (element: HTMLElement | string, options: {
    direction?: TDiredtion;
    
    trigger?: (p: TPoint) => boolean;
    onStart?: () => void;
    onMove?: (p: TPoint) => void;
    onEnd?: () => void;
}) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if(!el) {
        throw `Need a html-element to initialize gesture events.`
    }
    const {
        onStart,
        onMove,
        onEnd,
        trigger,
        direction = 0,
    } = options
    let point: TPoint | null = null
    let locked = false
    let d: TDiredtion = 0
    const pointerdown = createEventBinder(el, 'pointerdown', e => {
        // setEventStop(e)
        if(locked) {
            return
        }
        if(typeof onStart === 'function') {
            onStart()
        }
        d = 0
        point = getEventPoint(e)
        pointermove.attach()
        pointerup.attach()
    })

    const pointermove = createEventBinder(document, 'pointermove', e => {
        if(!point) {
            return
        }
        const p = getEventPoint(e)
        if(!p) {
            return
        }
        if(d === 0) {
            d = getDirection(p, point)
        }
        if(d !== 0) {
            const x = p.x - point.x
            const y = p.y - point.y
            const offset: TPoint = { x, y }
            if((direction === 0 || d === direction) && testTrigger(offset, trigger)) {
                setEventSilence(e)
                if(typeof onMove === 'function') {
                    onMove(offset)
                }
            }
        }
    })

    const pointerup = createEventBinder(document, 'pointerup', e => {
        // setEventStop(e)
        point = null
        d = 0
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
        release: () => {
            point = null
            pointermove.detache()
            pointerup.detache()
        },
        dispose: () => {
            R.release()
            pointerdown.detache()
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

export { runAnimate } from './animate'