import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
    serialize,
    type SerializeOptions,
} from "next-mdx-remote-client/serialize";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { rehypeImageSize } from "./rehypeImageSize";

const writingDirectory = path.join(process.cwd(), "content/writing");

const mdxOptions: SerializeOptions = {
    disableImports: true,
    mdxOptions: {
        rehypePlugins: [rehypeUnwrapImages, rehypeImageSize],
    },
    parseFrontmatter: true,
};

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

export async function getWritingPost(slug: string) {
    const fullPath = path.join(writingDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { content, data } = matter(fileContents);

    const mdxSource = await serialize({
        source: content,
        options: mdxOptions,
    });

    return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date: data.date ?? "",
        readingTime: getReadingTime(content),
        heroImage: data.heroImage,
        heroImageAlt: data.heroImageAlt,
        mdxSource,
    };
}
