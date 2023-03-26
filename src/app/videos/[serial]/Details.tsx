"use client";

import "client-only";

import clsx from "clsx";
import React, { useState } from "react";

import { LinkVideoEvents } from "~/app/videos/[serial]/events/Link";
import { VideoThumbnail } from "~/components/common/VideoThumbnail";
import { FragmentType, graphql, useFragment } from "~/gql";

import { LikeButton } from "./LikeButton";

export const Fragment = graphql(`
  fragment VideoPage_DetailsSection on Video {
    ...VideoThumbnail
    ...Link_VideoEvents
    id
    title
    nicovideoSources {
      id
      sourceId
      url
      embedUrl
    }
    youtubeSources {
      id
      sourceId
      url
      embedUrl
    }
  }
`);
export const Details: React.FC<{
  className?: string;
  fragment: FragmentType<typeof Fragment>;
}> = ({ className, ...props }) => {
  const fragment = useFragment(Fragment, props.fragment);
  const [thumbnail, setThumbnail] = useState<
    "ORIGINAL" | ["NICOVIDEO", string] | ["YOUTUBE", string]
  >("ORIGINAL");

  return (
    <div className={clsx(className, ["@container/details"])}>
      <div
        className={clsx(
          ["flex", ["flex-col", "@[1024px]/details:flex-row"]],
          ["gap-x-8"],
          ["gap-y-4"]
        )}
      >
        <div className={clsx(["flex-shrink-0"], ["flex"])}>
          <div className={clsx(["w-32"], ["flex", "flex-col"])}>
            <button
              type="button"
              onClick={() => setThumbnail("ORIGINAL")}
              className={clsx(
                ["hover:bg-blue-200"],
                ["px-1", "py-1"],
                ["flex", "flex-col", "items-start"]
              )}
            >
              <span
                className={clsx(["text-xs", "text-slate-700", "font-mono"])}
              >
                オリジナル
              </span>
            </button>
            {fragment.nicovideoSources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                onClick={(e) => {
                  e.preventDefault();
                  setThumbnail(["NICOVIDEO", source.id]);
                }}
                className={clsx(
                  ["hover:bg-blue-200"],
                  ["px-1", "py-1"],
                  ["flex", "flex-col", "items-start"]
                )}
              >
                <span className={clsx(["text-xs", "text-slate-700"])}>
                  ニコニコ動画
                </span>
                <span
                  className={clsx(["text-xxs", "text-slate-500", "font-mono"])}
                >
                  {source.sourceId}
                </span>
              </a>
            ))}
            {fragment.youtubeSources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                onClick={(e) => {
                  e.preventDefault();
                  setThumbnail(["YOUTUBE", source.id]);
                }}
                className={clsx(
                  ["hover:bg-blue-200"],
                  ["px-1", "py-1"],
                  ["flex", "flex-col", "items-start"]
                )}
              >
                <span className={clsx(["text-xs", "text-slate-700"])}>
                  Youtube
                </span>
                <span
                  className={clsx(["text-xxs", "text-slate-500", "font-mono"])}
                >
                  {source.sourceId}
                </span>
              </a>
            ))}
          </div>
          <div className={clsx(["flex"])}>
            {thumbnail === "ORIGINAL" && (
              <VideoThumbnail
                fragment={fragment}
                className={clsx(["w-96"], ["h-48"])}
                width={384}
                height={192}
              />
            )}
            {Array.isArray(thumbnail) && thumbnail[0] === "NICOVIDEO" && (
              <iframe
                width="384"
                height="192"
                src={
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  fragment.nicovideoSources.find(
                    ({ id }) => id === thumbnail[1]
                  )!.embedUrl
                }
              />
            )}
            {Array.isArray(thumbnail) && thumbnail[0] === "YOUTUBE" && (
              <iframe
                width="384"
                height="192"
                src={
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  fragment.youtubeSources.find(({ id }) => id === thumbnail[1])!
                    .embedUrl
                }
              />
            )}
          </div>
        </div>
        <div className={clsx(["flex-grow"])}>
          <h1
            className={clsx(
              ["text-lg", "lg:text-xl"],
              ["font-bold"],
              ["text-slate-900"]
            )}
          >
            {fragment.title}
          </h1>
          <LikeButton className={clsx(["mt-2"])} videoId={fragment.id} />
          <LinkVideoEvents fragment={fragment}>編集履歴を見る</LinkVideoEvents>
        </div>
      </div>
    </div>
  );
};
