/**
 * Message type
 * @description フォーム操作を行った後などのメッセージの型
 * @property {string} message - メッセージの内容
 * @property {'success' | 'error' | 'warning' | 'message'} messageType - メッセージの種類
 */
export type Message = {
    messageType: 'success' | 'error' | 'warning' | 'message'
    message: string
}
