import { ImageResponse } from "next/og";

import { graphql } from "~/gql";
import { makeGraphQLClient } from "~/gql/fetch";
import { loadGoogleFont } from "~/utils/loadGoogleFonts";

export const size = {
  width: 960,
  height: 540,
};
export const contentType = "image/png";
export const revalidate = 86400;

export default async function og({ params }: { params: { serial: string } }) {
  const result = await makeGraphQLClient()
    .request(
      graphql(`
        query TagPage_OGImage($serial: Int!) {
          findTagBySerial(serial: $serial) {
            name
            serial
            taggedVideosByOffset(input: { offset: 0, take: 24 }) {
              nodes {
                video {
                  thumbnailUrl
                }
              }
            }
          }
        }
      `),
      { serial: parseInt(params.serial, 10) }
    )
    .then((data) => data.findTagBySerial);

  if (!result) return new Response("Video not found", { status: 404 });

  const { name, serial, taggedVideosByOffset } = result;
  const urltext = `otomadb.com/tags/${serial}`;

  const notoserif = await loadGoogleFont({
    family: "Noto Serif JP",
    weight: 700,
    text: name,
  });
  const spacemono = await loadGoogleFont({
    family: "Space Mono",
    weight: 400,
    text: urltext,
  });

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            padding: "48px 64px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(to top, #00000000, #000000cc)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              fontFamily: "Noto Serif JP",
              fontSize: 36,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            <span lang="ja-JP">{name}</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#F0F0F0",
              fontFamily: "Space Mono",
            }}
          >
            <span>{urltext}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Noto Serif JP",
          data: notoserif,
          style: "normal",
          weight: 700,
        },
        {
          name: "Space Mono",
          data: spacemono,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
