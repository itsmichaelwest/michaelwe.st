import { getSortedWorkData } from "./work";
import {
    serialize,
    type SerializeOptions,
} from "next-mdx-remote-client/serialize";
import rehypeUnwrapImages from "rehype-unwrap-images";
import rehypeImgSize from "rehype-img-size";
import type { ItemData } from "../components/Gallery";

const mdxOptions: SerializeOptions = {
    disableImports: true,
    mdxOptions: {
        rehypePlugins: [rehypeUnwrapImages, [rehypeImgSize, { dir: "public" }]],
    },
    parseFrontmatter: true,
};

export async function getGalleryItems(): Promise<ItemData[]> {
    "use cache";
    const posts = getSortedWorkData().filter((p) => !p.hideFromList);

    return Promise.all(
        posts.map(async (p) => {
            const mdxSource = await serialize({
                source: p.content,
                options: mdxOptions,
            });
            return {
                id: p.id,
                title: p.title ?? p.id,
                subtitle: p.description ?? p.category ?? "",
                aspect: p.heroAspectRatio ?? 1.0,
                railH: 0.8,
                img: p.heroImage ? `/images/${p.id}/${p.heroImage}` : undefined,
                canonical: p.canonical ?? null,
                noMSFT: p.noMSFT ?? false,
                officialURL: p.officialURL,
                officialURLText: p.officialURLText,
                year: p.date
                    ? new Date(p.date).getFullYear().toString()
                    : undefined,
                mdxSource,
            };
        }),
    );
}
