"use client";

import { PseudoTagType } from "~/gql/graphql";

export type TagType = {
  id: string;
  name: string;
  // type: string;
  explicitParent: { id: string; name: string } | null;
  type: PseudoTagType;
};

export type HistoryItemType = {
  id: string;
  createdAt: string;
  user: { id: string; name: string; displayName: string; icon: string };
} & (
  | { type: "REGISTER" }
  | { type: "ADD_TITLE"; title: string }
  | { type: "DELETE_TITLE"; title: string }
  | { type: "CHANGE_PRIMARY_TITLE"; from: string | null; to: string }
  | { type: "ADD_THUMBNAIL"; thumbnail: string }
  | { type: "DELETE_THUMBNAIL"; thumbnail: string }
  | { type: "CHANGE_PRIMARY_THUMBNAIL"; from: string | null; to: string }
  | { type: "ADD_TAG"; tag: TagType }
  | { type: "DELETE_TAG"; tag: TagType }
  | { type: "ADD_NICONICO_SOURCE" }
);
