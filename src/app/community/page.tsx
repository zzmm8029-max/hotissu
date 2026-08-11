import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PostCategory } from "@/generated/prisma/enums";
import { POST_CATEGORY_LABEL } from "@/lib/labels";

export const metadata: Metadata = {
  title: "커뮤니티",
};

const CATEGORY_OPTIONS = [
  { value: "ALL", label: "전체" },
  ...Object.values(PostCategory).map((value) => ({
    value,
    label: POST_CATEGORY_LABEL[value],
  })),
];

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const selected =
    category && (Object.values(PostCategory) as string[]).includes(category)
      ? (category as PostCategory)
      : "ALL";

  const posts = await prisma.post.findMany({
    where: selected === "ALL" ? {} : { category: selected },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: true } } },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">커뮤니티</h1>
        <Link
          href="/community/new"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          글쓰기
        </Link>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        혜택 신청 후기와 정보를 나눠보세요.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((option) => (
          <Link
            key={option.value}
            href={option.value === "ALL" ? "/community" : `/community?category=${option.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selected === option.value
                ? "bg-brand-500 text-white"
                : "border border-neutral-200 text-neutral-600 hover:bg-brand-50 hover:text-brand-600"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/community/${post.id}`}
              className="flex items-start justify-between gap-3 px-5 py-4 hover:bg-brand-50/50"
            >
              <div>
                <span className="mr-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                  {POST_CATEGORY_LABEL[post.category]}
                </span>
                <span className="font-medium text-neutral-900">{post.title}</span>
                <p className="mt-1 text-sm text-neutral-500">
                  {post.authorName} · 댓글 {post._count.comments} · 조회 {post.viewCount}
                </p>
              </div>
            </Link>
          </li>
        ))}

        {posts.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-neutral-500">
            아직 게시글이 없어요. 첫 글을 남겨보세요!
          </li>
        )}
      </ul>
    </div>
  );
}
