import Head from 'next/head'
import Layout from '../../components/Layout'
import Date from '../../components/Date'
import { getAllPostIds, getPostData } from '../../lib/work'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import CustomImage from '../../components/Image'
import Image from 'next/image'
import rehypeImgSize from 'rehype-img-size'
import NoMSFTDisclaimer from '../../components/NoMSFTDisclaimer'
import Button from '../../components/Button'
import siteMetadata from '../../siteMetadata'

const components = {
    img: CustomImage
}

const Post = ({ postData, mdxSource }) => (
    <Layout>
        <Head>
            <title>{postData.title} - {siteMetadata.title}</title>
            <meta name="description" content={postData.description}/>

            <meta property="og:title" content={postData.title} />
            <meta property="og:type" content="article" />
            <meta property="og:image" content={`${siteMetadata.siteURL}images/${postData.id}/${postData.featuredImage}`} />
            <meta property="og:description" content={postData.description} />
            <meta property="og:site_name" content={siteMetadata.title} />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:site" content={siteMetadata.social.twitter} />
            <meta property="twitter:title" content={postData.title} />
            <meta property="twitter:description" content={postData.description} />
            <meta property="twitter:creator" content={siteMetadata.social.twitter} />
            <meta property="twitter:image" content={`${siteMetadata.siteURL}images/${postData.id}/${postData.featuredImage}`} />
        </Head>
        <article className="mb-16">
            <header className="mt-16">
                <p className="font-body text-sm mb-4 text-gray-600">
                    {postData.category} — <Date dateString={postData.date} />
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    <div>
                        <h1 className="text-6xl font-header font-bold mb-8">
                            {postData.title}
                        </h1>
                        {postData.officialURL && 
                        <Button to={postData.officialURL}>
                            {postData.officialURLText}
                        </Button>
                        }
                    </div>
                    {postData.description && 
                    <p>
                        {postData.description}
                    </p>
                    }
                </div>
                {postData.featuredImage &&
                <div className="mt-32">
                    <Image src={`/images/${postData.id}/${postData.featuredImage}`} alt={postData.featuredImageAlt} width={100} height={70} />
                </div>
                }
            </header>
            <section className="prose mx-auto font-body leading-loose my-24">
                {postData.noMSFT && 
                    <NoMSFTDisclaimer title={postData.title}/>
                }
                <MDXRemote {...mdxSource} components={components} />
            </section>
        </article>
    </Layout>
)

export default Post

export async function getStaticPaths() {
    const paths = getAllPostIds()

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id)

    const mdxSource = await serialize(postData.content, {
        mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [[ rehypeImgSize, { dir: "public" }]]
        }
    })

    return {
        props: {
            postData,
            mdxSource
        }
    }
}
