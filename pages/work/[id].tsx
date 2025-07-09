import Head from "next/head";
import Layout from "../../components/Layout";
import { getAllPostIds, getPostData, IPostData } from "../../lib/work";
import type { GetStaticProps, GetStaticPaths } from "next";
import {
    serialize,
    SerializeOptions,
    SerializeResult,
} from "next-mdx-remote-client/serialize";
import { MDXClient } from "next-mdx-remote-client";
import CustomImage from "../../components/Image";
import Image from "next/image";
import NoMSFTDisclaimer from "../../components/NoMSFTDisclaimer";
import Button from "../../components/Button";
import siteMetadata from "../../siteMetadata";
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeImgSize from "rehype-img-size";
import { format, parseISO } from "date-fns";

const components = {
    img: CustomImage,
};

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
            <Head>
                <title>{`${postData.title} - ${siteMetadata.title}`}</title>
                <meta name="description" content={postData.description} />

                <meta property="og:title" content={postData.title} />
                <meta property="og:type" content="article" />
                <meta
                    property="og:image"
                    content={`${siteMetadata.siteURL}images/${postData.id}/${postData.featuredImage}`}
                />
                <meta
                    property="og:description"
                    content={postData.description}
                />
                <meta property="og:site_name" content={siteMetadata.title} />

                <meta property="twitter:card" content="summary_large_image" />
                <meta
                    property="twitter:site"
                    content={siteMetadata.social.twitter}
                />
                <meta property="twitter:title" content={postData.title} />
                <meta
                    property="twitter:description"
                    content={postData.description}
                />
                <meta
                    property="twitter:creator"
                    content={siteMetadata.social.twitter}
                />
                <meta
                    property="twitter:image"
                    content={`${siteMetadata.siteURL}images/${postData.id}/${postData.featuredImage}`}
                />
            </Head>
            <article className="mb-16">
                <header className="mt-16">
                    <p className="font-body text-sm mb-4 text-gray-600 dark:text-gray-500">
                        {postData.category} — {postData.date}
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                        <div>
                            <h1 className="text-6xl font-display font-semibold tracking-tight mb-8 text-gray-900 dark:text-gray-100">
                                {postData.title}
                            </h1>
                            {postData.officialURL && (
                                <Button to={postData.officialURL}>
                                    {postData.officialURLText}
                                </Button>
                            )}
                        </div>
                        {postData.description && (
                            <p className="text-gray-800 dark:text-gray-200">
                                {postData.description}
                            </p>
                        )}
                    </div>
                    {postData.featuredImage && (
                        <div className="mt-32">
                            <Image
                                className="w-full"
                                src={`/images/${postData.id}/${postData.featuredImage}`}
                                alt={postData.featuredImageAlt}
                                width={1000}
                                height={700}
                            />
                        </div>
                    )}
                </header>
                <section className="prose dark:prose-dark mx-auto font-body leading-loose my-24">
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

    // Reformat the specified date to just the year
    const postData = {
        ...rawPostData,
        date: format(parseISO(rawPostData.date), "yyyy"),
    };

    const options: SerializeOptions = {
        disableImports: true,
        mdxOptions: {
            remarkPlugins: [remarkUnwrapImages],
            rehypePlugins: [[rehypeImgSize, { dir: "public" }]],
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
