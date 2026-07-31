import { useRef, useCallback, type RefObject } from 'react'

export function useAutoScroll() {
    const rafIdRef = useRef<number | null>(null)
    const timeoutIdRef = useRef<number | null>(null)
    const isScrollingRef = useRef(false)

    /**
     * スクロールの終点を取得
     *
     * @param element スクロールの対象要素
     * @returns スクロールの終点
     */
    const getScrollTargetY = useCallback((element: HTMLDivElement) => {
        return element.offsetTop + element.scrollHeight - window.innerHeight
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
     * 自動スクロール開始
     *
     * @param startY 始点
     * @param targetY 終点
     * @param duration スクロール時間（ms）
     */
    // const scrollToWithDuration = useCallback(
    //     (startY: number, targetY: number, duration: number) => {
    //         // すでに動いてたら止める（＝中断）
    //         stopScroll()

    //         isScrollingRef.current = true

    //         const currentY = window.scrollY
    //         const totalDistance = targetY - startY
    //         const remainingDistance = targetY - currentY
    //         // 始点-終点間の位置から残り時間を計算
    //         const remainingTime = Math.min(
    //             duration * (remainingDistance / totalDistance),
    //             duration
    //         )
    //         const startTime = performance.now()

    //         const animate = (currentTime: number) => {
    //             // 現在量
    //             const elapsed = currentTime - startTime
    //             // 進捗率の計算（進捗率 = 現在量（現在 − 始点）÷ 全体量（終点 − 始点））
    //             const progress = Math.min(elapsed / remainingTime, 1)

    //             /**
    //              * easeingの公式"Quad"
    //              * * easeInQuad(p) = p * p
    //              * * easeOutQuad(p) = 1 - (1 - p) * (1 - p)
    //              * * easeInOutQuad(p) =
    //              * *   p < 0.5
    //              * *     ? 2 * p * p
    //              * *     : 1 - Math.pow(-2 * p + 2, 2) / 2
    //              *
    //              * 区間の正規化をすることで複雑なeaseingをすることができる
    //              * 例.)0~0.25までの区間をeaseInにしたい場合
    //              * * ステップ① 区間を「0〜1」に引き伸ばす
    //              * * * localP = p / 0.25 = 4p
    //              * * ステップ② easeInQuad をかける
    //              * * * ease = (localP)² = (4p)² = 16p²
    //              * * ステップ③ 出力を「0〜0.25」に戻す
    //              * * * result = 0.25 * 16p² = 4p²
    //              * * 4をかけて「4 * p * p」になる
    //              */
    //             // easeInOut（なくてもOK）
    //             // const ease =
    //             //     progress < 0.5
    //             //         ? 2 * progress * progress
    //             //         : 1 - Math.pow(-2 * progress + 2, 2) / 2
    //             // window.scrollTo(0, remainingDistance + remainingDistance * ease)

    //             // 線形補完（式：A + (B - A) × t）
    //             // A：開始値
    //             // B：終了値
    //             // t：進捗率（0〜1）
    //             window.scrollTo(0, currentY + remainingDistance * progress)

    //             if (progress < 1 && isScrollingRef.current) {
    //                 requestAnimationFrame(animate)
    //             } else {
    //                 stopScroll()
    //             }
    //         }

    //         rafIdRef.current = requestAnimationFrame(animate)
    //     },
    //     [stopScroll]
    // )

    /**
     * 一定速度で自動スクロール開始
     *
     * @param getTargetY 終点を取得する関数
     * @param getPixelsPerSecond 1秒あたりに進むpx数を取得する関数
     */
    const scrollToWithSpeed = useCallback(
        (getTargetY: () => number, getPixelsPerSecond: () => number) => {
            stopScroll()

            isScrollingRef.current = true
            let lastTime = performance.now()
            let currentY = window.scrollY

            const animate = (currentTime: number) => {
                const elapsedSeconds = (currentTime - lastTime) / 1000
                const targetY = Math.max(getTargetY(), window.scrollY)
                const pixelsPerSecond = getPixelsPerSecond()
                const nextY = Math.min(
                    currentY + pixelsPerSecond * elapsedSeconds,
                    targetY
                )

                window.scrollTo(0, nextY)
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
     */
    const enableWheelStop = useCallback(() => {
        const handler = () => {
            if (isScrollingRef.current) {
                stopScroll()
            }
        }

        window.addEventListener('wheel', handler, { passive: true })

        return () => {
            window.removeEventListener('wheel', handler)
        }
    }, [stopScroll])

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
     */
    const handleResetScroll = useCallback(() => {
        stopScroll()
        window.scrollTo({ top: 0 })
    }, [stopScroll])

    return {
        // scrollToWithDuration,
        scrollToWithSpeed,
        stopScroll,
        enableWheelStop,
        handleStartScroll,
        handleStartScrollWithCountdown,
        handleResetScroll,
    }
}
