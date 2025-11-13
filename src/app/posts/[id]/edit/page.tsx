// app/posts/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updatePost } from "../../actions";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { place: true },
  });

  if (!post) notFound();

  const place = post.place;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">投稿を編集</h1>
        <div className="flex gap-2">
          <Link
            href={`/posts/${post.id}`}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            詳細へ戻る
          </Link>
          <Link
            href="/"
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            一覧へ戻る
          </Link>
        </div>
      </header>

      {/* ファイルを扱うので encType を指定 */}
      <form
        action={updatePost.bind(null, post.id)}
        encType="multipart/form-data"
      >
        {/* 投稿タイトル */}
        <div>
          <label className="block text-sm font-medium mb-1">タイトル</label>
          <input
            name="title"
            required
            defaultValue={post.title}
            className="w-full border rounded-md px-3 py-2"
            placeholder="例）大宮の絶品ランチ！"
          />
        </div>

        {/* 内容 */}
        <div>
          <label className="block text-sm font-medium mb-1">内容</label>
          <input
            name="content"
            required
            defaultValue={post.content ?? ""}
            className="w-full border rounded-md px-3 py-2"
            placeholder="例）おしゃれな店内でオムライスが絶品"
          />
        </div>

        {/* 場所情報（Place用） */}
        <div className="space-y-3">
          <p className="text-sm font-medium">場所情報（Place）</p>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              店名（必須）
            </label>
            <input
              name="placeName"
              required
              defaultValue={place?.name ?? ""}
              className="w-full border rounded-md px-3 py-2"
              placeholder="例）牛タン ひら井 大宮店"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              最寄り駅（必須）
            </label>
            <input
              name="station"
              defaultValue={place?.station ?? ""}
              className="w-full border rounded-md px-3 py-2"
              placeholder="例）大宮"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              エリア（任意）
            </label>
            <input
              name="area"
              defaultValue={place?.area ?? ""}
              className="w-full border rounded-md px-3 py-2"
              placeholder="例）さいたま"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-700 mb-1">
              住所（任意）
            </label>
            <input
              name="address"
              defaultValue={place?.address ?? ""}
              className="w-full border rounded-md px-3 py-2"
              placeholder="例）埼玉県さいたま市大宮区…"
            />
          </div>
        </div>

        {/* 画像 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Hero 画像ファイル（任意）
          </label>

          {/* 現在の画像プレビュー（あれば） */}
          {post.heroImageUrl && (
            <div className="mb-2">
              <p className="text-xs text-gray-700 mb-1">現在の画像</p>
              <img
                src={post.heroImageUrl}
                alt={post.title}
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}

          <input
            name="heroImage"
            type="file"
            accept="image/*"
            className="w-full border rounded-md px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            ※新しく選択した場合は画像が差し替えられます。
            未選択の場合は現在の画像がそのまま残ります。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            更新する
          </button>
          <Link
            href={`/posts/${post.id}`}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </main>
  );
}
