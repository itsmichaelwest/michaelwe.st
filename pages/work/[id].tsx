import Layout from "../../components/Layout";
import { getAllPostIds, getPostData, IPostData } from "../../lib/work";
import type { GetStaticProps, GetStaticPaths } from "next";
import {
    serialize,
    SerializeOptions,
    SerializeResult,
} from "next-mdx-remote-client/serialize";
import { MDXClient } from "next-mdx-remote-client";
import Image from "next/image";
import NoMSFTDisclaimer from "../../components/NoMSFTDisclaimer";
import Button from "../../components/Button";
import siteMetadata from "../../siteMetadata";
import rehypeUnwrapImages from "rehype-unwrap-images";
import rehypeImgSize from "rehype-img-size";
import { format, parseISO } from "date-fns";
import SEO from "../../components/SEO";
import { components } from "../../components/MDXComponents";

interface PostProps {
    postData: IPostData;
    mdxSource?: SerializeResult;
}

const Post: React.FC<PostProps> = ({ postData, mdxSource }) => {
    if (!mdxSource) return null;

    if ("error" in mdxSource) {
        return (
            <div className="text-red-500">Error: {mdxSource.error.message}</div>
        );
    }

    return (
        <Layout>
            <SEO
                title={`${postData.title} - ${siteMetadata.title}`}
                description={postData.description}
                image={`images/${postData.id}/${postData.featuredImage}`}
                type="article"
                canonical={`/work/${postData.id}`}
            />
            <article className="mb-16">
                <header className="mt-24 space-y-24">
                    <p className="text-sm mb-4 text-muted">
                        {postData.category} — {postData.date}
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        <div>
                            <h1 className="text-4xl font-display font-semibold tracking-tight leading-snug mb-8 text-heading">
                                {postData.title}
                            </h1>
                            {postData.officialURL && (
                                <Button to={postData.officialURL}>
                                    {postData.officialURLText}
                                </Button>
                            )}
                        </div>
                        {postData.description && (
                            <p className="text-primary leading-loose">
                                {postData.description}
                            </p>
                        )}
                    </div>
                    {postData.featuredImage && (
                        <Image
                            className="w-full rounded-3xl shadow-xs ring ring-black/5 dark:ring-white/5"
                            src={`/images/${postData.id}/${postData.featuredImage}`}
                            alt={postData.featuredImageAlt}
                            width={1000}
                            height={700}
                            sizes="100vw"
                        />
                    )}
                </header>
                <section className="my-24 mx-auto text-gray-800 dark:text-gray-200 space-y-8 leading-loose">
                    {postData.noMSFT && (
                        <NoMSFTDisclaimer title={postData.title} />
                    )}
                    <MDXClient {...mdxSource} components={components} />
                </section>
            </article>
        </Layout>
    );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    if (!id) {
        return { notFound: true };
    }

    const rawPostData = await getPostData(id);

    // Reformat the specified date to just the year (guard missing/invalid)
    const postData = {
        ...rawPostData,
        date: rawPostData.date
            ? format(parseISO(rawPostData.date), "yyyy")
            : undefined,
    };

    const options: SerializeOptions = {
        disableImports: true,
        mdxOptions: {
            rehypePlugins: [
                rehypeUnwrapImages,
                [rehypeImgSize, { dir: "public" }],
            ],
        },
        parseFrontmatter: true,
    };

    const mdxSource = await serialize({
        source: rawPostData.content,
        options,
    });

    return {
        props: {
            postData,
            mdxSource,
        },
    };
};
