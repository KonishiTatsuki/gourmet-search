// components/PostsClient.tsx
"use client"; //ページ全体をクライアント化せずに、必要な部分だけ動的化できる。

import Link from "next/link";
import { useMemo, useState } from "react";

type PlaceLite = { id: string; name: string | null; station: string | null };
type PostWithPlace = {
  id: string;
  title: string;
  content?: string | null;
  heroImageUrl: string | null;
  createdAt: string | Date;
  place: PlaceLite | null;
};

type Props = {
  initialPosts: PostWithPlace[];
  places: PlaceLite[];
};

export default function PostsClient({ initialPosts, places }: Props) {
  const [keyword, setKeyword] = useState("");
  const [station, setStation] = useState<string>("");
  const [sortKey, setSortKey] = useState<"new" | "old" | "title">("new");

  const filtered = useMemo(() => {
    // 検索処理
    const kw = keyword.trim().toLowerCase();
    const selectedStation = station.trim().toLowerCase(); // ← state から

    let list = initialPosts.filter((post) => {
      const title = post.title.toLowerCase();
      const placeName = post.place?.name ? post.place.name.toLowerCase() : "";
      const postStation = post.place?.station
        ? post.place.station.toLowerCase()
        : "";

      const matchesKeywordItem = [title, placeName, postStation].some((field) =>
        field.includes(kw)
      );

      const matchesPlace = !selectedStation || postStation === selectedStation;

      return matchesKeywordItem && matchesPlace;
    });
    // ソート処理
    list = [...list].sort((a, b) => {
      if (sortKey === "title") {
        return a.title.localeCompare(b.title);
      }
      const ad = new Date(a.createdAt).getTime();
      const bd = new Date(b.createdAt).getTime();
      return sortKey === "new" ? bd - ad : ad - bd;
    });

    return list;
  }, [keyword, station, sortKey, initialPosts]);

  return (
    <>
      <section className="mb-4 grid gap-3 sm:grid-cols-3">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="店名・駅名・タイトルで検索"
          className="border rounded w-full px-3 py-2"
          aria-label="キーワード検索"
        />
        <select
          value={station}
          onChange={(e) => setStation(e.target.value)}
          className="border rounded w-full px-3 py-2"
          aria-label="駅で絞り込み"
        >
          <option value="">駅で絞り込み（任意）</option>
          {[
            ...new Set(
              places
                .map((pl) => pl.station) // 各placeのstationだけ抽出
                .filter((s): s is string => !!s) // nullや空文字を除外（型ガード）
            ),
          ].map((uniqueStation) => (
            <option key={uniqueStation} value={uniqueStation}>
              {uniqueStation}
            </option>
          ))}
        </select>

        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as any)}
          className="border rounded w-full px-3 py-2"
          aria-label="並び替え"
        >
          <option value="new">新着順</option>
          <option value="old">古い順</option>
          <option value="title">タイトル順</option>
        </select>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/posts/${p.id}`}
            className="border rounded-lg overflow-hidden hover:shadow"
          >
            {/* 画像は必要に応じて next/image に置き換え */}
            {p.heroImageUrl && (
              <img
                src={p.heroImageUrl}
                alt={p.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-3">
              <div className="text-sm text-gray-500">{p.place?.station}</div>
              <div className="text-sm text-gray-500">{p.place?.name}</div>
              <div className="font-medium line-clamp-2">{p.title}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
