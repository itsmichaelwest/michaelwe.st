import { MDXRemote } from "next-mdx-remote-client/rsc";
import rehypeUnwrapImages from "rehype-unwrap-images";
import { components } from "../../../components/MDXComponents";
import { rehypeImageSize } from "../../../lib/rehypeImageSize";
import { rehypeWritingHeadings } from "../../../lib/rehypeWritingHeadings";

function MDXErrorBoundary({ error }: { error: Error }): never {
    // Surface the failure during static generation so a malformed post fails
    // the build instead of silently shipping an empty article.
    throw error;
}

export function WritingBody({ source }: { source: string }) {
    return (
        <MDXRemote
            source={source}
            options={{
                disableImports: true,
                mdxOptions: {
                    rehypePlugins: [
                        rehypeUnwrapImages,
                        rehypeImageSize,
                        rehypeWritingHeadings(),
                    ],
                },
            }}
            components={components}
            onError={MDXErrorBoundary}
        />
    );
}
