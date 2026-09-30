import { getActiveScriptIds } from '@/lib/actions/script/getActiveScriptIds'

/**
 * 指定した台本がロックされているかどうかを判定する関数
 * @param scriptId 台本のID
 * @returns ロックされている場合はtrue、そうでない場合はfalse
 */
export const isScriptLocked = async (scriptId: number): Promise<boolean> => {
    try {
        const activeScriptIds = await getActiveScriptIds()
        return activeScriptIds !== null && !activeScriptIds.has(scriptId)
    } catch (error) {
        console.error('ロック判定に失敗:', error)
        return false
    }
}
