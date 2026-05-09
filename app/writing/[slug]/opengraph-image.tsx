import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";
import { format } from "date-fns";
import { getWritingPost } from "../../../lib/writing";
import { parseCalendarDate } from "../../../lib/date";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const commitMonoRegular = readFileSync(
    path.join(
        process.cwd(),
        "node_modules/@fontsource/commit-mono/files/commit-mono-latin-400-normal.woff",
    ),
);
const commitMonoSemiBold = readFileSync(
    path.join(
        process.cwd(),
        "node_modules/@fontsource/commit-mono/files/commit-mono-latin-600-normal.woff",
    ),
);

export default async function OGImage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getWritingPost(slug);
    const parsedDate = parseCalendarDate(post.date);
    const formattedDate = parsedDate
        ? format(parsedDate, "MMM d, yyyy")
        : "";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "80px",
                    fontFamily: "Commit Mono",
                    color: "#212121",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 22,
                        color: "#666666",
                    }}
                >
                    michaelwe.st/writing
                </div>

                <div
                    style={{
                        display: "flex",
                        fontSize: 64,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                    }}
                >
                    {post.title}
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 22,
                        color: "#666666",
                    }}
                >
                    <span>Michael West</span>
                    <span>
                        {formattedDate}
                        {"  ·  "}
                        {post.readingTime} min read
                    </span>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "Commit Mono",
                    data: commitMonoRegular,
                    style: "normal",
                    weight: 400,
                },
                {
                    name: "Commit Mono",
                    data: commitMonoSemiBold,
                    style: "normal",
                    weight: 600,
                },
            ],
        },
    );
}
