import { getSortedWritingData } from "../../../lib/writing";
import { parseCalendarDate } from "../../../lib/date";
import siteMetadata from "../../../siteMetadata";

export const dynamic = "force-static";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function escapeCdata(value: string): string {
    // ]]> is the only sequence that can terminate a CDATA section. Split it
    // across two sections so consumers see the literal characters instead.
    return value.replace(/]]>/g, "]]]]><![CDATA[>");
}

function siteUrl(): string {
    // Normalize trailing slash so item links never produce `//`.
    return siteMetadata.siteURL.replace(/\/+$/, "");
}

export function GET() {
    const base = siteUrl();
    const posts = getSortedWritingData();
    if (posts.length === 0) {
        return new Response(null, { status: 404 });
    }
    const { title, author } = siteMetadata;

    const items = posts
        .map((post) => {
            const link = `${base}/writing/${post.slug}`;
            const parsed = parseCalendarDate(post.date);
            const pubDate = parsed
                ? `<pubDate>${parsed.toUTCString()}</pubDate>`
                : "";
            return `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description><![CDATA[${escapeCdata(post.description)}]]></description>
      ${pubDate}
    </item>`;
        })
        .join("");

    const channelTitle = escapeXml(`${title} — Writing`);
    const channelLink = escapeXml(`${base}/writing`);
    const channelDescription = escapeXml(`Writing by ${author}`);
    const selfLink = escapeXml(`${base}/writing/feed.xml`);

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${channelTitle}</title>
    <link>${channelLink}</link>
    <description>${channelDescription}</description>
    <language>en</language>
    <atom:link href="${selfLink}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(feed.trim(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
