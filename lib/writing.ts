import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { collectMarkdownHeadings } from "./rehypeWritingHeadings";
import type { TOCHeading } from "./rehypeWritingHeadings";

const writingDirectory = path.join(process.cwd(), "content/writing");

export interface IWritingPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    content: string;
    readingTime: number;
    heroImage?: string;
    heroImageAlt?: string;
}

export function getReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

export function getSortedWritingData(): IWritingPost[] {
    const fileNames = fs.readdirSync(writingDirectory);

    const posts: IWritingPost[] = fileNames
        .filter((f) => f.endsWith(".md"))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, "");
            const fullPath = path.join(writingDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { content, data } = matter(fileContents);

            return {
                slug,
                title: data.title ?? slug,
                description: data.description ?? "",
                date: data.date ?? "",
                content,
                readingTime: getReadingTime(content),
                heroImage: data.heroImage,
                heroImageAlt: data.heroImageAlt,
            };
        });

    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllWritingSlugs(): { params: { slug: string } }[] {
    const fileNames = fs.readdirSync(writingDirectory);
    return fileNames
        .filter((f) => f.endsWith(".md"))
        .map((fileName) => ({
            params: { slug: fileName.replace(/\.md$/, "") },
        }));
}

export interface WritingNeighbors {
    prev?: { slug: string; title: string };
    next?: { slug: string; title: string };
}

export function getWritingNeighbors(slug: string): WritingNeighbors {
    const posts = getSortedWritingData();
    const i = posts.findIndex((p) => p.slug === slug);
    if (i === -1) return {};

    // Posts are sorted newest-first. "next" = newer = lower index.
    const newer = i > 0 ? posts[i - 1] : undefined;
    const older = i < posts.length - 1 ? posts[i + 1] : undefined;

    return {
        next: newer
            ? { slug: newer.slug, title: newer.title }
            : undefined,
        prev: older
            ? { slug: older.slug, title: older.title }
            : undefined,
    };
}

export interface WritingPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readingTime: number;
    heroImage?: string;
    heroImageAlt?: string;
    content: string;
    headings: TOCHeading[];
}

export async function getWritingPost(slug: string): Promise<WritingPost> {
    const fullPath = path.join(writingDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { content, data } = matter(fileContents);

    const headings = collectMarkdownHeadings(content);

    return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        readingTime: getReadingTime(content),
        heroImage: data.heroImage,
        heroImageAlt: data.heroImageAlt,
        content,
        headings,
    };
}
