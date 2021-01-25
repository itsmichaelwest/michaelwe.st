const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  const articleTemplate = path.resolve(`./src/templates/page.tsx`)

  const result = await graphql(`
    {
      allMdx(
        sort: { order: DESC, fields: [frontmatter___date] }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              aliases
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  // Create articles for all pages
  const posts = result.data.allMdx.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null: posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: articleTemplate,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })

    console.log("Created page " + post.node.fields.slug)

    if (post.node.frontmatter.aliases) {
      var i
      for (i = 0; i < post.node.frontmatter.aliases.length; i++) {
        createRedirect({
          fromPath: post.node.frontmatter.aliases[i],
          toPath: post.node.fields.slug,
          isPermanent: true,
        })

        console.log("Created redirect from " + post.node.frontmatter.aliases[i] + " to " + post.node.fields.slug)
      }
    }
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  
  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  } 
}