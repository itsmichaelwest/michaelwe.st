import Head from "next/head";
import Layout from "../components/Layout";
import { getSortedWorkData, IPostData } from "../lib/work";
import type { GetStaticProps } from "next";
import WorkBlock from "../components/WorkBlock";
import BlockGrid from "../components/BlockGrid";
import IndexHero from "../components/IndexHero";
import siteMetadata from "../siteMetadata";

const Home = ({ allPostsData }: { allPostsData: IPostData[] }): JSX.Element => (
    <Layout>
        <Head>
            <title>{siteMetadata.title}</title>
            <meta name="description" content={siteMetadata.description} />
            <meta property="og:title" content={siteMetadata.title} />
            <meta
                property="og:description"
                content={siteMetadata.description}
            />
            <meta property="og:site_name" content={siteMetadata.title} />
            <meta property="twitter:card" content="summary" />
            <meta
                property="twitter:site"
                content={siteMetadata.social.twitter}
            />
            <meta property="twitter:title" content={siteMetadata.title} />
            <meta
                property="twitter:description"
                content={siteMetadata.description}
            />
            <meta
                property="twitter:creator"
                content={siteMetadata.social.twitter}
            />
        </Head>
        <IndexHero />
        <div className="lg:my-24 my-16">
            <h2 className="font-display font-semibold tracking-tight text-4xl mb-16 text-gray-800 dark:text-gray-200">
                Recent work
            </h2>
            <BlockGrid>
                {allPostsData
                    .slice(0, 4)
                    .map(
                        ({
                            id,
                            title,
                            description,
                            featuredBlockImage,
                            featuredImageAlt,
                            canonical,
                        }) => (
                            <WorkBlock
                                key={id}
                                title={title}
                                url={canonical ? canonical : `/work/${id}`}
                                description={description}
                                image={`/images/${id}/${featuredBlockImage}`}
                                imageAlt={featuredImageAlt}
                            />
                        ),
                    )}
            </BlockGrid>
        </div>
    </Layout>
);

export default Home;

export const getStaticProps: GetStaticProps<{
    allPostsData: IPostData[];
}> = async () => {
    const allPostsData = getSortedWorkData();

    return {
        props: {
            allPostsData,
        },
    };
};
