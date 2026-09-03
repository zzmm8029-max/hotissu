"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PostCategory } from "@/generated/prisma/enums";

const CATEGORY_VALUES = Object.values(PostCategory) as string[];
const MAX_RECEIPT_BYTES = 3 * 1024 * 1024; // 3MB

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const authorNameRaw = String(formData.get("authorName") ?? "").trim();
  const categoryRaw = String(formData.get("category") ?? "");
  const merchantId = String(formData.get("merchantId") ?? "").trim();
  const amountRaw = String(formData.get("amount") ?? "").trim();
  const receiptFile = formData.get("receiptImage");

  if (!title || !content) {
    throw new Error("제목과 내용을 입력해주세요.");
  }

  const category = CATEGORY_VALUES.includes(categoryRaw)
    ? (categoryRaw as PostCategory)
    : PostCategory.FREE;
  const isReview = category === PostCategory.REVIEW;
  const hasMerchant = isReview && Boolean(merchantId);

  let amount: number | undefined;
  if (hasMerchant) {
    const parsed = Number(amountRaw);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error("결제 금액을 정확히 입력해주세요.");
    }
    amount = Math.round(parsed);
  }

  let receiptImage: string | undefined;
  if (receiptFile instanceof File && receiptFile.size > 0) {
    if (!receiptFile.type.startsWith("image/")) {
      throw new Error("영수증은 이미지 파일만 첨부할 수 있어요.");
    }
    if (receiptFile.size > MAX_RECEIPT_BYTES) {
      throw new Error("영수증 이미지 용량이 너무 커요. 3MB 이하로 올려주세요.");
    }
    const buffer = Buffer.from(await receiptFile.arrayBuffer());
    receiptImage = `data:${receiptFile.type};base64,${buffer.toString("base64")}`;
  } else if (hasMerchant) {
    throw new Error("영수증 사진을 첨부해주세요.");
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      category,
      authorName: authorNameRaw || "익명",
      merchantId: hasMerchant ? merchantId : undefined,
      receiptImage: isReview ? receiptImage : undefined,
      amount,
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
