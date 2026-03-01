import type { MetadataRoute } from "next";
import { getSortedWorkData } from "../lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.michaelwe.st";

    const workItems = getSortedWorkData()
        .filter((p) => !p.hideFromList && !p.canonical)
        .map((p) => ({
            url: `${baseUrl}/work/${p.id}`,
            lastModified: p.date ? new Date(p.date) : undefined,
        }));

    return [
        { url: baseUrl, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
        ...workItems,
    ];
}
