// app/posts/[id]/page.tsx
import PostsHeader from "@/components/header";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { place: true },
  });

  if (!post) notFound();

  // 削除ハンドラー（サーバーアクションを利用）
  async function handleDelete() {
    "use server"; // ユーザー操作で実行される
    await prisma.post.delete({
      where: { id: params.id },
    });
    redirect("/"); // 削除後に一覧へ戻る
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      {/* ← 編集・削除ボタン付きヘッダー */}
      <PostsHeader
        title="グルメ詳細"
        titleHref="/"
        editHref={`/posts/${post.id}/edit`}
        onDelete={handleDelete}
      />

      <img
        src={post.heroImageUrl ?? "/placeholder.jpg"}
        alt={post.title}
        className="w-full h-64 object-cover rounded"
      />

      <h1 className="text-2xl font-semibold">{post.title}</h1>

      {post.content && (
        <div className="text-sm text-gray-600 whitespace-pre-line">
          {post.content}
        </div>
      )}

      <div className="text-sm text-gray-600">
        {post.place?.name}（{post.place?.station ?? post.place?.area ?? "—"}）
      </div>

      <div className="text-xs text-gray-500">
        作成日: {new Date(post.createdAt).toLocaleDateString()}
      </div>
    </main>
  );
}
