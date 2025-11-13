import Link from "next/link";

type Props = {
  title: string;
  titleHref?: string;
  buttonText?: string;
  buttonHref?: string;
  editHref?: string;
  onDelete?: () => void; // 削除はクリックイベントを渡す形に
};

export default function PostsHeader({
  title,
  titleHref = "/",
  buttonText = "投稿",
  buttonHref = "/posts/new",
  editHref = "",
  onDelete,
}: Props) {
  return (
    <header className="flex items-center justify-between mb-6">
      {/* 左側タイトル */}
      <Link href={titleHref} className="hover:opacity-80 transition-opacity">
        <h1 className="text-2xl font-semibold cursor-pointer">{title}</h1>
      </Link>

      {/* 右側ボタン群 */}
      <div className="flex gap-3">
        <Link
          href={buttonHref}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {buttonText}
        </Link>

        {editHref && (
          <Link
            href={editHref}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            編集
          </Link>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            削除
          </button>
        )}
      </div>
    </header>
  );
}
