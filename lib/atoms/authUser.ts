import { atom } from 'jotai'
import type { userProfile } from '@/types/userProfile'

// ユーザーprofileを保持するAtom
export const userProfileAtom = atom<userProfile | null>(null)
