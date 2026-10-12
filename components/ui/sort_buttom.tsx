import { Menubar } from 'radix-ui'
import { CheckIcon } from '@radix-ui/react-icons'
import { CircleArrowDown } from 'lucide-react'
import type { SortCategory, SortOrder } from '@/types/sort'

// 並び替えの種類の配列
const CATEGORY_ITEMS: SortCategory[] = [
    '作成日',
    '最終更新',
    'お気に入りを優先',
]
// 並び替えの順序の配列
const ORDER_ITEMS: SortOrder[] = ['昇順', '降順']

// SortButtonのpropsの型
type SortButtonProps = {
    sortCategory: SortCategory
    sortOrder: SortOrder
    onChangeCategory: (category: SortCategory) => void
    onChangeOrder: (order: SortOrder) => void
}

const SortButton = ({
    sortCategory,
    sortOrder,
    onChangeCategory,
    onChangeOrder,
}: SortButtonProps) => {
    return (
        <Menubar.Root>
            <Menubar.Menu>
                <Menubar.Trigger
                    className="
						flex items-center justify-center gap-x-8-pc max-md:gap-x-8-sp rounded-lg-pc max-md:rounded-lg-sp font-base outline-none
						disabled:pointer-events-none disabled:bg-background-disabled disabled:content-disabled
						transition-colors duration-button ease-button
					
						bg-background-surface border-border border-solid border
						hover:bg-background-surface-hover
						active:bg-background-surface-active
						
						text-body-strong-pc max-md:text-body-strong-sp px-32-pc max-md:px-32-sp py-12-pc max-md:py-12-sp max-md:whitespace-nowrap
					"
                >
                    <div>{sortCategory}</div>
                    <CircleArrowDown
                        className={`block w-pcvw-[20] max-md:w-spvw-[20] h-auto ${sortOrder === ORDER_ITEMS[0] ? 'rotate-180' : ''}`}
                    />
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content
                        className="bg-background-surface rounded-lg-pc max-md:rounded-lg-sp py-12-pc max-md:py-12-sp"
                        align="start"
                        sideOffset={5}
                    >
                        <Menubar.Group>
                            <Menubar.Label className="text-body-notice-pc max-md:text-body-notice-sp px-16-pc max-md:px-16-sp mb-8-pc max-md:mb-8-sp">
                                並び替え
                            </Menubar.Label>
                            {CATEGORY_ITEMS.map((item) => (
                                <Menubar.CheckboxItem
                                    className="cursor-pointer py-4-pc max-md:py-4-sp pr-16-pc max-md:pr-16-sp pl-48-pc max-md:pl-48-sp outline-none text-body-small-pc max-md:text-body-small-sp relative data-[state=checked]:bg-background-surface-active hover:bg-background-surface-hover"
                                    key={item}
                                    checked={sortCategory === item}
                                    onCheckedChange={() =>
                                        onChangeCategory(item)
                                    }
                                >
                                    <Menubar.ItemIndicator className="absolute left-16-pc max-md:left-16-sp top-1/2 -translate-y-1/2">
                                        <CheckIcon className="block w-pcvw-[16] max-md:w-spvw-[16] h-auto" />
                                    </Menubar.ItemIndicator>
                                    {item}
                                </Menubar.CheckboxItem>
                            ))}
                        </Menubar.Group>
                        <Menubar.Separator className="bg-border my-12-pc max-md:my-12-sp w-full h-px" />
                        <Menubar.Group>
                            <Menubar.Label className="text-body-notice-pc max-md:text-body-notice-sp px-16-pc max-md:px-16-sp mb-8-pc max-md:mb-8-sp">
                                並び替え順
                            </Menubar.Label>
                            {ORDER_ITEMS.map((item) => (
                                <Menubar.CheckboxItem
                                    className="cursor-pointer py-4-pc max-md:py-4-sp pr-16-pc max-md:pr-16-sp pl-48-pc max-md:pl-48-sp outline-none text-body-small-pc max-md:text-body-small-sp relative data-[state=checked]:bg-background-surface-active hover:bg-background-surface-hover"
                                    key={item}
                                    checked={sortOrder === item}
                                    onCheckedChange={() => onChangeOrder(item)}
                                >
                                    <Menubar.ItemIndicator className="absolute left-16-pc max-md:left-16-sp top-1/2 -translate-y-1/2">
                                        <CheckIcon className="block w-pcvw-[16] max-md:w-spvw-[16] h-auto" />
                                    </Menubar.ItemIndicator>
                                    {item}
                                </Menubar.CheckboxItem>
                            ))}
                        </Menubar.Group>
                    </Menubar.Content>
                </Menubar.Portal>
            </Menubar.Menu>
        </Menubar.Root>
    )
}

export default SortButton
