import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import { graphql as mswGql } from "msw";

import { makeFragmentData } from "~/gql";
import { MockedUrqlProvider } from "~/utils/MockedUrqlProvider";

import { TimelineEventFragment } from "./TimelineEvent";
import TimelineSegment, { Query } from "./TimelineSegment";

const meta = {
  component: TimelineSegment,
  args: {
    style: { width: 720 },
    skip: 0,
    take: 3,
    fetchMore: action("fetchMore"),
  },
  render(args) {
    return (
      <MockedUrqlProvider>
        <TimelineSegment {...args} />
      </MockedUrqlProvider>
    );
  },
  parameters: {
    msw: {
      handlers: [
        mswGql.query(Query, (req, res, ctx) =>
          res(
            ctx.data({
              showTimeline: [
                makeFragmentData(
                  {
                    __typename: "NicovideoMadRequestedTimelineEvent",
                    createdAt: "2021-01-01T00:00:00.000Z",
                    request: {
                      id: "request:1",
                      title: "Title 1",
                      sourceId: "sm2057168",
                      thumbnailUrl: "/960x540.jpg",
                      originalUrl: "https://www.nicovideo.jp/watch/sm2057168",
                    },
                  },
                  TimelineEventFragment
                ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- なぜか型があってない
                makeFragmentData(
                  {
                    __typename: "NicovideoMadRequestedTimelineEvent",
                    createdAt: "2021-01-01T00:00:00.000Z",
                    request: {
                      id: "request:2",
                      title: "Title 2",
                      sourceId: "sm2057168",
                      thumbnailUrl: "/960x540.jpg",
                      originalUrl: "https://www.nicovideo.jp/watch/sm2057168",
                    },
                  },
                  TimelineEventFragment
                ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- なぜか型があってない
                makeFragmentData(
                  {
                    __typename: "NicovideoMadRequestedTimelineEvent",
                    createdAt: "2021-01-01T00:00:00.000Z",
                    request: {
                      id: "request:3",
                      title: "Title 3",
                      sourceId: "sm2057168",
                      thumbnailUrl: "/960x540.jpg",
                      originalUrl: "https://www.nicovideo.jp/watch/sm2057168",
                    },
                  },
                  TimelineEventFragment
                ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- なぜか型があってない
              ],
            })
          )
        ),
      ],
    },
  },
} as Meta<typeof TimelineSegment>;
export default meta;

type Story = StoryObj<typeof meta>;

export const LatestFulfill: Story = {
  name: "最後尾かつ不足なく取得",
  args: {},
};

export const LatestNotFulfill: Story = {
  name: "最後尾だが不足がある",
  args: {},
  parameters: {
    msw: {
      handlers: [
        mswGql.query(Query, (req, res, ctx) =>
          res(
            ctx.data({
              showTimeline: [
                makeFragmentData(
                  {
                    __typename: "NicovideoMadRequestedTimelineEvent",
                    createdAt: "2021-01-01T00:00:00.000Z",
                    request: {
                      id: "request:2",
                      title: "Title 2",
                      sourceId: "sm2057168",
                      thumbnailUrl: "/960x540.jpg",
                      originalUrl: "https://www.nicovideo.jp/watch/sm2057168",
                    },
                  },
                  TimelineEventFragment
                ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- なぜか型があってない
                makeFragmentData(
                  {
                    __typename: "NicovideoMadRequestedTimelineEvent",
                    createdAt: "2021-01-01T00:00:00.000Z",
                    request: {
                      id: "request:2",
                      title: "Title 2",
                      sourceId: "sm2057168",
                      thumbnailUrl: "/960x540.jpg",
                      originalUrl: "https://www.nicovideo.jp/watch/sm2057168",
                    },
                  },
                  TimelineEventFragment
                ) as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- なぜか型があってない
              ],
            })
          )
        ),
      ],
    },
  },
};

export const NotLatestFulfiil: Story = {
  name: "最後尾ではないが不足なく取得",
  args: {
    fetchMore: undefined,
  },
};

export const Fetching: Story = {
  name: "取得中",
  args: {},
  parameters: {
    msw: {
      handlers: [
        mswGql.query(Query, (req, res, ctx) => res(ctx.delay("infinite"))),
      ],
    },
  },
};
