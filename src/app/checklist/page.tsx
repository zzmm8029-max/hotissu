import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ChecklistStage } from "@/generated/prisma/enums";
import { CHECKLIST_STAGE_LABEL } from "@/lib/labels";
import ChecklistClient from "./checklist-client";

export const metadata: Metadata = {
  title: "혜택 신청 체크리스트",
};

export default async function ChecklistPage() {
  const items = await prisma.checklistItem.findMany({
    include: { benefit: { select: { id: true, title: true } } },
    orderBy: [{ stage: "asc" }, { order: "asc" }],
  });

  const stages = Object.values(ChecklistStage).map((stage) => ({
    stage,
    label: CHECKLIST_STAGE_LABEL[stage],
    items: items.filter((item) => item.stage === stage),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">혜택 신청 체크리스트</h1>
      <p className="mt-2 text-sm text-neutral-600">
        임신 시기별로 챙겨야 할 혜택 신청 항목이에요. 완료한 항목을 체크해보세요. 체크
        상태는 이 브라우저에만 저장돼요.
      </p>

      <ChecklistClient stages={stages} />
    </div>
  );
}
