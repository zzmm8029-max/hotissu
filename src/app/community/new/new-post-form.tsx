"use client";

import { useState } from "react";
import { PostCategory } from "@/generated/prisma/enums";
import { POST_CATEGORY_LABEL } from "@/lib/labels";
import { createPost } from "../actions";

type MerchantOption = { id: string; name: string };

export default function NewPostForm({ merchants }: { merchants: MerchantOption[] }) {
  const [category, setCategory] = useState<string>(PostCategory.FREE);
  const [merchantId, setMerchantId] = useState("");
  const isReview = category === PostCategory.REVIEW;
  const hasMerchant = isReview && merchantId !== "";

  return (
    <form action={createPost} className="mt-6 space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">카테고리</label>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        >
          {Object.values(PostCategory).map((value) => (
            <option key={value} value={value}>
              {POST_CATEGORY_LABEL[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">닉네임</label>
        <input
          name="authorName"
          placeholder="익명"
          maxLength={20}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">제목</label>
        <input
          name="title"
          required
          maxLength={100}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">내용</label>
        <textarea
          name="content"
          required
          rows={8}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {isReview && (
        <div className="space-y-4 rounded-xl border border-brand-100 bg-brand-50/40 p-4">
          <p className="text-xs font-semibold text-brand-600">영수증 인증 후기</p>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              이용한 매장 <span className="text-neutral-400">(선택)</span>
            </label>
            <select
              name="merchantId"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">매장을 선택해주세요</option>
              {merchants.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {hasMerchant && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  결제 금액
                </label>
                <div className="flex items-center gap-2">
                  <input
                    name="amount"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={100}
                    required
                    placeholder="15000"
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                  />
                  <span className="text-sm text-neutral-500">원</span>
                </div>
                <p className="mt-1.5 text-xs text-neutral-500">
                  영수증에 찍힌 결제 금액을 입력해주세요. 매장 정산(수수료·기부금 계산)의 기준이
                  돼요.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  영수증 사진
                </label>
                <input
                  name="receiptImage"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  required
                  className="w-full text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-600"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                  결제 금액이 보이도록 영수증을 찍어 올려주세요. (최대 3MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="submit"
        className="rounded-full bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
      >
        등록하기
      </button>
    </form>
  );
}
