import { Menubar } from 'radix-ui'
import { CheckIcon } from '@radix-ui/react-icons'
import { CircleArrowDown } from 'lucide-react'
import type { SortCategory, SortOrder } from '@/types/sort'

// 並び替えの種類の配列
const CATEGORY_ITEMS = ['作成日', '最終更新', 'お気に入りを優先']
// 並び替えの順序の配列
const ORDER_ITEMS = ['昇順', '降順']

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
						flex items-center justify-center gap-x-8-pc rounded-lg-pc font-base outline-none
						disabled:pointer-events-none disabled:bg-background-disabled disabled:content-disabled
						transition-colors duration-button ease-button
					
						bg-background-surface border-border border-solid border
						hover:bg-background-surface-hover
						active:bg-background-surface-active
						
						text-body-strong-pc px-32-pc py-12-pc
					"
                >
                    <div>{sortCategory}</div>
                    <CircleArrowDown
                        className={`block w-pcvw-[20] h-auto ${sortOrder === ORDER_ITEMS[0] ? 'rotate-180' : ''}`}
                    />
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content
                        className="bg-background-surface rounded-lg-pc py-12-pc"
                        align="start"
                        sideOffset={5}
                    >
                        <Menubar.Group>
                            <Menubar.Label className="text-body-notice-pc px-16-pc mb-8-pc">
                                並び替え
                            </Menubar.Label>
                            {CATEGORY_ITEMS.map((item) => (
                                <Menubar.CheckboxItem
                                    className="cursor-pointer py-4-pc pr-16-pc pl-48-pc outline-none text-body-small-pc relative data-[state=checked]:bg-background-surface-active hover:bg-background-surface-hover"
                                    key={item}
                                    checked={sortCategory === item}
                                    onCheckedChange={() =>
                                        onChangeCategory(item)
                                    }
                                >
                                    <Menubar.ItemIndicator className="absolute left-16-pc top-1/2 -translate-y-1/2">
                                        <CheckIcon className="block w-pcvw-[16] h-auto" />
                                    </Menubar.ItemIndicator>
                                    {item}
                                </Menubar.CheckboxItem>
                            ))}
                        </Menubar.Group>
                        <Menubar.Separator className="bg-border my-12-pc w-full h-px" />
                        <Menubar.Group>
                            <Menubar.Label className="text-body-notice-pc px-16-pc mb-8-pc">
                                並び替え順
                            </Menubar.Label>
                            {ORDER_ITEMS.map((item) => (
                                <Menubar.CheckboxItem
                                    className="cursor-pointer py-4-pc pr-16-pc pl-48-pc outline-none text-body-small-pc relative data-[state=checked]:bg-background-surface-active hover:bg-background-surface-hover"
                                    key={item}
                                    checked={sortOrder === item}
                                    onCheckedChange={() => onChangeOrder(item)}
                                >
                                    <Menubar.ItemIndicator className="absolute left-16-pc top-1/2 -translate-y-1/2">
                                        <CheckIcon className="block w-pcvw-[16] h-auto" />
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
