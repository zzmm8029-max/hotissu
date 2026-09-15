"use server";

import { prisma } from "@/lib/prisma";
import type { VerificationStatus } from "@/generated/prisma/enums";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB

export type MemberPublic = {
  id: string;
  nickname: string;
  dueDate: string | null;
  status: VerificationStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};

function toPublic(member: {
  id: string;
  nickname: string;
  dueDate: Date | null;
  status: VerificationStatus;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}): MemberPublic {
  return {
    id: member.id,
    nickname: member.nickname,
    dueDate: member.dueDate ? member.dueDate.toISOString() : null,
    status: member.status,
    rejectionReason: member.rejectionReason,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}

export type SubmitVerificationState = {
  error?: string;
  member?: MemberPublic;
};

export async function submitVerification(
  _prevState: SubmitVerificationState,
  formData: FormData,
): Promise<SubmitVerificationState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
  const file = formData.get("proofImage");

  if (!nickname) {
    return { error: "닉네임을 입력해주세요." };
  }
  if (nickname.length > 20) {
    return { error: "닉네임은 20자 이내로 입력해주세요." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "인증 서류(산모수첩, 임신확인서 등) 사진을 첨부해주세요." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "이미지 파일만 업로드할 수 있어요." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "이미지 용량이 너무 커요. 3MB 이하로 올려주세요." };
  }

  let dueDate: Date | undefined;
  if (dueDateRaw) {
    const parsed = new Date(dueDateRaw);
    if (!Number.isNaN(parsed.getTime())) dueDate = parsed;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const proofImage = `data:${file.type};base64,${buffer.toString("base64")}`;

  const member = await prisma.member.create({
    data: { nickname, dueDate, proofImage },
  });

  return { member: toPublic(member) };
}

export async function getMemberStatus(id: string): Promise<MemberPublic | null> {
  if (!id) return null;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return null;
  return toPublic(member);
}
