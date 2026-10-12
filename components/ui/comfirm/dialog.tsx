import { Button } from '@/components/ui/button'
import { Dialog } from 'radix-ui'
import { CircleX } from 'lucide-react'
import { MESSAGE_ICONS } from '@/lib/consts/massageIcon'

const ConfirmDialog = ({
    open,
    onOpenChange,
    onConfirm,
    title = 'アカウントを削除しますか？',
    description = 'この操作は元に戻せません',
    confirmText = '削除',
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
    title?: string
    description?: string
    confirmText?: string
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-background-modal fixed inset-0 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="bg-background-surface fixed left-1/2 top-1/2 w-pcvw-[400] max-md:w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-lg-pc max-md:rounded-lg-sp pt-16-pc max-md:pt-16-sp pb-24-pc max-md:pb-24-sp px-16-pc max-md:px-16-sp focus:outline-none data-[state=open]:animate-contentShow">
                    <div className="flex gap-y-16-pc max-md:gap-y-16-sp items-start">
                        <MESSAGE_ICONS.error
                            className="aspect-square text-text-error mr-8-pc max-md:mr-8-sp w-pcvw-[28] max-md:w-spvw-[28] shrink-0 block h-auto"
                            strokeWidth={2}
                        />
                        <Dialog.Title className="text-heading-h3-pc max-md:text-heading-h3-sp w-full">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <CircleX
                                className="aspect-square w-pcvw-[28] max-md:w-spvw-[28] ml-12-pc max-md:ml-12-sp shrink-0 block h-auto"
                                strokeWidth={2}
                            />
                        </Dialog.Close>
                    </div>
                    <Dialog.Description className="text-body-default-pc max-md:text-body-default-sp text-text-secondary mt-24-pc max-md:mt-24-sp whitespace-pre-line">
                        {description}
                    </Dialog.Description>
                    <div className="flex justify-space-between gap-x-16-pc max-md:gap-x-16-sp mt-48-pc max-md:mt-48-sp">
                        <Dialog.Close asChild>
                            <Button
                                variant={'default'}
                                size={'lg'}
                                className="w-full max-md:flex-1 max-md:basis-0 max-md:!px-16-sp"
                            >
                                キャンセル
                            </Button>
                        </Dialog.Close>
                        <Button
                            variant={'secondary'}
                            size={'lg'}
                            className="w-full max-md:flex-1 max-md:basis-0 max-md:!px-16-sp"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ConfirmDialog
