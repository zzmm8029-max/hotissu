import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { POST_CATEGORY_LABEL } from "@/lib/labels";
import { createComment } from "../actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  return { title: post?.title ?? "게시글" };
}

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  }).catch(() => null);

  if (!post) {
    notFound();
  }

  const createCommentForPost = createComment.bind(null, post.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/community" className="text-sm font-medium text-brand-500 hover:underline">
        ← 커뮤니티 목록으로
      </Link>

      <div className="mt-4">
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
          {POST_CATEGORY_LABEL[post.category]}
        </span>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">{post.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {post.authorName} · 조회 {post.viewCount}
        </p>
      </div>

      <p className="mt-6 whitespace-pre-line leading-relaxed text-neutral-800">
        {post.content}
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">
          댓글 {post.comments.length}
        </h2>

        <ul className="mt-3 space-y-3">
          {post.comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-700">{comment.authorName}</p>
              <p className="mt-1 text-sm text-neutral-800">{comment.content}</p>
            </li>
          ))}

          {post.comments.length === 0 && (
            <li className="rounded-xl border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500">
              첫 댓글을 남겨보세요.
            </li>
          )}
        </ul>

        <form action={createCommentForPost} className="mt-4 space-y-2">
          <input
            name="authorName"
            placeholder="닉네임 (선택)"
            maxLength={20}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <textarea
            name="content"
            required
            rows={3}
            placeholder="댓글을 남겨보세요"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            댓글 등록
          </button>
        </form>
      </section>
    </div>
  );
}
