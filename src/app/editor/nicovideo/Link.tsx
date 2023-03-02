import Link from "next/link";
import { stringify } from "querystring";
import React, { ComponentProps } from "react";

export type SearchParams = { sourceId?: string };

export const LinkRegisterNicovideo: React.FC<
  Omit<ComponentProps<typeof Link>, "href"> & SearchParams
> = ({ children, sourceId, ...props }) => (
  <Link href={`/editor/nicovideo?${stringify({ sourceId })}`} {...props}>
    {children}
  </Link>
);
