This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

##

```
app/
    ├─ layout.tsx // Server Component(再利用するだけで良いから)
    ├─ page.tsx # トップ // ISR(Incremental Static Regeneration) 定期的に更新して投稿内容を取得する必要があるため。
    └─ posts/
        ├─ page.tsx # 一覧　ISR + CSR(検索/並び替え) 併用
        ├─ [id]/page.tsx # 詳細 ISR
        ├─ [id]/edit/page.tsx # 編集 Server Component + Server Actions +（必要最小限の）Client
        └─ new/page.tsx # 新規作成
    components/
        ├─ PostCard.tsx # 一覧用コンポーネント
        ├─ PostForm.tsx # 新規/編集フォーム共通化
        └─ ImageUploader.tsx # 画像アップロードコンポーネント
    lib/
        .ts # Prisma初期化
```
