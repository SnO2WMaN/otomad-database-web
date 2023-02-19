"use client";

import "client-only";

import clsx from "clsx";
import React, { useState } from "react";

import { RegisterForm } from "./RegisterForm";
import { SourceIdInputForm } from "./SourceIdInputForm";

export const Form: React.FC<{ className?: string }> = ({ className }) => {
  const [sourceId, setSourceId] = useState<string>();

  return (
    <div
      className={clsx(
        className,
        [["px-4"], ["py-4"]],
        ["rounded"],
        ["border", "border-slate-300"],
        ["bg-slate-50"],
        ["flex", "flex-col", "gap-y-4"]
      )}
    >
      <SourceIdInputForm className={clsx()} set={(s) => setSourceId(s)} />
      <RegisterForm
        sourceId={sourceId}
        clearSourceId={() => {
          setSourceId(undefined);
        }}
      />
    </div>
  );
};
