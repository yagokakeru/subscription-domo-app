<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
    - App Router
    - Pages Router
    - Middleware
    - Client
    - Server
    - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
    - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

    ```bash
    npx create-next-app --example with-supabase with-supabase-app
    ```

    ```bash
    yarn create next-app --example with-supabase with-supabase-app
    ```

    ```bash
    pnpm create next-app --example with-supabase with-supabase-app
    ```

3. Use `cd` to change into the app's directory

    ```bash
    cd with-supabase-app
    ```

4. Rename `.env.example` to `.env.local` and update the following:

    ```
    NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
    NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
    ```

    Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

    ```bash
    npm run dev
    ```

    The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

<a href="">
  <h1 align="center">Subscription Domo App</h1>
</a>

<p align="center">
サブスクリプション管理用の Web アプリケーションです。<br>
Next.js + Supabase を使った個人開発プロジェクト。
</p>

---

## 🔧 技術スタック

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Jotai
- **Backend / Auth**: Supabase
- **Payment**: Stripe
- **Lint**: ESLint
- **Formatter**: Prettier
- **Package Manager**: pnpm

---

## 🚀 セットアップ

#### 1. リポジトリをクローン

```bash
git clone https://github.com/yagokakeru/subscription-domo-app.git
```

#### 2. 依存関係をインストール

```bash
pnpm install
```

#### 3. 環境変数を設定

```bash
cp .env.example .env.local
```

.env.local に以下を設定してください：

```env
NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET=
```

## 🧑‍💻 開発

#### 開発サーバー起動

```bash
pnpm dev
```

http://localhost:3000 で確認できます。

## 🧹 Lint / Format

#### ESLint（コード品質チェック）

```bash
pnpm lint
```

#### Prettier（フォーマット）

```bash
pnpm prettier
```

#### フォーマットルール

・ESLint: ロジック・バグ検出  
・Prettier: コード整形  
・保存時: ESLint → Prettier の順で自動実行  
・commit 前: lint-staged により差分のみチェック

#### Git Hooks

・husky + lint-staged を使用  
・commit 時に以下が自動実行されます：

```bash
eslint --fix
prettier --write
```

## Stripe Webhookのテスト

#### 1. Stripe CLI をインストール

https://docs.stripe.com/stripe-cli/install

#### 2. ローカルの Webhook エンドポイントにイベントを転送する

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

発行されたシークレットキーを`.env.local`の`NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET`に設定する

## 📂 ディレクトリ構成（抜粋）

```
app/                # Next.js App Router
components/         # UI コンポーネント
lib/                # ロジック・ユーティリティ
types/              # 型定義
eslint.config.js    # ESLint 設定
prettier.config.cjs # Prettier 設定
```

## 開発中メモ

### CSS

- tailwindでコーディングするときリキッドコーディングするために[`vw.ts`](./lib/tailwind/vw.ts)でプラグインを作っているがそこまでする必要はあるか。tailwindの標準でコーディングするべきか。  
  指定は`rem`にしてhtmlタグに`vw`で可変になるようにする？そうすれば[`vw.ts`](./lib/tailwind/vw.ts)みたいなものを作らなくていい
