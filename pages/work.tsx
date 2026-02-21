import Layout from "../components/Layout";
import { getSortedWorkData, IPostData } from "../lib/work";
import type { GetStaticProps } from "next";
import WorkBlock from "../components/WorkBlock";
import BlockGrid from "../components/BlockGrid";
import siteMetadata from "../siteMetadata";
import SEO from "../components/SEO";

const Work = ({ allPostsData }: { allPostsData: IPostData[] }) => (
    <Layout>
        <SEO title={`Work - ${siteMetadata.title}`} description={siteMetadata.description} canonical="/work" />
        <BlockGrid>
            {allPostsData.map(
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
    </Layout>
);

export default Work;

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
