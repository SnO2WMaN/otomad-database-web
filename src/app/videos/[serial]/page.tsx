import clsx from "clsx";
import { notFound } from "next/navigation";

import { DetailsSection } from "~/components/Videos/DetailsSection";
import { EventsSection } from "~/components/Videos/EventsSection";
import { SemitagsSection } from "~/components/Videos/SemitagsSection";
import { SimilarVideosSection } from "~/components/Videos/SimilarVideosSection";
import { TagsSection } from "~/components/Videos/TagsSection";
import { getFragment, graphql } from "~/gql";
import {
  VideoPage_DetailsSectionFragmentDoc,
  VideoPage_SemitagsSectionFragmentDoc,
  VideoPage_SimilarVideosSectionFragmentDoc,
  VideoPage_TagsSectionFragmentDoc,
} from "~/gql/graphql";
import { gqlRequest } from "~/utils/gqlRequest";

export async function generateStaticParams() {
  const { findVideos } = await gqlRequest(
    graphql(`
      query VideoPagePaths {
        findVideos(input: { limit: 96, order: { updatedAt: DESC } }) {
          nodes {
            id
            serial
          }
        }
      }
    `)
  );
  return findVideos.nodes.map(({ serial }) => ({
    serial: serial.toString(),
  }));
}

export default async function Page({ params }: { params: { serial: string } }) {
  const { findVideo: video } = await gqlRequest(
    graphql(`
      query VideoPage($serial: Int!) {
        findVideo(input: { serial: $serial }) {
          id
          ...VideoPage_DetailsSection
          ...VideoPage_TagsSection
          ...VideoPage_SemitagsSection
          ...VideoPage_SimilarVideosSection
        }
      }
    `),
    { serial: parseInt(params.serial, 10) }
  );

  if (!video) return notFound();

  const details = getFragment(VideoPage_DetailsSectionFragmentDoc, video);
  const tags = getFragment(VideoPage_TagsSectionFragmentDoc, video);
  const semitags = getFragment(VideoPage_SemitagsSectionFragmentDoc, video);
  const similarVideos = getFragment(
    VideoPage_SimilarVideosSectionFragmentDoc,
    video
  );

  return (
    <div className={clsx(["flex"], ["gap-x-4"])}>
      <div
        className={clsx(
          ["flex-shrink-0"],
          ["hidden", "lg:block"],
          ["w-72"],
          ["space-y-4"]
        )}
      >
        <TagsSection className={clsx(["w-full"])} fallback={tags} />
        <SemitagsSection className={clsx(["w-full"])} fallback={semitags} />
      </div>
      <div className={clsx(["flex-grow"])}>
        <DetailsSection fallback={details} />
        <div className={clsx(["mt-4"], ["space-y-2"])}>
          <div className={clsx(["block", "lg:hidden"], ["space-y-2"])}>
            <TagsSection fallback={tags} />
            <SemitagsSection fallback={semitags} />
          </div>
          <SimilarVideosSection className={clsx()} fallback={similarVideos} />
          <EventsSection className={clsx()} videoId={video.id} />
        </div>
      </div>
    </div>
  );
}
