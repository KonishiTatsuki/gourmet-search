// app/posts/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 新規作成
export async function createPost(formData: FormData) {
  const title = (formData.get("title") || "").toString().trim();
  const content = (formData.get("content") || "").toString().trim();

  const placeName = (formData.get("placeName") || "").toString().trim();
  const station = (formData.get("station") || "").toString().trim() || null;
  const area = (formData.get("area") || "").toString().trim() || null;
  const address = (formData.get("address") || "").toString().trim() || null;

  if (!title) throw new Error("タイトルは必須です");
  if (!placeName) throw new Error("場所の店名（placeName）は必須です");

  // 画像ファイル（任意）
  const file = formData.get("heroImage") as File | null;
  let heroImageUrl: string | null = null;

  if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const objectPath = `posts/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(objectPath, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`画像アップロードに失敗しました: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(objectPath);

    heroImageUrl = data.publicUrl ?? null;
  }

  // ① Place を先に作成
  const place = await prisma.place.create({
    data: {
      name: placeName,
      station,
      area,
      address,
    },
  });

  // ② 作った place.id を使って Post を作成
  await prisma.post.create({
    data: {
      title,
      content,
      heroImageUrl,
      placeId: place.id,
    },
  });

  // 一覧を再生成＆リダイレクト
  revalidatePath("/");
  redirect("/");
}

/* ここから追記部分 */

// 編集（更新）
export async function updatePost(id: string, formData: FormData) {
  const title = (formData.get("title") || "").toString().trim();
  const content = (formData.get("content") || "").toString().trim();

  const placeName = (formData.get("placeName") || "").toString().trim();
  const station = (formData.get("station") || "").toString().trim() || null;
  const area = (formData.get("area") || "").toString().trim() || null;
  const address = (formData.get("address") || "").toString().trim() || null;

  if (!title) throw new Error("タイトルは必須です");
  if (!placeName) throw new Error("場所の店名（placeName）は必須です");

  // 既存の投稿を取得しておく（画像URL・placeId を使う）
  const existing = await prisma.post.findUnique({
    where: { id },
    include: { place: true },
  });

  if (!existing) {
    throw new Error("対象の投稿が見つかりませんでした");
  }

  // 画像ファイル（任意・新しい画像があれば差し替え）
  const file = formData.get("heroImage") as File | null;
  let heroImageUrl: string | null = existing.heroImageUrl;

  if (file && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const objectPath = `posts/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(objectPath, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`画像アップロードに失敗しました: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(objectPath);

    heroImageUrl = data.publicUrl ?? null;

    // 必要であれば、既存画像を削除する処理もここに追加可能です（任意）
  }

  // Place 情報を更新（post に紐づく place をそのまま書き換え）
  if (existing.placeId) {
    await prisma.place.update({
      where: { id: existing.placeId },
      data: {
        name: placeName,
        station,
        area,
        address,
      },
    });
  }

  // Post 本体を更新
  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      heroImageUrl,
    },
  });

  // 一覧と詳細を再生成
  revalidatePath("/");
  revalidatePath(`/posts/${id}`);

  // 更新後は詳細ページへ戻す
  redirect(`/posts/${id}`);
}

// 削除
export async function deletePost(id: string) {
  // 必要ならここで既存投稿を取得し、画像URL を見て Supabase 側の削除も可能
  // const existing = await prisma.post.findUnique({ where: { id } });

  await prisma.post.delete({
    where: { id },
  });

  // 一覧を再生成してトップへ
  revalidatePath("/");
  redirect("/");
}
