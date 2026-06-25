/**
 * Sort type
 * @description 並び替えの種類
 * @property {SortCategory} sortCategory - 並び替えの種類
 * @property {SortOrder} sortOrder - 並び替えの順序
 */

export type SortCategory = '作成日' | '最終更新' | 'お気に入りを優先'
export type SortOrder = '昇順' | '降順'
