import "server-only";

import clsx from "clsx";
import { Suspense } from "react";

import { SearchBox } from "~/components/global/Navigation/SearchBox/SearchBox";
import { NicovideoRequestsList } from "~/components/pages/Top/NicovideoRequestsList.server";
import { RecentVideosList } from "~/components/pages/Top/RecentVIdeosList.server";

export default async function Page() {
  return (
    <main
      className={clsx(["container"], ["mx-auto"], ["flex", "gap-x-[12px]"])}
    >
      <div className={clsx(["flex-shrink-0"], ["flex-grow"])}>
        <section
          className={clsx(
            [["px-2"], ["py-2"]],
            ["rounded"],
            ["border", "border-slate-300"]
          )}
        >
          <h2 className={clsx(["text-sm"])}>検索</h2>
          <div className={clsx(["mt-2"])}>
            <SearchBox />
          </div>
        </section>
      </div>
      <div
        className={clsx(
          ["flex-grow"],
          ["max-w-[512px]"],
          ["flex", "flex-col", "gap-y-2"]
        )}
      >
        <section
          className={clsx(
            [["px-2"], ["py-2"]],
            ["rounded"],
            ["border", "border-slate-300"]
          )}
        >
          <h2 className={clsx(["text-sm"])}>最近登録された動画</h2>
          <div className={clsx(["mt-2"])}>
            <Suspense fallback={<span>LOADING</span>}>
              {/* @ts-expect-error for Server Component*/}
              <RecentVideosList />
            </Suspense>
          </div>
        </section>
        <section
          className={clsx(
            [["px-2"], ["py-2"]],
            ["rounded"],
            ["border", "border-slate-300"]
          )}
        >
          <h2 className={clsx(["text-sm"])}>
            最近リクエストされたニコニコ動画の動画
          </h2>
          <div className={clsx(["mt-2"])}>
            <Suspense fallback={<span>LOADING</span>}>
              {/* @ts-expect-error for Server Component*/}
              <NicovideoRequestsList />
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  );
}
