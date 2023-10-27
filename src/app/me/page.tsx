import clsx from "clsx";

import RecentLikes from "./RecentLikes";
import Timeline from "./Timeline";

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main
      className={clsx(
        ["w-full", "max-w-screen-2xl"],
        ["mx-auto"],
        ["px-8"],
        ["py-4"],
        ["@container/main"]
      )}
    >
      <div
        className={clsx([
          "flex",
          ["flex-col", "@w320/main:flex-row"],
          "gap-x-4",
          "gap-y-4",
        ])}
      >
        <Timeline
          className={clsx(
            ["flex-grow"],
            ["order-1", "@w320/main:order-0"],
            ["w-full", "@w320/main:w-[1024px]"]
          )}
        />
        <div
          className={clsx(
            ["flex-shrink-0"],
            ["order-0", "@w320/main:order-1"],
            ["flex", "flex-col"],
            ["@w320/main:w-128"]
          )}
        >
          <RecentLikes />
        </div>
      </div>
    </main>
  );
}
