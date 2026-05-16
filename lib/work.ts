import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/work");

// Wrapped in React's request-scoped cache so generateMetadata + the page body
// + any RSC consumers that all call the same loader during one request only
// hit the file system once.
export const getSortedWorkData = cache((): IPostData[] => {
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData: IPostData[] = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, "");

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        const { content, data } = matter(fileContents);

        return {
            id,
            content,
            ...data,
        };
    });

    return allPostsData.sort((a, b) => {
        const dateA = a.date ?? "";
        const dateB = b.date ?? "";
        return dateA < dateB ? 1 : -1;
    });
});

export const getAllPostIds = cache((): { params: { id: string } }[] => {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ""),
            },
        };
    });
});

export interface IPostData {
    id: string;
    content: string;
    title?: string;
    description?: string;
    category?: string;
    date?: string;
    aliases?: string[];
    heroImage?: string;
    heroAspectRatio?: number;
    heroImageAlt?: string;
    officialURL?: string;
    officialURLText?: string;
    noMSFT?: boolean;
    hideFromList?: boolean;
    canonical?: string;
}

export const getPostData = cache((id: string): IPostData => {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { content, data } = matter(fileContents);

    return {
        id,
        content,
        ...data,
    };
});
