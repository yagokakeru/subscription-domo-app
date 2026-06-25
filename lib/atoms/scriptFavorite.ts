import { atom } from 'jotai'
import type { scriptFavoriteInfo } from '@/types/script'

// 台本情報とお気に入り状態を保持するAtom
export const scriptFavoriteAtom = atom<scriptFavoriteInfo[]>([])
