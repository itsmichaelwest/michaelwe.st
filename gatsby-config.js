module.exports = {
  siteMetadata: {
    title: `Michael West`,
    menuLinks: [
      {
        name: 'Blog',
        link: '/blog/'
      }
    ],
    siteURL: `https://www.michaelwe.st/`,
    description: `Michael is designing things.`,
    copyright: `© ${new Date().getFullYear()}. Hello from the UK!`,
    author: `Michael West`,
    social: {
      twitter: `@itsmichaelwest`,
    },
  },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: `images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        ignore: process.env.NODE_ENV === `production` ? [`**/draft-*`] : [],
        name: `content`,
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          `gatsby-remark-relative-images`,
          `gatsby-remark-unwrap-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              linkImagesToOriginal: false,
              showCaptions: true,
              withWebp: true,
              quality: 80,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-external-links`,
            options: {
              target: `_self`,
              rel: `nofollow`
            }
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Michael West`,
        short_name: `Michael West`,
        start_url: `/`,
        background_color: `#FFFFFF`,
        theme_color: `#62BFED`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg`,
        icon_options: {
          purpose: `any maskable`
        },
      },
    },
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        precachePages: [`/about/`],
      },
    },
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteURL
                site_url: siteURL
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx }}) => {
              return allMdx.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteURL + edge.node.fields.slug,
                  guid: site.siteMetadata.siteURL + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMdx(sort: { order: DESC, fields: [frontmatter___date] },) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/feed.xml",
            title: "Michael West RSS Feed",
          }
        ]
      },
    },
    `gatsby-plugin-catch-links`,
  ],
}
