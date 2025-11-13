// seed.tsは、開発用データ（初期データ）をデータベースに入れるスクリプト作成できる(npx prisma db seed コマンドで実行)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  await prisma.place.deleteMany();

  const place = await prisma.place.create({
    data: {
      name: "牛タン ひら井 大宮店",
      station: "大宮",
      area: "さいたま",
      address: "埼玉県さいたま市大宮区…",
      posts: {
        create: [
          { title: "厚切り牛タン定食が優勝", heroImageUrl: null },
          { title: "昼の限定ランチも旨い", heroImageUrl: null },
        ],
      },
    },
  });

  console.log("Seeded place:", place.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
