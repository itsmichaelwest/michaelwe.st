import Layout from "../components/Layout";
import { getSortedWorkData, IPostData } from "../lib/work";
import type { GetStaticProps } from "next";
import WorkBlock from "../components/WorkBlock";
import BlockGrid from "../components/BlockGrid";
import IndexHero from "../components/IndexHero";
import siteMetadata from "../siteMetadata";
import SEO from "../components/SEO";
import MeshGradientCSS, { MeshPointCSS } from "../components/MeshGradientCSS";

const DEFAULT_POINTS: MeshPointCSS[] = [
    // Blue-adjacent cohesive palette (sky/blue/indigo/cyan tints)
    { id: "a", x: 0.15, y: 0.25, color: "#93C5FD", radius: 220 }, // blue-300
    { id: "b", x: 0.5, y: 0.1, color: "#C7D2FE", radius: 260 }, // indigo-200
    { id: "c", x: 0.85, y: 0.35, color: "#A5F3FC", radius: 220 }, // cyan-200
    { id: "d", x: 0.25, y: 0.7, color: "#60A5FA", radius: 260 }, // blue-400
    { id: "e", x: 0.75, y: 0.75, color: "#BAE6FD", radius: 260 }, // sky-200
];

const Home = ({ allPostsData }: { allPostsData: IPostData[] }) => {
    return (
        <Layout>
            <SEO
                title={siteMetadata.title}
                description={siteMetadata.description}
                canonical="/"
            />

            {/* Mesh gradient header section */}
            <section className="relative w-full">
                {/* Full-bleed background gradient behind hero */}
                <div
                    className="absolute inset-0 z-0 overflow-x-clip"
                    style={{
                        // Pull the gradient up under the header
                        top: "calc(env(safe-area-inset-top) - 16rem)",
                        left: "calc(50% - 50vw + env(safe-area-inset-left))",
                        right: "calc(50% - 50vw + env(safe-area-inset-right))",
                    }}
                >
                    <div className="absolute -top-4 -left-16 -right-16 h-[360px] sm:h-[420px] md:h-[600px] opacity-40 dark:opacity-50">
                        {/* Prefer CSS radial-gradients for maximum browser compatibility */}
                        <MeshGradientCSS
                            className="h-full w-full"
                            points={DEFAULT_POINTS}
                            blur={60}
                            opacity={0.9}
                        />
                    </div>
                </div>
                <div className="relative z-10 mx-auto max-w-screen-2xl">
                    <IndexHero />
                </div>
            </section>

            <div className="relative lg:my-24 my-16 space-y-8">
                <h2 className="font-display font-semibold tracking-tight text-2xl text-heading">
                    Selected projects
                </h2>
                <BlockGrid>
                    {allPostsData
                        .slice(0, 4)
                        .map(
                            ({
                                id,
                                title,
                                description,
                                heroImage,
                                heroImageAlt,
                                canonical,
                            }) => (
                                <WorkBlock
                                    key={id}
                                    title={title}
                                    url={canonical ? canonical : `/work/${id}`}
                                    description={description}
                                    image={`/images/${id}/${heroImage}`}
                                    imageAlt={heroImageAlt}
                                />
                            ),
                        )}
                </BlockGrid>
            </div>
        </Layout>
    );
};

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
