"use client";

import { useAuth0 } from "@auth0/auth0-react";
import clsx from "clsx";

import Pictogram from "~/components/Pictogram";

export const SignupButton = ({
  className,
  theme,
}: {
  className?: string;
  theme: "vivid" | "coal";
}) => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      type="button"
      onClick={() => loginWithRedirect()}
      aria-label="ユーザー登録"
      className={clsx(
        className,
        "group/button flex items-center gap-x-2 rounded-sm border bg-transparent px-4 py-2 transition-colors duration-50 ",
        {
          "border-coal-darker hover:bg-coal-darker": theme === "coal",
          "border-vivid-primary hover:bg-vivid-primary": theme === "vivid",
        }
      )}
    >
      <Pictogram
        icon="signup"
        className={clsx("h-4 transition-colors duration-50", {
          "text-coal-darker group-hover/button:text-vivid-primary":
            theme === "coal",
          "text-vivid-primary group-hover/button:text-coal-darker":
            theme === "vivid",
        })}
      />
      <span
        className={clsx(
          "whitespace-nowrap text-sm transition-colors duration-50",
          {
            "text-coal-darker group-hover/button:text-vivid-primary":
              theme === "coal",
            "text-vivid-primary group-hover/button:text-coal-darker":
              theme === "vivid",
          }
        )}
      >
        ようこそ！
      </span>
    </button>
  );
};
