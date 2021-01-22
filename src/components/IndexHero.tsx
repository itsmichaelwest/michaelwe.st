import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import React from "react"
import Button from "./Button"

class IndexHero extends React.Component {
    render() {
        return (
            <StaticQuery
                query={graphql`
                    query {
                        file(relativePath: { eq: "michael-home.png" }) {
                            childImageSharp {
                                fluid(maxWidth: 1600, quality: 100) {
                                    ...GatsbyImageSharpFluid_withWebp
                                }
                            }
                        }
                    }
                `}
                render={data => (
                    <>
                    <div className='relative h-3/5 bg-gray-100 overflow-hidden'>
                        <div className='absolute z-10 w-100 sm:w-8/12 m-8 sm:mx-32 sm:my-48'>
                            <div className='relative'>
                                <h1 className="text-4xl sm:text-6xl leading-tight">screaming2</h1>
                                <Button isInternal={true} to='/about/'>
                                    About
                                </Button>
                            </div>
                        </div>
                        <Img className='inset-0 h-screen' fluid={data.file.childImageSharp.fluid} alt="Photo of Michael West" />
                    </div>
                    </>
                )}
            />
        )
    }
}

export default IndexHero