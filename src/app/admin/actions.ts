"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createAdminSession,
  clearAdminSession,
  verifyAdminPassword,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export type AdminLoginState = { error?: string };

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const ok = await verifyAdminPassword(password);
  if (!ok) return { error: "비밀번호가 올바르지 않아요." };
  await createAdminSession();
  redirect("/admin/verify");
}

export async function adminLogout(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}

async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("관리자 인증이 필요합니다.");
  }
}

export async function approveMember(memberId: string): Promise<void> {
  await assertAdmin();
  await prisma.member.update({
    where: { id: memberId },
    data: { status: "APPROVED", rejectionReason: null },
  });
  revalidatePath("/admin/verify");
}

export async function rejectMember(memberId: string, formData: FormData): Promise<void> {
  await assertAdmin();
  const reason = String(formData.get("reason") ?? "").trim();
  await prisma.member.update({
    where: { id: memberId },
    data: { status: "REJECTED", rejectionReason: reason || "확인이 어려운 서류예요." },
  });
  revalidatePath("/admin/verify");
}
