"use client";

import { ResultOf } from "@graphql-typed-document-node/core";
import clsx from "clsx";
import { CSSProperties, useCallback, useMemo, useState } from "react";
import { useMutation } from "urql";

import { MadPageLink } from "~/app/(v2)/mads/[serial]/Link";
import SoundcloudRequestPageLink from "~/app/(v2)/requests/soundcloud/[sourceId]/Link";
import useToaster from "~/components/Toaster/useToaster";
import { FragmentType, graphql, useFragment } from "~/gql";

import { ButtonsPart, EditorablePart, Tab } from "../RequestFormCommon";
import useRequestFormEditSemitaggings from "../useRequestFormEditSemitaggings";
import useRequestEditTags from "../useRequestFormEditTaggings";
import SoundcloudOriginalSource from "./SoundcloudOriginalSource";

export const SoundcloudRequestMutation = graphql(`
  mutation RequestMADFromSoundcloudForm_Request(
    $input: RequestSoundcloudRegistrationInput!
  ) {
    requestSoundcloudRegistration(input: $input) {
      __typename
      ... on RequestSoundcloudRegistrationVideoAlreadyRegisteredError {
        source {
          id
          sourceId
          video {
            id
            ...Link_Video
          }
        }
      }
      ... on RequestSoundcloudRegistrationSucceededPayload {
        request {
          id
          sourceId
          ...SoundcloudRequestPageLink
        }
      }
    }
  }
`);
const useRequestFromSoundcloud = ({
  onSuccess,
  onFailure,
  onAlready,
}: {
  onSuccess(
    data: Extract<
      ResultOf<
        typeof SoundcloudRequestMutation
      >["requestSoundcloudRegistration"],
      { __typename: "RequestSoundcloudRegistrationSucceededPayload" }
    >
  ): void;
  onAlready(
    data: Extract<
      ResultOf<
        typeof SoundcloudRequestMutation
      >["requestSoundcloudRegistration"],
      { __typename: "RequestSoundcloudRegistrationVideoAlreadyRegisteredError" }
    >
  ): void;
  onFailure(): void;
}) => {
  const [, register] = useMutation(SoundcloudRequestMutation);

  return useCallback(
    async ({
      sourceId,
      title,
      originalThumbnailUrl,
      taggings,
      semitaggings,
    }: {
      sourceId: string;
      title: string;
      /**
       * Soundcloud側のサムネイル画像のURL
       */
      originalThumbnailUrl: string | null;
      taggings: { tagId: string; note: null }[];
      semitaggings: { name: string; note: null }[];
    }) => {
      const { data, error } = await register({
        input: {
          sourceId,
          title,
          thumbnailUrl: originalThumbnailUrl,
          taggings,
          semitaggings,
        },
      });
      if (error || !data) {
        onFailure();
        return;
      }

      switch (data.requestSoundcloudRegistration.__typename) {
        case "RequestSoundcloudRegistrationSucceededPayload":
          onSuccess(data.requestSoundcloudRegistration);
          break;
        case "RequestSoundcloudRegistrationVideoAlreadyRegisteredError":
          onAlready(data.requestSoundcloudRegistration);
          break;
        case "MutationInvalidTagIdError":
        case "MutationTagNotFoundError":
        default:
          onFailure();
          break;
      }
    },
    [onAlready, onFailure, onSuccess, register]
  );
};

export const SoundcloudRequestFormOriginalSourceFragment = graphql(`
  fragment SoundcloudRequestForm_OriginalSource on SoundcloudOriginalSource {
    sourceId
    title
    url
    thumbnailUrl(scale: LARGE)
    ...SoundcloudForm_OriginalSource
  }
`);
export default function SoundcloudRequestForm({
  className,
  style,
  handleSuccess,
  handleCancel,
  sourceFragment,
}: {
  className?: string;
  style?: CSSProperties;
  handleSuccess(): void;
  handleCancel(): void;
  sourceFragment: FragmentType<
    typeof SoundcloudRequestFormOriginalSourceFragment
  >;
}) {
  const source = useFragment(
    SoundcloudRequestFormOriginalSourceFragment,
    sourceFragment
  );
  const [title, setTitle] = useState<string>(source.title);

  const { appendTag, removeTag, taggings, taggingsPayload, isSelecting } =
    useRequestEditTags();
  const {
    semitaggings,
    semitaggingsPayload,
    isIncludeSemitag,
    appendSemitag,
    removeSemitag,
  } = useRequestFormEditSemitaggings();

  const callToast = useToaster();
  const requestVideo = useRequestFromSoundcloud({
    onSuccess({ request }) {
      callToast(
        <>
          <SoundcloudRequestPageLink
            fragment={request}
            className={clsx("font-mono text-vivid-primary")}
          >
            {request.sourceId}
          </SoundcloudRequestPageLink>
          リクエストしました
        </>
      );
      handleSuccess();
    },
    onAlready({ source: { sourceId, video } }) {
      callToast(
        <>
          <span>{sourceId}</span>は受理されて
          <MadPageLink fragment={video}>既に登録されています。</MadPageLink>
        </>
      );
    },
    onFailure() {
      callToast(<>登録に失敗しました。</>);
    },
  });

  const [tab, setTab] = useState<"SOURCE">("SOURCE");

  const payload = useMemo(() => {
    if (!title) return null;

    return {
      sourceId: source.sourceId,
      title,
      originalThumbnailUrl: source.thumbnailUrl || null,
      taggings: taggingsPayload,
      semitaggings: semitaggingsPayload,
    } satisfies Parameters<typeof requestVideo>[0];
  }, [
    semitaggingsPayload,
    source.sourceId,
    source.thumbnailUrl,
    taggingsPayload,
    title,
  ]);

  return (
    <form
      style={style}
      className={clsx(className, "flex flex-col gap-y-6 p-2")}
      onSubmit={(e) => {
        e.preventDefault();
        if (!payload) return;
        requestVideo(payload);
      }}
    >
      <EditorablePart
        title={title}
        setTitle={setTitle}
        appendSemitag={appendSemitag}
        appendTag={appendTag}
        isIncludeSemitag={isIncludeSemitag}
        removeSemitag={removeSemitag}
        removeTag={removeTag}
        taggings={taggings}
        semitaggings={semitaggings}
      />
      <div className={clsx("flex grow flex-col gap-y-2")}>
        <Tab
          choices={["SOURCE"]}
          current="SOURCE"
          setTab={(tab) => setTab(tab)}
        />
        <div className={clsx({ hidden: tab !== "SOURCE" })}>
          <SoundcloudOriginalSource fragment={source} />
        </div>
      </div>
      <ButtonsPart disabled={!payload} handleCancel={handleCancel} />
    </form>
  );
}
