'use client'

import type { Message } from '@/types/message'
import { MypageProfile } from '@/components/ui/mypage/profile'
import { MypagePlan } from '@/components/ui/mypage/plan'
import { MypageAccount } from '@/components/ui/mypage/account'
import ToastMessage from '@/components/ui/message/toast'
import type { userPlan } from '@/types/userPlan'
import { CircleUserRound, CreditCard, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export function MypageComponent({ userPlan }: { userPlan: userPlan }) {
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
                                    className={`cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active
                                    ${activeTab === 'profile' ? 'bg-background-surface-active border-l-pcvw-[4] border-l-border-strong border-solid' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                >
                                    <CircleUserRound className="block w-pcvw-[20] h-auto" />
                                    <div className="text-body-default-pc">
                                        プロフィール
                                    </div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active
                                    ${activeTab === 'plan' ? 'bg-background-surface-active border-l-pcvw-[4] border-l-border-strong border-solid' : ''}`}
                                    onClick={() => setActiveTab('plan')}
                                >
                                    <CreditCard className="block w-pcvw-[20] h-auto" />
                                    <div className="text-body-default-pc">
                                        プラン
                                    </div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-sm-pc py-16-pc px-24-pc flex items-center gap-8-pc hover:bg-background-surface-hover active:bg-background-surface-active
                                    ${activeTab === 'account' ? 'bg-background-surface-active border-l-pcvw-[4] border-l-border-strong border-solid' : ''}`}
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
                        </div>
                    </div>
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
