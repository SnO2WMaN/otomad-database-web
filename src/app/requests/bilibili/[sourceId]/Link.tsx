import Link from "next/link";
import { ComponentProps } from "react";

import { FragmentType, graphql, useFragment } from "~/gql";

export const BilibiliRequestPageLinkFragment = graphql(`
  fragment BilibiliRequestPageLink on BilibiliRegistrationRequest {
    sourceId
  }
`);
export default function BilibiliRequestPageLink({
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  fragment: FragmentType<typeof BilibiliRequestPageLinkFragment>;
}) {
  const { sourceId } = useFragment(
    BilibiliRequestPageLinkFragment,
    props.fragment
  );
  return (
    <Link href={`/requests/bilibili/${sourceId}`} {...props}>
      {children}
    </Link>
  );
}
