import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import NewPostForm from "./new-post-form";

export const metadata: Metadata = {
  title: "글쓰기",
};

export const revalidate = 60;

export default async function NewCommunityPostPage() {
  const merchants = await prisma.merchant.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">글쓰기</h1>
      <NewPostForm merchants={merchants} />
    </div>
  );
}
