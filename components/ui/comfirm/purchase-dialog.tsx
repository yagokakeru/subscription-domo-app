import { Button } from '@/components/ui/button'
import { Dialog } from 'radix-ui'
import { CircleX } from 'lucide-react'
import { MESSAGE_ICONS } from '@/lib/consts/massageIcon'
import { ReactNode } from 'react'
import Link from 'next/link'
import { LEGAL_PATHS } from '@/lib/consts/legal'
interface PurchaseConfirmDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
    title: string
    amount: number
    interval: string
    confirmText: string
    note?: ReactNode
}

/**
 * 購入確認ダイアログコンポーネント
 *
 * @component PurchaseConfirmDialog
 * @param open: ダイアログを開くかどうかの状態
 * @param onOpenChange: ダイアログの開閉状態が変更されたときに呼ばれるコールバック
 * @param onConfirm: 確認ボタンがクリックされたときに呼ばれるコールバック
 * @param title: ダイアログのタイトル（プラン名など）
 * @param amount: 金額
 * @param interval: 支払い間隔（例: '月'）
 * @param confirmText: 確認ボタンのテキスト
 * @param note: 補足情報（任意）
 *
 * @example
 * <PurchaseConfirmDialog
 *     open={true}
 *     onOpenChange={setRegularDialogOpen}
 *     onConfirm={handleConfirm}
 *     title="スタンダードプラン"
 *     amount={1000}
 *     interval="月"
 *     confirmText="購入する"
 * />
 */
const PurchaseConfirmDialog = ({
    open,
    onOpenChange,
    onConfirm,
    title,
    amount,
    interval, // '月'
    confirmText, // 「同意して申し込む」など
    note, // B-2で「差額は日割りで請求」などを足す用
}: PurchaseConfirmDialogProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-background-modal fixed inset-0 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="bg-background-surface fixed left-1/2 top-1/2 w-pcvw-[400] max-md:w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-lg-pc max-md:rounded-lg-sp pt-16-pc max-md:pt-16-sp pb-24-pc max-md:pb-24-sp px-16-pc max-md:px-16-sp focus:outline-none data-[state=open]:animate-contentShow">
                    <div className="flex gap-y-16-pc max-md:gap-y-16-sp items-start">
                        <MESSAGE_ICONS.message
                            className="aspect-square text-text-secondary mr-8-pc max-md:mr-8-sp w-pcvw-[28] max-md:w-spvw-[28] shrink-0 block h-auto"
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
                    <Dialog.Description
                        className="text-body-default-pc max-md:text-body-default-sp text-text-secondary mt-24-pc max-md:mt-24-sp"
                        asChild
                    >
                        <div>
                            <dl className="grid grid-cols-[auto_1fr] gap-x-16-pc gap-y-8-pc max-md:gap-x-16-sp max-md:gap-y-8-sp">
                                <dt className="text-body-strong-pc max-md:text-body-strong-sp text-text">
                                    料金
                                </dt>
                                <dd>
                                    {interval}額{' '}
                                    {amount.toLocaleString('ja-JP')}円（税込）
                                </dd>
                                <dt className="text-body-strong-pc max-md:text-body-strong-sp text-text">
                                    お支払い
                                </dt>
                                <dd>
                                    初回はお申し込み時、以降は毎月の更新日にクレジットカードで自動決済
                                </dd>
                                <dt className="text-body-strong-pc max-md:text-body-strong-sp text-text">
                                    契約期間
                                </dt>
                                <dd>1か月ごとの自動更新</dd>
                                <dt className="text-body-strong-pc max-md:text-body-strong-sp text-text">
                                    解約
                                </dt>
                                <dd>
                                    マイページからいつでも解約でき、契約期間の終了日まで利用できます。途中解約による返金はありません
                                </dd>
                            </dl>
                            {note}
                            <p>
                                <Link
                                    href={LEGAL_PATHS.TERMS}
                                    className="underline"
                                    target="_blank"
                                >
                                    利用規約
                                </Link>
                                ・
                                <Link
                                    href={LEGAL_PATHS.PRIVACY}
                                    className="underline"
                                    target="_blank"
                                >
                                    プライバシーポリシー
                                </Link>
                                に同意のうえお申し込みください。
                            </p>
                        </div>
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

export default PurchaseConfirmDialog
