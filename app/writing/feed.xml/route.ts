import { getSortedWritingData } from "../../../lib/writing";
import siteMetadata from "../../../siteMetadata";

export function GET() {
    const posts = getSortedWritingData();
    const { siteURL, title, author } = siteMetadata;

    const items = posts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteURL}writing/${post.slug}</link>
      <guid isPermaLink="true">${siteURL}writing/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`,
        )
        .join("");

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title} — Writing</title>
    <link>${siteURL}writing</link>
    <description>Writing by ${author}</description>
    <language>en</language>
    <atom:link href="${siteURL}writing/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return new Response(feed.trim(), {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
