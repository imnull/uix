export type TVector = { x: number; y: number; }
export type TVectorTime = TVector & { t: number }
/**
 * 方向
 * - 0: 没有移动，无方向
 * - 1: 水平方向
 * - 2: 垂直方向
 */
export type TDiredtion = 0 | 1 | 2
export type TEventNames = 'pointerdown' | 'pointermove' | 'pointerup' | 'contextmenu' | 'click'

export const isTouchable = () => {
    return 'ontouchstart' in window && navigator.maxTouchPoints > 0
}

export const getEventSupportType = () => {
    // if (typeof PointerEvent === 'function') {
    //     return 'pointer'
    // } else
    if (isTouchable()) {
        return 'touch'
    } else {
        return 'mouse'
    }
}

export const getEventNames = (): Record<TEventNames, string> => {
    const eventType = getEventSupportType()
    let pointerdown = 'mousedown'
    let pointermove = 'mousemove'
    let pointerup = 'mouseup'
    const contextmenu = 'contextmenu'
    const click = 'click'
    switch (eventType) {
        // case 'pointer': {
        //     pointerdown = 'pointerdown'
        //     pointermove = 'pointermove'
        //     pointerup = 'pointerup'
        //     break
        // }
        case 'touch': {
            pointerdown = 'touchstart'
            pointermove = 'touchmove'
            pointerup = 'touchend'
            break
        }
    }
    return { pointerdown, pointermove, pointerup, contextmenu, click }
}

export const getEventPoint = (e: unknown): TVectorTime | null => {
    if (e instanceof MouseEvent || (typeof PointerEvent === 'function' && e instanceof PointerEvent)) {
        return { x: e.clientX, y: e.clientY, t: e.timeStamp }
    } else if (e instanceof TouchEvent) {
        const touch = e.touches[0]
        if (touch) {
            return { x: touch.clientX, y: touch.clientY, t: e.timeStamp }
        }
    }
    return null
}

export const getEventPoints = (e: unknown): TVector[] => {
    if (e instanceof MouseEvent || (typeof PointerEvent === 'function' && e instanceof PointerEvent)) {
        return [{ x: e.clientX, y: e.clientY }]
    } else if (e instanceof TouchEvent) {
        const touches = Array.from(e.touches)
        return touches.map(touch => ({ x: touch.clientX, y: touch.clientY }))
    }
    return []
}

export const getEventTimeStamp = (e: unknown) => {
    if(e instanceof Event) {
        return e.timeStamp
    }
    return 0
}

export const getPointsDistance = (points: TVector[]) => {
    if(points.length < 2) {
        return 0
    }
    const [a, b] = points
    const x = b.x - a.x
    const y = b.y - a.y
    return Math.sqrt(x * x + y * y)
}

export const createEventBinder = (element: Element | Document | Window, name: TEventNames, callback: (e: unknown) => void) => {
    const eventName = getEventNames()[name]
    let attached = false
    const R = {
        attach: () => {
            if(!attached) {
                attached = true
                element.addEventListener(eventName, callback, { passive: false, capture: false })
            }
            return R
        },
        detache: () => {
            element.removeEventListener(eventName, callback, { capture: false })
            attached = false
            return R
        }
    }
    return R
}

export const setEventStop = (e: unknown) => {
    if(e instanceof Event) {
        e.stopPropagation()
    }
}

export const setEventSilence = (e: unknown) => {
    if(e instanceof Event) {
        e.stopPropagation()
        e.stopImmediatePropagation()
        if(e.cancelable) {
            e.preventDefault()
        }
    }
}

export const rpxToVw = (rpx: number, baseRpx = 750) => {
    return (rpx * 100 / baseRpx) + 'vw'
}
export const rpxToPx = (rpx: number, baseRpx = 750) => {
    return (rpx * window.innerWidth / baseRpx) + 'px'
}