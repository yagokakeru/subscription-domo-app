export type script = {
    success: boolean
    data?: {
        id: number
        user_id: string
        title: string
        script: string
        favorite: boolean
        inserted_at: string
        updated_at: string
    }[]
    error?: string
}
