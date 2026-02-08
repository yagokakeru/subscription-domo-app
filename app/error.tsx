'use client'

export default function Error({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    return (
        <div>
            <p>エラーメッセージ：{error.message}</p>
            <button onClick={reset}>再読み込み</button>
        </div>
    )
}
