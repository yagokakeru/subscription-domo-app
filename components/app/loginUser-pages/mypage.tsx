'use client'

import type { Message } from '@/types/message'
import { MypageProfile } from '@/components/ui/mypage/profile'
import { MypagePlan } from '@/components/ui/mypage/plan'
import { MypageAccount } from '@/components/ui/mypage/account'
import ToastMessage from '@/components/ui/message/toast'
import type { userPlan } from '@/types/userPlan'
import { CircleUserRound, CreditCard, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export function MypageComponent({
    message,
    userPlan,
}: {
    message: Message
    userPlan: userPlan
}) {
    type Tab = 'profile' | 'plan' | 'account'
    const [activeTab, setActiveTab] = useState<Tab>('profile')
    const [toastMessage, setToastMessage] = useState<Message | null>(null)

    return (
        <>
            <section className="pt-pcvw-[150]">
                <div className="w-pcvw-[1280] mx-auto">
                    <h1 className="text-heading-h1-pc">マイページ</h1>
                    <div className="flex items-start gap-x-32-pc mt-64-pc">
                        <div className="bg-background-surface rounded-md-pc p-8-pc w-pcvw-[320] min-h-pcvw-[370]">
                            <div className="flex flex-col gap-y-8-pc">
                                <div
                                    className="cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active
                                    bg-background-surface-active border-l-pcvw-[4] border-l-border-strong border-solid"
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <CircleUserRound className="block w-pcvw-[20] h-auto" />
                                    <div className="text-body-default-pc">
                                        プロフィール
                                    </div>
                                </div>
                                <div
                                    className="cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active"
                                    onClick={() => setActiveTab('plan')}
                                >
                                    <CreditCard className="block w-pcvw-[20] h-auto" />
                                    <div className="text-body-default-pc">
                                        プラン
                                    </div>
                                </div>
                                <div
                                    className="cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active"
                                    onClick={() => setActiveTab('account')}
                                >
                                    <Settings className="block w-pcvw-[20] h-auto" />
                                    <div className="text-body-default-pc">
                                        アカウント操作
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-8-pc mt-128-pc">
                                <div className="cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active">
                                    <LogOut className="block w-pcvw-[20] h-auto" />
                                    <div className="text-body-default-pc">
                                        ログアウト
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-background-surface rounded-md-pc px-24-pc pt-24-pc pb-64-pc w-full">
                            {activeTab === 'profile' && (
                                <MypageProfile
                                    setToastMessage={setToastMessage}
                                />
                            )}
                            {activeTab === 'plan' && (
                                <MypagePlan userPlan={userPlan} />
                            )}
                            {activeTab === 'account' && <MypageAccount />}
                            {/* <div>
                                <h2 className='text-heading-h2-pc'>プロフィール</h2>
                                <form onSubmit={form.handleSubmit(onSubmit)} className='mt-48-pc'>
                                    <Label>            
                                        <ProfilePhoto>
                                            <Image
                                                src={avatarUrl || '/default-avatar.jpg'}
                                                alt="Avatar"
                                                width={100}
                                                height={100}
                                                className="rounded-full"
                                                unoptimized
                                            />
                                        </ProfilePhoto>
                                        <Input
                                            type="file"
                                            {...form.register('avatar')}
                                            accept="image/png, image/jpeg"
                                            className='hidden'
                                        />
                                    </Label>
                                    {form.formState.errors.avatar &&
                                        typeof form.formState.errors.avatar.message ===
                                            'string' && (
                                            <p className="text-red-500 text-sm">
                                                {form.formState.errors.avatar.message}
                                            </p>
                                        )
                                    }

                                    <div className='mt-32-pc max-w-pcvw-[452]'>
                                        <div>
                                            <Label htmlFor="name">名前</Label>
                                            <Input
                                                {...form.register('name')}
                                                placeholder="山田 太郎"
                                            />
                                        </div>
                                        {form.formState.errors.name && (
                                            <p className="text-status-error text-body-small-pc mt-4-pc">
                                                {form.formState.errors.name.message}
                                            </p>
                                        )}
                                        <div className="mt-24-pc">
                                            <Label>メールアドレス</Label>
                                            <div className='text-body-default-pc mt-8-pc'>{userProfile?.email}</div>
                                        </div>
                                    </div>

                                    <SubmitButton pendingText="保存中..." className='mt-40-pc'>保存</SubmitButton>
                                </form>
                            </div> */}
                            {/* <div>
                                <h2 className='text-heading-h2-pc'>プラン</h2>
                                <div className="flex items-center gap-4-pc text-body-default-pc mt-40-pc">
                                    <div>現在のプラン：</div>
                                    <PlanBadge>{userPlan?.name ?? 'フリー'}</PlanBadge>
                                </div>
                                {userPlan?.cancel_at_period_end ? (
                                    <>
                                        <div className="flex items-center gap-4-pc text-body-default-pc mt-16-pc">
                                            <div>解約予定日：</div>
                                            <div>{userPlan?.current_period_end}</div>
                                        </div>
                                        <div
                                            onClick={() =>
                                                ReactivateSubscription(userProfile!.user_id)
                                            }
                                        >
                                            解約を解除する
                                        </div>
                                        <Button asChild variant={'secondary'} className='mt-8-pc w-pcvw-[180]'
                                            onClick={() =>
                                                ReactivateSubscription(userProfile!.user_id)
                                            }
                                        >
                                            <div>解約を解除する</div>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4-pc text-body-default-pc mt-16-pc">
                                            <div>次回の支払い：</div>
                                            <div>{userPlan?.current_period_end}</div>
                                        </div>
                                    </>
                                )}
                                <div className="text-body-default-pc mt-16-pc">
                                    現在の台本数：
                                    <span className="text-heading-h3-pc">{userPlan?.script_count} / {userPlan?.max_scripts}</span>{' '}
                                    作成済み
                                </div>

                                <Button asChild className='mt-40-pc w-pcvw-[180]'>
                                    <Link href={'/plan?planname=' + userPlan?.name}>
                                    プランを変更する
                                    </Link>
                                </Button>
                                <Button asChild variant={'secondary'} className='mt-16-pc w-pcvw-[180]'
                                    onClick={() => Unsubscription(userProfile!.user_id)}
                                >
                                    <div>プランを解約する</div>
                                </Button>
                            </div> */}
                            {/* <div>
                                <h2 className='text-heading-h2-pc'>アカウント操作</h2>
                                
                                <form className="mt-40-pc">
                                    <SubmitButton
                                        pendingText="Signing out..."
                                        formAction={signOutAction}
                                    >
                                        ログアウト
                                    </SubmitButton>
                                </form>
                                <form className="mt-16-pc">
                                    <Input
                                        type="hidden"
                                        name="user_id"
                                        value={userProfile!.user_id}
                                    />
                                    <SubmitButton
                                        formAction={deleteAccountAction}
                                        pendingText="Deleting account..."
                                        variant={'secondary'}
                                    >
                                        アカウント削除
                                    </SubmitButton>
                                </form>
                            </div> */}
                        </div>
                    </div>

                    {/* <div>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <Image
                                src={avatarUrl || '/default-avatar.jpg'}
                                alt="Avatar"
                                width={100}
                                height={100}
                                className="rounded-full mb-4"
                                unoptimized
                            />
                            <Input
                                type="file"
                                {...form.register('avatar')}
                                accept="image/png, image/jpeg"
                            />
                            {form.formState.errors.avatar &&
                                typeof form.formState.errors.avatar.message ===
                                    'string' && (
                                    <p className="text-red-500 text-sm">
                                        {form.formState.errors.avatar.message}
                                    </p>
                                )
                            }
                            <div className="flex">
                                <div>メールアドレス</div>
                                <div>{userProfile?.email}</div>
                            </div>
                            <div className="flex">
                                <Label htmlFor="name">名前</Label>
                                <Input
                                    {...form.register('name')}
                                    placeholder="山田 太郎"
                                />
                            </div>
                            {form.formState.errors.name && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.name.message}
                                </p>
                            )}

                            <div className="flex">
                                <div>プラン</div>
                                <div>{userPlan?.name ?? 'Free'}</div>
                            </div>
                            {userPlan?.cancel_at_period_end ? (
                                <>
                                    <p>
                                        プランは{userPlan?.current_period_end}
                                        に解約予定です
                                    </p>
                                    <div
                                        onClick={() =>
                                            ReactivateSubscription(userProfile!.user_id)
                                        }
                                    >
                                        解約を解除する
                                    </div>
                                </>
                            ) : (
                                <>
                                    {userPlan?.current_period_end && (
                                        <p>
                                            次の支払いは{userPlan?.current_period_end}
                                            です
                                        </p>
                                    )}
                                    <Link href={'/plan?planname=' + userPlan?.name}>
                                        プランをアップグレード
                                    </Link>
                                </>
                            )}

                            <SubmitButton pendingText="editing">編集</SubmitButton>
                        </form>

                        <FormMessage message={message} />

                        <form className="flex items-center gap-4 mt-10">
                            <SubmitButton
                                pendingText="Signing out..."
                                variant={'outline'}
                                size={'sm'}
                                formAction={signOutAction}
                            >
                                Sign out
                            </SubmitButton>
                        </form>
                        <form>
                            <Input
                                type="hidden"
                                name="user_id"
                                value={userProfile!.user_id}
                            />
                            <SubmitButton
                                formAction={deleteAccountAction}
                                pendingText="Deleting account..."
                            >
                                Delete Account
                            </SubmitButton>
                        </form>
                        <Button
                            asChild
                            size="default"
                            variant={'destructive'}
                            onClick={() => Unsubscription(userProfile!.user_id)}
                        >
                            <div>Unsubscription</div>
                        </Button>
                    </div> */}
                </div>

                {toastMessage && (
                    <ToastMessage
                        message={toastMessage}
                        onClose={() => setToastMessage(null)}
                    />
                )}
            </section>
        </>
    )
}
