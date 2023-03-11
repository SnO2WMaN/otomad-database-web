import clsx from "clsx";

import { VideoThumbnail } from "~/components/common/VideoThumbnail";
import { FragmentType, getFragment as useFragment, graphql } from "~/gql";

import { LinkVideo } from "./Link";

const Fragment = graphql(`
  fragment VideoPage_SimilarVideos_Video on Video {
    ...Link_Video
    ...VideoThumbnail
    id
    title
  }
`);
export const SimilarVideo = ({
  ...props
}: {
  fragment: FragmentType<typeof Fragment>;
}) => {
  const to = useFragment(Fragment, props.fragment);
  return (
    <div>
      <LinkVideo fragment={to} className={clsx(["block"])}>
        <VideoThumbnail
          fragment={to}
          className={clsx(["w-full"], ["h-32"], ["border", "border-slate-400"])}
          width={256}
          height={192}
        />
      </LinkVideo>
      <LinkVideo
        fragment={to}
        className={clsx(
          ["block"],
          [["px-1"], ["py-1"]],
          ["text-sm", "@[768px]/videolist:text-xs"]
        )}
      >
        {to.title}
      </LinkVideo>
    </div>
  );
};
