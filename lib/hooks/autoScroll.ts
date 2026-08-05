import { useRef, useCallback, type RefObject } from 'react'

export function useAutoScroll() {
    const rafIdRef = useRef<number | null>(null)
    const timeoutIdRef = useRef<number | null>(null)
    const isScrollingRef = useRef(false)

    /**
     * スクロールの終点（＝最大scrollTop）を取得
     *
     * @param element スクロールの対象要素
     * @returns スクロールの終点
     */
    const getScrollTargetY = useCallback((element: HTMLDivElement) => {
        return element.scrollHeight - element.clientHeight
    }, [])

    const convertScrollSpeedToPixelsPerSecond = useCallback(
        (prompterScrollSpeed: number) => {
            return 20 + (prompterScrollSpeed - 1) * 10
        },
        []
    )

    /**
     * 自動スクロール停止
     */
    const stopScroll = useCallback(() => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current)
            rafIdRef.current = null
        }
        if (timeoutIdRef.current !== null) {
            window.clearTimeout(timeoutIdRef.current)
            timeoutIdRef.current = null
        }
        isScrollingRef.current = false
    }, [])

    /**
     * 一定速度で自動スクロール開始
     *
     * @param element スクロールの対象要素
     * @param getTargetY 終点を取得する関数
     * @param getPixelsPerSecond 1秒あたりに進むpx数を取得する関数
     */
    const scrollToWithSpeed = useCallback(
        (
            element: HTMLDivElement,
            getTargetY: () => number,
            getPixelsPerSecond: () => number
        ) => {
            stopScroll()

            isScrollingRef.current = true
            let lastTime = performance.now()
            let currentY = element.scrollTop

            const animate = (currentTime: number) => {
                const elapsedSeconds = (currentTime - lastTime) / 1000
                const targetY = Math.max(getTargetY(), element.scrollTop)
                const pixelsPerSecond = getPixelsPerSecond()
                const nextY = Math.min(
                    currentY + pixelsPerSecond * elapsedSeconds,
                    targetY
                )

                element.scrollTop = nextY
                currentY = nextY
                lastTime = currentTime

                if (nextY < targetY && isScrollingRef.current) {
                    rafIdRef.current = requestAnimationFrame(animate)
                } else {
                    stopScroll()
                }
            }

            rafIdRef.current = requestAnimationFrame(animate)
        },
        [stopScroll]
    )

    /**
     * wheel時に自動スクロール停止
     *
     * @param element スクロールの対象要素
     */
    const enableWheelStop = useCallback(
        (element: HTMLDivElement) => {
            const handler = () => {
                if (isScrollingRef.current) {
                    stopScroll()
                }
            }

            element.addEventListener('wheel', handler, { passive: true })

            return () => {
                element.removeEventListener('wheel', handler)
            }
        },
        [stopScroll]
    )

    /**
     * 自動スクロール開始
     *
     * @param startRef スクロールの対象要素
     * @param getPrompterScrollSpeed スクロール速度を取得する関数
     */
    const handleStartScroll = useCallback(
        (
            startRef: RefObject<HTMLDivElement>,
            getPrompterScrollSpeed: () => number
        ) => {
            if (!startRef.current) return

            const scrollTargetElement = startRef.current

            scrollToWithSpeed(
                scrollTargetElement,
                () => getScrollTargetY(scrollTargetElement),
                () =>
                    convertScrollSpeedToPixelsPerSecond(
                        getPrompterScrollSpeed()
                    )
            )
        },
        [
            convertScrollSpeedToPixelsPerSecond,
            getScrollTargetY,
            scrollToWithSpeed,
        ]
    )

    /**
     * カウントダウン付きで自動スクロール開始
     *
     * @param startRef スクロールの対象要素
     * @param getPrompterScrollSpeed スクロール速度を取得する関数
     * @param countdownSeconds カウントダウン時間
     * @param onCountdownChange カウントダウン時間の変更を通知する関数
     */
    const handleStartScrollWithCountdown = useCallback(
        (
            startRef: RefObject<HTMLDivElement>,
            getPrompterScrollSpeed: () => number,
            countdownSeconds: number,
            onCountdownChange: (countdown: number | null) => void
        ) => {
            stopScroll()

            if (countdownSeconds <= 0) {
                onCountdownChange(null)
                handleStartScroll(startRef, getPrompterScrollSpeed)
                return
            }

            let remainingSeconds = countdownSeconds
            onCountdownChange(remainingSeconds)

            const tick = () => {
                remainingSeconds -= 1

                if (remainingSeconds <= 0) {
                    timeoutIdRef.current = null
                    onCountdownChange(null)
                    handleStartScroll(startRef, getPrompterScrollSpeed)
                    return
                }

                onCountdownChange(remainingSeconds)
                timeoutIdRef.current = window.setTimeout(tick, 1000)
            }

            timeoutIdRef.current = window.setTimeout(tick, 1000)
        },
        [handleStartScroll, stopScroll]
    )

    /**
     * 自動スクロールをリセット
     *
     * @param startRef スクロールの対象要素
     */
    const handleResetScroll = useCallback(
        (startRef: RefObject<HTMLDivElement>) => {
            stopScroll()

            if (startRef.current) {
                startRef.current.scrollTop = 0
            }
        },
        [stopScroll]
    )

    return {
        scrollToWithSpeed,
        stopScroll,
        enableWheelStop,
        handleStartScroll,
        handleStartScrollWithCountdown,
        handleResetScroll,
    }
}
