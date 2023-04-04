"use client";

import "client-only";

import { useAuth0 } from "@auth0/auth0-react";

export const useGetAccessToken = () => {
  const { getAccessTokenWithPopup } = useAuth0();
  return getAccessTokenWithPopup;
};
