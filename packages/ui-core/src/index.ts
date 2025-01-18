import {
    getEventPoint,
    createEventBinder,
    setEventSilence,
    TVector,
    TDiredtion,
    TVectorTime,
    getEventTimeStamp,
} from './utils'

const getDirection = (p: TVector, o: TVector): TDiredtion => {
    const x = Math.abs(p.x - o.x)
    const y = Math.abs(p.y - o.y)
    if(x === 0 && y === 0) {
        return 0
    } else {
        return x > y ? 1 : 2
    }
}

const DEG = Math.PI / 180

const testTrigger = (p: TVector, trigger?: (p: TVector) => boolean) => {
    if(typeof trigger !== 'function') {
        return true
    }
    return trigger(p)
}

const calSpeed = (points: TVectorTime[], endTime = 0): TVector => {
    if(points.length < 1) {
        return { x: 0, y: 0 }
    }
    const start = points[points.length - 2]
    const end = points[points.length - 1]
    const x = end.x - start.x
    const y = end.y - start.y
    const d = (endTime || end.t) - start.t
    if(d > 0) {
        return {
            x: x / d,
            y: y / d,
        }
    }
    return { x: 0, y: 0 }
}

export const initGestureEvents = (element: HTMLElement | string, options: {
    direction?: TDiredtion;
    movePenetration?: boolean;
    trigger?: (p: TVector) => boolean;
    onStart?: () => void;
    onMove?: (p: TVector) => void;
    onEnd?: (res: { start: TVector; end: TVector; offset: TVector; speed: TVector; startTime: number; endTime: number; }) => void;
}) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element
    if(!el) {
        throw `Need a html-element to initialize gesture events.`
    }
    let startTime = 0
    const {
        onStart,
        onMove,
        onEnd,
        trigger,
        direction = 0,
        movePenetration = false,
    } = options
    let point: TVector | null = null
    let locked = false
    let d: TDiredtion = 0

    const movePoints: TVectorTime[] = []

    const pointerdown = createEventBinder(el, 'pointerdown', e => {
        startTime = Date.now()
        movePoints.splice(0, movePoints.length)
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
        movePoints.push(p)
        if(d === 0) {
            d = getDirection(p, point)
        }
        if(d !== 0) {
            if((direction === 0 || d === direction)) {
                const x = p.x - point.x
                const y = p.y - point.y
                const offset: TVector = { x, y }
                if(testTrigger(offset, trigger)) {
                    if(typeof onMove === 'function') {
                        onMove(offset)
                    }
                }
                if(!movePenetration) {
                    setEventSilence(e)
                }
            }
        }
    })

    const pointerup = createEventBinder(document, 'pointerup', e => {
        // setEventStop(e)
        const start = point
        const end = movePoints[movePoints.length - 1] || null
        point = null
        d = 0
        pointermove.detache()
        pointerup.detache()
        if(typeof onEnd === 'function' && start && end) {
            const endTime = getEventTimeStamp(e)
            const offset: TVector = {
                x: end.x - start.x,
                y: end.y - start.y,
            }
            const speed = calSpeed(movePoints, endTime)
            const res = {
                start,
                end,
                offset,
                speed,
                startTime,
                endTime,
                duration: endTime - endTime,
            }
            onEnd(res)
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
    TVector as TPoint,
}

export { rpxToPx, rpxToVw, getEventNames, TEventNames } from './utils'

export { runAnimate } from './animate'