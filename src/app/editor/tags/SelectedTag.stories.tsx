import { action } from "@storybook/addon-actions";
import { Meta, StoryObj } from "@storybook/react";
import { graphql as mockGql } from "msw";

import { Fragment as CommonTagFragment } from "~/components/CommonTag";
import { makeFragmentData } from "~/gql";
import { TagType } from "~/gql/graphql";
import { MockedUrqlProvider } from "~/utils/MockedUrqlProvider";

import { RegisterTagForm } from "./Form";
import { Query, SelectedTag } from "./SelectedTag";

const meta = {
  component: RegisterTagForm,
  args: {
    style: {
      width: 360,
    },
    remove: action("remove"),
    tagId: "id:tag1",
  },
  render(args) {
    return (
      <MockedUrqlProvider>
        <SelectedTag {...args} />
      </MockedUrqlProvider>
    );
  },
  parameters: {
    msw: {
      handlers: [
        mockGql.query(Query, (req, res, ctx) =>
          res(
            ctx.data({
              getTag: {
                id: "id:tag1",
                ...makeFragmentData(
                  {
                    name: "Tag 1",
                    type: TagType.Character,
                    explicitParent: {
                      id: "id:tag2",
                      name: "Tag 2",
                    },
                  },
                  CommonTagFragment
                ),
              },
            })
          )
        ),
      ],
    },
  },
} as Meta<typeof SelectedTag>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
