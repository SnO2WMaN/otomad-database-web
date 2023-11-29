import "server-only";

import clsx from "clsx";
import { Suspense } from "react";

import { MadPageLink } from "~/app/(v2)/mads/[serial]/Link";
import { AllVideosPageLink } from "~/app/(v2)/mads/Link";
import { LoginLink } from "~/components/AuthLink";
import CommonTagLink from "~/components/CommonTagLink";
import Pictogram from "~/components/Pictogram";
import { VideoThumbnail } from "~/components/VideoThumbnail";
import { graphql } from "~/gql";
import { makeGraphQLClient } from "~/gql/fetch";

import Top from "./TopSection";

const getMADs = () =>
  makeGraphQLClient({ next: { revalidate: 120 } })
    .request(
      graphql(`
        query AboutPage_RecentVideos {
          findVideos(first: 12) {
            nodes {
              id
              title
              ...Link_Video
              ...VideoThumbnail
              taggings(first: 3) {
                nodes {
                  id
                  tag {
                    ...CommonTagLink
                  }
                }
              }
            }
          }
        }
      `)
    )
    .then((result) => result.findVideos.nodes);

export default async function Page() {
  return (
    <main className={clsx("flex w-full flex-col")}>
      <Top className={clsx("min-h-[calc(100vh-96px)] w-full")} />
      <section className={clsx("bg-obsidian-primary py-28")}>
        <div className={clsx("mx-auto max-w-screen-md px-8 md:px-4")}>
          <h2 className={clsx("text-2xl font-light text-snow-primary")}>
            <strong className={clsx(["text-vivid-primary"])}>OtoMADB</strong>
            とは何か、そして何であるべきか
          </h2>
          <p className={clsx("mt-2 text-sm text-snow-darker")}>
            ここに記載する内容は、一部実装中の内容を含むことが有ります。
          </p>
        </div>
        <div
          className={clsx(
            "mx-auto max-w-screen-lg divide-y divide-obsidian-lighter px-8 md:px-4"
          )}
        >
          <section className={clsx("py-16")}>
            <div>
              <h3 className={clsx("text-xl font-light text-snow-primary")}>
                プラットフォームを跨いで音MADを記録する
              </h3>
            </div>
            <p
              className={clsx("mt-4 text-sm leading-relaxed text-snow-primary")}
            >
              ニコニコ動画、YouTube、Bilibili、SoundCloudなど、音MADは様々な動画/音声投稿プラットフォームに投稿されています。
              それらを統一的に管理し、タグ情報などの適切なメタデータを与えることで、より様々な音MADを探しやすくします。
              もし、ある音MADがOtoMADBで登録されていなかった場合には、ユーザーは登録をリクエストすることが出来ます。
            </p>
          </section>
          <section className={clsx("py-16")}>
            <div>
              <h3 className={clsx("text-xl font-light text-snow-primary")}>
                より頑強なタグシステムの構築
              </h3>
            </div>
            <p
              className={clsx("mt-4 text-sm leading-relaxed text-snow-primary")}
            >
              現状のニコニコ動画などのタグシステムにおいて、タグは単なる文字情報を持っているだけで、タグの別名や、タグ間の親子関係など、様々な情報を十分に扱うことが出来ていないと考えています。
              OtoMADBではこれらを予め組み込んだ上で、頑強なタグシステムを構築することを目標としています。
            </p>
          </section>
          <section className={clsx("py-16")}>
            <div>
              <h3 className={clsx("text-xl font-light text-snow-primary")}>
                パーソナライズドされた音MADの推薦
              </h3>
            </div>
            <p
              className={clsx("mt-4 text-sm leading-relaxed text-snow-primary")}
            >
              <i className={clsx(["text-snow-darker"])}>実装中です。</i>
              あなたの音MADのいいね情報などから好みの傾向を分析し、それに合わせた音MADを推薦します。
            </p>
          </section>
          <section className={clsx("py-16")}>
            <div>
              <h3 className={clsx("text-xl font-light text-snow-primary")}>
                コミュニティ機能の実装
              </h3>
            </div>
            <p
              className={clsx("mt-4 text-sm leading-relaxed text-snow-primary")}
            >
              <i className={clsx(["text-snow-darker"])}>実装中です。</i>
              MADページにコメント欄などを実装したりすることで、コミュニティ機能を提供したいと思います。
            </p>
          </section>
        </div>
      </section>
      <section className={clsx("bg-obsidian-darker py-12")}>
        <div
          className={clsx(
            "mx-auto flex max-w-screen-md flex-col items-start px-8 md:flex-row md:items-center md:px-4"
          )}
        >
          <h2
            className={clsx(
              "mx-auto w-full grow text-2xl font-light text-snow-primary"
            )}
          >
            最近追加された音MAD
          </h2>
          <div className={clsx(["shrink-0"])}>
            <AllVideosPageLink
              className={clsx(
                "text-sm font-semibold text-snow-darker hover:underline"
              )}
            >
              もっと見る
            </AllVideosPageLink>
          </div>
        </div>
        <div className={clsx("mt-8")}>
          <Suspense fallback={<p>音MADを取得中です</p>}>
            <div
              className={clsx(
                "mx-auto grid max-w-screen-2xl grid-cols-2 items-stretch gap-1 overflow-scroll px-2 sm:grid-cols-3 md:grid-cols-4 md:px-4 lg:grid-cols-6"
              )}
            >
              {(await getMADs()).map((node) => (
                <div
                  key={node.id}
                  className={clsx(
                    "shrink-0 overflow-hidden rounded-sm border border-obsidian-lighter bg-obsidian-primary"
                  )}
                >
                  <MadPageLink className={clsx(["flex"])} fragment={node}>
                    <VideoThumbnail
                      fragment={node}
                      className={clsx(["h-32 w-full"])}
                      imageSize="large"
                    />
                  </MadPageLink>
                  <div className={clsx("flex flex-col gap-y-2 p-2")}>
                    <MadPageLink
                      fragment={node}
                      className={clsx(
                        "line-clamp-1 text-xs font-bold text-snow-primary hover:text-vivid-primary hover:underline"
                      )}
                    >
                      {node.title}
                    </MadPageLink>
                    <div className={clsx([])}>
                      {node.taggings.nodes.length === 0 && (
                        <div className={clsx("text-xxs text-slate-500")}>
                          タグ付けがありません
                        </div>
                      )}
                      <div className={clsx(["flex flex-wrap gap-0.5"])}>
                        {node.taggings.nodes.map((tagging) => (
                          <CommonTagLink
                            key={tagging.id}
                            fragment={tagging.tag}
                            className={clsx(["flex"])}
                            size="xs"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Suspense>
        </div>
      </section>
      <section
        className={clsx(
          "relative bg-[url('/distinct.gif')] bg-cover py-48 before:absolute before:inset-0 before:z-0 before:bg-vivid-primary/80 before:backdrop-blur-sm md:py-64"
        )}
      >
        <div
          className={clsx(
            "relative z-infinity mx-auto flex max-w-screen-md flex-col items-center px-8 md:px-4"
          )}
        >
          <h2
            className={clsx(
              "text-center text-2xl font-light text-obsidian-darker md:text-left"
            )}
          >
            Join{" "}
            <strong className={clsx("text-obsidian-darkest")}>OtoMADB</strong>.
          </h2>
          <p className={clsx(["text-base text-obsidian-darker"])}>
            皆も一緒にやってみよう
          </p>
          <LoginLink
            className={clsx(
              "mt-12 flex items-center gap-x-2 rounded-sm border border-obsidian-darker bg-transparent px-4 py-2 text-obsidian-darker duration-50 hover:bg-obsidian-darker hover/button:text-vivid-primary"
            )}
          >
            <Pictogram icon="signup" className={clsx("h-4")} />
            <span className={clsx("text-sm")}>参加してみる</span>
          </LoginLink>
        </div>
      </section>
    </main>
  );
}
