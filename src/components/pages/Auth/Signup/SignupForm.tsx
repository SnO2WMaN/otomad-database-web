"use client";

import "client-only";

import {
  AtSymbolIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import clsx from "clsx";
import React, { useCallback, useContext, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";
import * as z from "zod";

import { AuthPageGuardContext } from "~/app/auth/Guard";
import { LinkSignin } from "~/app/auth/signin/Link";
import { BlueButton } from "~/components/common/Button";
import { graphql } from "~/gql";
import { TurnstileVerifyResponse } from "~/turnstile";

import { AuthFormInput } from "../FormInput";

const formSchema = z.object({
  name: z.string().min(3, { message: "ユーザーネームは3文字以上です" }),
  displayName: z.string().min(1, { message: "1文字以上" }),
  email: z.string().email({ message: "メールアドレスの形式でない" }),
  password: z.string().min(8, { message: "パスワードは8文字以上" }),
  passwordRepeat: z.string().min(8, { message: "パスワードは8文字以上" }),
});
type FormSchema = z.infer<typeof formSchema>;
export const SignupForm: React.FC<{ className?: string }> = ({ className }) => {
  const updateGuard = useContext(AuthPageGuardContext);

  const turnstileRef = useRef<TurnstileInstance>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [, signup] = useMutation(
    graphql(`
      mutation SignupPage_Signup(
        $name: String!
        $displayName: String!
        $password: String!
        $email: String!
      ) {
        signup(
          input: {
            name: $name
            displayName: $displayName
            password: $password
            email: $email
          }
        ) {
          ... on SignupNameAlreadyExistsError {
            name
          }
          ... on SignupEmailAlreadyExistsError {
            email
          }
          ... on SignupSucceededPayload {
            user {
              id
              ...GlobalNav_Profile
            }
          }
        }
      }
    `)
  );
  const onSubmit: SubmitHandler<FormSchema> = useCallback(
    async ({ name, displayName, email, password }) => {
      if (!turnstileToken) {
        // TODO: 何らかの警告を出す
        return;
      }
      const verifyTurnstile: TurnstileVerifyResponse = await fetch(
        "/api/turnstile",
        { method: "POST", body: new URLSearchParams({ token: turnstileToken }) }
      ).then((r) => r.json());
      if (!verifyTurnstile.success) {
        turnstileRef.current?.reset();
        // TODO: 何らかの警告を出す
        return;
      }

      const { data, error } = await signup({
        name,
        displayName,
        email,
        password,
      });
      if (error || !data) {
        // TODO: エラー処理
        return;
      }

      switch (data.signup.__typename) {
        case "SignupSucceededPayload":
          updateGuard();
          return;
        case "SignupNameAlreadyExistsError":
          setError("name", { message: "既に登録されているユーザーネームです" });
          return;
        case "SignupEmailAlreadyExistsError":
          setError("email", {
            message: "既に登録されているメールアドレスです",
          });
          return;
        default:
          // TODO: 他のエラー処理
          return;
      }
    },
    [setError, signup, turnstileToken, updateGuard]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx(
        className,
        ["rounded-lg"],
        ["px-8", "py-12"],
        ["flex", "flex-col", "gap-y-2"],
        ["bg-slate-100"],
        ["border", "border-slate-200"],
        ["shadow-lg"]
      )}
    >
      <div className={clsx(["grid"], ["grid-cols-1"], ["gap-y-4"])}>
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("name")}
              {...props}
              type={"text"}
              placeholder="ユーザーネーム"
            ></input>
          )}
          Icon={(props) => <AtSymbolIcon {...props} />}
          error={errors.name}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("displayName")}
              {...props}
              type={"text"}
              placeholder="表示される名前"
            ></input>
          )}
          Icon={(props) => <UserIcon {...props} />}
          error={errors.displayName}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("email")}
              {...props}
              type={"text"}
              placeholder="メールアドレス"
            ></input>
          )}
          Icon={(props) => <EnvelopeIcon {...props} />}
          error={errors.email}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("password")}
              {...props}
              type={"password"}
              placeholder="パスワード"
            ></input>
          )}
          Icon={(props) => <LockClosedIcon {...props} />}
          error={errors.password}
        />
        <AuthFormInput
          Input={(props) => (
            <input
              {...register("passwordRepeat", {
                validate: (value) => {
                  console.log(getValues("password"), value);
                  return (
                    getValues("password") === value ||
                    "パスワードが一致しません"
                  );
                },
              })}
              {...props}
              type={"password"}
              placeholder="パスワードの再入力"
            ></input>
          )}
          Icon={(props) => <LockClosedIcon {...props} />}
          error={errors.passwordRepeat}
        />
      </div>
      <div>
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => {
            setTurnstileToken(token);
          }}
        />
      </div>
      <div>
        <BlueButton
          className={clsx(["w-full"], ["py-2"])}
          disabled={!turnstileToken}
        >
          ユーザー登録
        </BlueButton>
      </div>
      <div className={clsx(["mt-4"])}>
        <p>
          <LinkSignin
            className={clsx(
              ["text-blue-400", "hover:text-blue-500"],
              ["text-sm"]
            )}
          >
            ユーザー登録が既に済んでいるなら
          </LinkSignin>
        </p>
      </div>
    </form>
  );
};
