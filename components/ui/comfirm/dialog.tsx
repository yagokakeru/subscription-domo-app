import { Button } from '@/components/ui/button'
import { Dialog } from 'radix-ui'
import { CircleX } from 'lucide-react'
import { MESSAGE_ICONS } from '@/lib/consts/massageIcon'
import { deleteScript } from '@/lib/actions/script/deleteScript'
import { useRouter } from 'next/navigation'
import type { scriptFavoriteInfo } from '@/types/script'

const ConfirmDialog = ({
    open,
    onOpenChange,
    scriptInfo,
    title = 'アカウントを削除しますか？',
    description = 'この操作は元に戻せません',
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    scriptInfo: scriptFavoriteInfo
    title?: string
    description?: string
}) => {
    const router = useRouter()

    const handleDelete = async () => {
        await deleteScript(scriptInfo.data.id)
        router.refresh()
    }

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-background-modal fixed inset-0 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="bg-background-surface fixed left-1/2 top-1/2 w-pcvw-[400] -translate-x-1/2 -translate-y-1/2 rounded-lg-pc pt-16-pc pb-24-pc px-16-pc focus:outline-none data-[state=open]:animate-contentShow">
                    <div className="flex gap-y-16-pc items-start">
                        <MESSAGE_ICONS.error
                            className="aspect-square text-text-error mr-8-pc w-pcvw-[28] shrink-0 block h-auto"
                            strokeWidth={2}
                        />
                        <Dialog.Title className="text-heading-h3-pc w-full">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <CircleX
                                className="aspect-square w-pcvw-[28] ml-12-pc shrink-0 block h-auto"
                                strokeWidth={2}
                            />
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="text-body-default-pc text-text-secondary mt-24-pc whitespace-pre-line">
                        {description}
                    </Dialog.Description>
                    <div className="flex justify-space-between gap-x-16-pc mt-48-pc">
                        <Dialog.Close asChild>
                            <Button
                                variant={'default'}
                                size={'lg'}
                                className="w-full"
                            >
                                キャンセル
                            </Button>
                        </Dialog.Close>
                        <Button
                            variant={'secondary'}
                            size={'lg'}
                            className="w-full"
                            onClick={handleDelete}
                        >
                            削除
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ConfirmDialog
