import { NextApiRequest, NextApiResponse } from "next";
import supertokens from "supertokens-node";
import { middleware } from "supertokens-node/framework/express";
import { superTokensNextWrapper } from "supertokens-node/nextjs";
import { verifySession } from "supertokens-node/recipe/session/framework/express";

import backendConfig from "~/supertokens/backend";

export const config = { runtime: "nodejs" };

supertokens.init(backendConfig());

const handler = async (
  req: NextApiRequest & Parameters<ReturnType<typeof verifySession>>[0],
  res: NextApiResponse & Parameters<ReturnType<typeof verifySession>>[1]
) => {
  await superTokensNextWrapper(
    async (next) => {
      res.setHeader(
        "Cache-Control",
        "no-cache, no-store, max-age=0, must-revalidate"
      );
      await middleware()(req, res, next);
    },
    req,
    res
  );
  if (!res.writableEnded) {
    res.status(404).send("Not found");
  }
};
export default handler;
