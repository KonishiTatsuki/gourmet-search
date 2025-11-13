// app/posts/page.tsx
export const revalidate = 60; // ISR

import PostsHeader from "@/components/header";
import PostsClient from "@/components/PostsClient";
import { prisma } from "@/lib/prisma";

type PostWithPlace = {
  id: string;
  title: string;
  content?: string | null;
  heroImageUrl: string | null;
  createdAt: Date;
  place: {
    id: string;
    name: string | null;
    station: string | null;
    area: string | null;
    address: string | null;
    createdAt: Date | null;
  } | null;
};

export default async function PostsPage() {
  // 場所情報を取得
  const places = await prisma.place.findMany({
    orderBy: { createdAt: "desc" }, // 作成日時（createdAt）」の降順(descending)（新しい順）
    // select: { id: true, name: true, station: true }, // 「id」「name」「station」のカラムだけ取得する
    take: 200, // セレクトボックス用に少し多め
  });
  // 投稿一覧を取得
  const posts: PostWithPlace[] = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { place: true }, // 別テーブル=place（リレーション）のデータを一緒に取得する。
    take: 24, // 24件取得
  });

  // SSR部分（初期描画）
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <PostsHeader title="グルメ" buttonText="投稿" buttonHref="/posts/new" />

      {/* 初期はISRで描画し、以降はCSRで絞り込み・並び替え */}
      {/* prisma は サーバーサイド専用のため、ClientComponentのPostsClientでは取得できない。そのためpage.tsから渡す */}
      <PostsClient initialPosts={posts} places={places} />
    </main>
  );
}
