import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/work");

export function getSortedWorkData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, "");

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");

        // Use gray-matter to parse the post metadata section
        const { content, data } = matter(fileContents);

        // Combine the data with the id
        return {
            id,
            content,
            ...data,
        };
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ""),
            },
        };
    });
}

export interface IPostData {
    id: any;
    content: string;
    title?: string;
    description?: string;
    category?: string;
    date?: string;
    aliases?: string[];
    featuredImage?: string;
    featuredBlockImage?: string;
    featuredImageAlt?: string;
    featuredImageTwo?: string
    officialURL?: string;
    officialURLText?: string;
    noMSFT?: boolean;
    hideFromList?: boolean;
    canonical?: string;
}

export const getPostData = (id): IPostData => {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { content, data } = matter(fileContents);

    return {
        id,
        content,
        ...data,
    };
}
