import clsx from "clsx";
import Link from "next/link";
import React from "react";

import { getData } from "./getData";
import { VideoList } from "./tags/[id]/VideoList";

export default async function Page() {
  const { recentRegisteredVideos } = await getData();

  return (
    <>
      <section>
        <h2 className={clsx(["text-xl"])}>最近登録された動画</h2>
        <VideoList className={clsx(["mt-4"])} videos={recentRegisteredVideos} />
        <Link href={"/tags/t6yu8heb6m5x"}>ぼっち・ざ・ろっく！</Link>
      </section>
    </>
  );
}
