'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

import FeatureCard from './ui/card/feature'
import { Result } from '@/types/result'
import { planInfo } from '@/types/planInfo'
import PlanCard from '@/components/ui/card/plan'

export default function Home({ planInfo }: { planInfo: Result<planInfo[]> }) {
    return (
        <>
            <section className="pt-pcvw-[216]">
                <p className="text-heading-h1-pc text-center">
                    カメラ目線のまま話せる
                    <br />
                    最もシンプルなプロンプター
                </p>
                <Button asChild className="mt-32-pc mx-auto w-fit">
                    <Link href="/sign-up">無料で始める</Link>
                </Button>
                <Image
                    className="block rounded-xl-pc mx-auto mt-32-pc w-pcvw-[1000]"
                    src="/home/main_img.jpg"
                    alt="メイン画像"
                    width={1000}
                    height={563}
                />
            </section>

            <section className="pt-128-pc">
                <div className="w-pcvw-[1280] mx-auto">
                    <h2 className="text-heading-h2-pc mb-48-pc">機能</h2>
                    <div className="flex flex-wrap justify-space-between gap-x-24-pc gap-y-32-pc">
                        <FeatureCard
                            title="📹 カメラ目線をキープ"
                            description="視線を外さず自然に話せる"
                            image="/home/feature_img01.jpg"
                            className="w-pcvw-[618]"
                        />
                        <FeatureCard
                            title="⚡ 自動スクロール"
                            description="話すスピードに合わせて自然にスクロール"
                            image="/home/feature_img02.jpg"
                            className="w-pcvw-[618]"
                        />
                        <FeatureCard
                            title="🪞 鏡文字対応"
                            description="そのまま読める鏡文字表示"
                            image="/home/feature_img03.jpg"
                            className="w-pcvw-[618]"
                        />
                        <FeatureCard
                            title="📜 台本を簡単作成"
                            description="思いついたらすぐ作れるシンプルな台本エディタ"
                            image="/home/feature_img04.jpg"
                            className="w-pcvw-[618]"
                        />
                    </div>
                </div>
            </section>

            <section className="pt-128-pc pb-128-pc">
                <div className="w-pcvw-[1280] mx-auto">
                    <h2 className="text-heading-h2-pc mb-48-pc">プラン比較</h2>
                    <div className="flex items-end justify-center gap-x-48-pc">
                        {planInfo.ok ? (
                            planInfo.data.map(
                                (item: planInfo, index: number) => {
                                    return (
                                        <PlanCard
                                            key={index}
                                            planInfo={item}
                                            className="w-pcvw-[300]"
                                        />
                                    )
                                }
                            )
                        ) : (
                            <div className="text-body-default-pc">
                                プラン情報が取得できませんでした
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <ul>
                <li>マイページ作成</li>
            </ul>
        </>
    )
}
