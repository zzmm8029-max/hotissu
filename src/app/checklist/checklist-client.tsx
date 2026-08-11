"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChecklistStage } from "@/generated/prisma/enums";

type ChecklistItemView = {
  id: string;
  title: string;
  description: string | null;
  benefit: { id: string; title: string } | null;
};

type StageGroup = {
  stage: ChecklistStage;
  label: string;
  items: ChecklistItemView[];
};

const STORAGE_KEY = "baeryeomom:checklist:checked";

export default function ChecklistClient({ stages }: { stages: StageGroup[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // localStorage는 서버에 없는 외부 저장소라 마운트 이후 한 번만 동기화한다.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // localStorage 접근 불가 시 무시
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, loaded]);

  const totalItems = stages.reduce((acc, s) => acc + s.items.length, 0);
  const doneItems = stages.reduce(
    (acc, s) => acc + s.items.filter((item) => checked[item.id]).length,
    0
  );

  return (
    <div className="mt-6 space-y-8">
      <div className="rounded-2xl bg-brand-50 px-5 py-4">
        <div className="flex items-center justify-between text-sm font-medium text-brand-700">
          <span>진행 상황</span>
          <span>
            {doneItems} / {totalItems}
          </span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-brand-100">
          <div
            className="h-2 rounded-full bg-brand-500 transition-all"
            style={{ width: totalItems ? `${(doneItems / totalItems) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {stages.map((group) => (
        <section key={group.stage}>
          <h2 className="text-lg font-semibold text-neutral-900">{group.label}</h2>
          <ul className="mt-3 space-y-2">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-brand-500"
                  checked={Boolean(checked[item.id])}
                  onChange={(e) =>
                    setChecked((prev) => ({ ...prev, [item.id]: e.target.checked }))
                  }
                />
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      checked[item.id] ? "text-neutral-400 line-through" : "text-neutral-900"
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-neutral-500">{item.description}</p>
                  )}
                  {item.benefit && (
                    <Link
                      href={`/benefits/${item.benefit.id}`}
                      className="mt-1 inline-block text-sm font-medium text-brand-500 hover:underline"
                    >
                      관련 혜택 보기: {item.benefit.title} →
                    </Link>
                  )}
                </div>
              </li>
            ))}

            {group.items.length === 0 && (
              <li className="rounded-xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-500">
                이 시기에 등록된 체크리스트 항목이 없어요.
              </li>
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
