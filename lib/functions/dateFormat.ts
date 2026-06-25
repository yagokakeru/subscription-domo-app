/**
 * 日付をフォーマットする
 * @param dateStr 日付
 * @returns フォーマットされた日付(YYYY.MM.DD)
 */
export const dateFormat = (dateStr: string) => {
    const date = new Date(dateStr)

    const formatter = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    const formattedDate = formatter.format(date).replaceAll('/', '.')

    return formattedDate
}
