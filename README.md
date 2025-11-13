#### ディレクトリ構造

```
src/
  app/
    layout.tsx          ← 全ページ共通レイアウト
    page.tsx            ← トップページ（= 投稿一覧）ISR
    globals.css
    favicon.ico

    posts/
      actions.ts        ← 投稿の新規作成・更新・削除用
      new/
        page.tsx        ← 新規投稿フォーム　送信時のみserver action
      [id]/
        page.tsx        ← 詳細ページ　SSR
        edit/
          page.tsx      ← 編集ページ　SSR

  components/
    PostsClient.tsx     ← 一覧の絞り込み・並び替え用
    header.tsx          ← 一覧・詳細で使っているヘッダー

  lib/
    prisma.ts           ← Prisma Client の初期化
```
