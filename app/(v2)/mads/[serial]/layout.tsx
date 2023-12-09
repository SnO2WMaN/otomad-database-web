import clsx from "clsx";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { graphql } from "~/gql";
import { makeGraphQLClient2 } from "~/gql/fetch";

import { LinkVideoEvents } from "./events/Link";
import LikeButton from "./LikeButton";
import { MadPageLink } from "./Link";
import Preview from "./Preview";
import Semitags from "./Semitags";
import Taggings from "./Taggings";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serial: string };
}) {
  const data = await (
    await makeGraphQLClient2({ auth: "optional" })
  ).request(
    graphql(`
      query MadPageLayout($serial: Int!) {
        findMadBySerial(serial: $serial) {
          id
          title
          ...Link_Video
          ...Link_VideoEvents
          ...MadPageLayout_LikeSwitch
          ...MadPageLayout_Taggings
          ...MadPageLayout_Semitags
          ...MadPageLayout_Preview
        }
      }
    `),
    { serial: parseInt(params.serial, 10) }
  );

  if (!data.findMadBySerial) notFound();
  const { findMadBySerial: video } = data;

  return (
    <main className={clsx("container mx-auto flex grow flex-col gap-y-4 p-8")}>
      <section className={clsx("@container/details")}>
        <div
          className={clsx(
            "flex flex-col gap-x-8 gap-y-4 @[1024px]/details:flex-row"
          )}
        >
          <Preview className={clsx("shrink-0")} fragment={video} />
          <div className={clsx("grow")}>
            <h1
              className={clsx("text-lg font-bold text-snow-primary lg:text-xl")}
            >
              <MadPageLink fragment={video}>{video.title}</MadPageLink>
            </h1>
            {/* <LikeButton className={clsx(["mt-2"])} fragment={getVideo} /> */}
            <LinkVideoEvents
              fragment={video}
              className={clsx("text-sm text-snow-darker")}
            >
              編集履歴を見る
            </LinkVideoEvents>
          </div>
        </div>
      </section>
      <div className={clsx("flex gap-x-4")}>
        <div className={clsx("flex w-[256px] shrink-0 flex-col gap-y-6")}>
          <LikeButton fragment={video} className={clsx("w-full")} />
          <section className={clsx("flex flex-col gap-y-1")}>
            <h2 className={clsx("text-base text-snow-darker")}>タグ</h2>
            <Suspense
              fallback={
                <p className={clsx("text-sm text-snow-darkest")}>Loading...</p>
              }
            >
              <Taggings fragment={video} />
            </Suspense>
          </section>
          <section className={clsx("flex flex-col gap-y-1")}>
            <h2 className={clsx("text-base text-snow-darker")}>仮タグ</h2>
            <Suspense
              fallback={
                <p className={clsx("text-sm text-snow-darkest")}>Loading...</p>
              }
            >
              <Semitags fragment={video} />
            </Suspense>
          </section>
        </div>
        <div className={clsx("grow")}>{children}</div>
      </div>
    </main>
  );
}
