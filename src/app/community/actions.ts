"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCategory } from "@/generated/prisma/enums";

const CATEGORY_VALUES = Object.values(PostCategory) as string[];

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const authorNameRaw = String(formData.get("authorName") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "");

  if (!title || !content) {
    throw new Error("제목과 내용을 입력해주세요.");
  }

  const category = CATEGORY_VALUES.includes(categoryRaw)
    ? (categoryRaw as PostCategory)
    : PostCategory.FREE;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      category,
      authorName: authorNameRaw || "익명",
    },
  });

  revalidatePath("/community");
  redirect(`/community/${post.id}`);
}

export async function createComment(postId: string, formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const authorNameRaw = String(formData.get("authorName") ?? "").trim();

  if (!content) return;

  await prisma.comment.create({
    data: {
      postId,
      content,
      authorName: authorNameRaw || "익명",
    },
  });

  revalidatePath(`/community/${postId}`);
}
