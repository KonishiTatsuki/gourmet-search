// app/posts/new/page.tsx
import { createPost } from "../actions";
import Link from "next/link";

export default async function NewPostPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">新規投稿</h1>
        <Link href="/" className="px-3 py-2 border rounded-lg hover:bg-gray-50">
          一覧へ戻る
        </Link>
      </header>

      {/* ★ encType 追加（ファイル送信に必須） */}
      <form action={createPost} className="space-y-6">
        {/* 投稿タイトル */}
        <div>
          <label className="block text-sm font-medium mb-1">タイトル</label>
          <input
            name="title"
            required
            className="w-full border rounded-md px-3 py-2"
            placeholder="例）大宮の絶品ランチ！"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">内容</label>
          <input
            name="content"
            required
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
          <input
            name="heroImage"
            type="file"
            accept="image/*"
            className="w-full border rounded-md px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            ※未選択の場合は画像なしで登録されます。
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            登録
          </button>
          <Link
            href="/"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            キャンセル
          </Link>
        </div>
      </form>
    </main>
  );
}
