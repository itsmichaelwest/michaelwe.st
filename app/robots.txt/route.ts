import siteMetadata from "../../siteMetadata";

export const dynamic = "force-static";

export function GET() {
    const baseUrl = siteMetadata.siteURL.replace(/\/$/, "");
    const body =
        [
            "User-agent: *",
            "Allow: /",
            "Content-Signal: ai-train=no, search=yes, ai-input=yes",
            "",
            `Sitemap: ${baseUrl}/sitemap.xml`,
        ].join("\n") + "\n";
    return new Response(body, {
        headers: {
            "content-type": "text/plain; charset=utf-8",
        },
    });
}
