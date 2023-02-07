import "server-only";

import clsx from "clsx";

import { VideoList } from "~/components/common/VideoList";
import { FragmentType, getFragment } from "~/gql";
import { VideoList_VideoFragmentDoc } from "~/gql/graphql";

export async function ServerSideVideosList({
  className,
  videosPromise,
}: {
  className?: string;
  videosPromise: Promise<FragmentType<typeof VideoList_VideoFragmentDoc>[]>;
}) {
  const nodes = await videosPromise;
  const videos = getFragment(VideoList_VideoFragmentDoc, nodes);
  return <VideoList className={clsx(className)} videos={videos} />;
}
