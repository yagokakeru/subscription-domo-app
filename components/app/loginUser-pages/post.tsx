import { Label } from '@/components/ui/label'

export function PostComponent() {
    return (
        <>
            <h2 className="font-bold text-2xl mb-4">Post page</h2>

            <form>
                <Label>台本</Label>
                <textarea
                    className="border-2 border-solid border-gray-400 rounded flex items-center justify-center w-96"
                    name="post"
                    id="post"
                    rows={9}
                ></textarea>
            </form>
        </>
    )
}
