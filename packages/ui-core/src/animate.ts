type TRunParams = {
    startTime: number;
    currentTime: number;
    progress: number;
    duration: number;
    count: number;
}

type TAnimateOptions = {
    duration?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onProgress?: (params: TRunParams) => void
}

const REQ = requestAnimationFrame

export const runAnimate = (options: TAnimateOptions) => {
    const {
        duration = 1000,
        onStart,
        onEnd,
        onProgress,
    } = options
    let progress = 0
    const startTime = Date.now()
    let count = 0
    const loop = () => {
        count += 1
        const currentTime = Date.now()
        const dur = Math.min(duration, currentTime - startTime)
        const progress = dur / duration
        const params = {
            startTime,
            currentTime,
            progress,
            duration: dur,
            count,
        }
        if(typeof onProgress === 'function') {
            onProgress(params)
        }
        if(progress >= 1) {
            if(typeof onEnd === 'function') {
                onEnd()
            }
        } else {
            REQ(loop)
        }
    }
    if(typeof onStart === 'function') {
        onStart()
    }
    loop()
}
