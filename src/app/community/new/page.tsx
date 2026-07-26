import type { Metadata } from "next";
import { PostCategory } from "@/generated/prisma/enums";
import { POST_CATEGORY_LABEL } from "@/lib/labels";
import { createPost } from "../actions";

export const metadata: Metadata = {
  title: "글쓰기",
};

export default function NewCommunityPostPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">글쓰기</h1>

      <form action={createPost} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">카테고리</label>
          <select
            name="category"
            defaultValue={PostCategory.FREE}
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

        <button
          type="submit"
          className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
