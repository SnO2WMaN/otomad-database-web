import "server-only";

import clsx from "clsx";
import React from "react";

import { getFragment, graphql } from "~/gql";
import { VideoPage_SemitagFragmentDoc } from "~/gql/graphql";
import { gqlRequest } from "~/utils/gqlRequest";

import { Semitag } from "./Semitag";

export async function SemitagsSection({
  className,
  videoId,
}: {
  className?: string;
  videoId: string;
}) {
  const { video } = await gqlRequest(
    graphql(`
      query VideoPage_SemitagsSection($id: ID!) {
        video(id: $id) {
          semitags {
            id
            ...VideoPage_Semitag
          }
        }
      }
    `),
    { id: videoId }
  );

  return (
    <section className={clsx(className)}>
      <div className={clsx(["flex"], ["items-center"])}>
        <h2 className={clsx(["flex-grow"], ["text-xl"], ["text-slate-900"])}>
          仮タグ
        </h2>
      </div>
      <div className={clsx(["mt-2"], ["flex", "flex-col", "items-start"])}>
        {video.semitags.map((semitag) => (
          <Semitag
            key={semitag.id}
            fragment={getFragment(VideoPage_SemitagFragmentDoc, semitag)}
          />
        ))}
      </div>
    </section>
  );
}
