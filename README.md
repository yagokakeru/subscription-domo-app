<a href="#">
  <h1 style="text-align: center;">しゃべる台本</h1>
</a>

<p style="text-align: center;">NextJS/Supabase/Stripe学習用のWebアプリ</p>

<ul>
  <a href="#技術スタック"><strong>技術スタック</strong></a> /
  <a href="#demo"><strong>Demo</strong></a> /
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> /
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> /
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</ul>
<br/>

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
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 🧑‍💻 開発

#### 開発サーバー起動

```bash
pnpm dev
```

http://localhost:3000 で確認できます。

### supabase migration

DB の構成（テーブル・RLS ポリシー・関数など）は `supabase/migrations/` の SQL ファイルで管理します。
**ダッシュボードで直接変更せず、必ず migration ファイル経由で変更してください。** 開発用と本番の DB の構成がずれるのを防ぐためです。

#### ローカル DB の起動

Docker を起動した状態で実行します。

```bash
supabase start       # ローカル DB を起動（migrations と seed.sql が適用される）
supabase stop        # 停止
```

#### DB の構成を変更するとき

```bash
# 1. migration ファイルを作成
supabase migration new <変更内容がわかる名前>   # 例: add_plan_sort_order

# 2. 作成された supabase/migrations/<日時>_<名前>.sql に SQL を書く

# 3. ローカル DB を作り直して確認（全 migration と seed.sql を最初から適用）
supabase db reset

# 4. 問題なければ開発用 DB に反映
supabase link --project-ref <開発用のproject-ref>
supabase db push
```

migration ファイルは一度 push したら編集せず、修正が必要なときは新しい migration ファイルを追加してください。

#### 本番環境へのセットアップ・反映

```bash
supabase link --project-ref <本番のproject-ref>
supabase db push      # migrations を本番DBに適用
```

- `supabase/seed.sql` はローカル DB 専用です（`db push` では適用されません）。
- 本番用の plan データは、**本番の Stripe 価格 ID** で別に登録してください。
- `db push` の前に `supabase link` の接続先が正しいかを必ず確認してください。

#### 注意点

- `supabase/config.toml` の `[db] major_version` は、リモート DB の Postgres のバージョンに合わせてください（現在は `15`）。違うと `supabase db pull` などが `error running container: exit 1` で失敗します。
- `supabase db pull` でリモートから差分を取り込んだときは、生成された SQL を必ず確認してください。`storage` スキーマのトリガー（`drop trigger ... on "storage"."prefixes"` など）が含まれていると、`must be owner of relation ...` エラーで適用できません。これらは Supabase 側が管理しているものなので削除してください。`storage.objects` の RLS ポリシー（`create policy`）は残します。

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

## 👛 Stripe Webhookのテスト

#### 1. Stripe CLI をインストール

https://docs.stripe.com/stripe-cli/install

#### 2. Stripeにログインする

```bash
stripe login
```

#### 3. ローカルの Webhook エンドポイントにイベントを転送する

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

発行されたシークレットキーを`.env.local`の`STRIPE_WEBHOOK_SECRET`に設定する

#### 4. CLIでテストイベントを発火させる

stripe trigger customer.subscription.created

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
- エラー表示の方法（関数やactionがどんな値を返すのか、該当なしの場合はnullを返すのか）、エラーメッセージの統一など最初にやるべき設計のやり方が知りたい
- 処理の流れがよく分からなくなるので要件定義書や設計書を作った方がいいのか？（DBから値を持ってくるファイルがあるところやそのファイルがどんな値を返すのかなどいちいちコードを追わないと分からなくなる。）
- 日本でサブスクを提供するには
  特定商取引法に基づく表記・利用規約・プライバシーポリシー・最終確認画面での表示：2022年の特定商取引法の改正で、申し込みの最終確認画面には、料金・契約期間・自動更新であること・解約方法を表示する義務ができました。プランページの直前に表示が必要。
