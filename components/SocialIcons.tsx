import React from 'react'
import Mastodon from '../public/vectors/mastodon.svg'
import LinkedIn from '../public/vectors/linkedin.svg'
import Link from 'next/link'
import TwitterX from '../public/vectors/twitter-x.svg'

const classes = 'h-10 w-10 mr-2 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-black bg-gray-100 dark:bg-gray-900 border border-transparent hover:border-gray-100 dark:hover:border-gray-900 box-content rounded-full '

const svgClasses = 'relative mx-2 scale-90 -left-0.5 top-1.5 fill-current'

const SocialIcons = () => (
    <div className="flex">
        <div className={classes + "hover:text-gray-500"}>
            <Link href="https://twitter.com/itsmichaelwest">
                <span className="sr-only">X (formerly Twitter)</span>
                <TwitterX className="relative mx-2 scale-90 top-2 fill-current" />
            </Link>
        </div>
        <div className={classes + "hover:text-mastodon"}>
            <Link href="https://mastodon.social/@michaelwest">
                <span className="sr-only">Mastodon</span>
                <Mastodon className={svgClasses} />
            </Link>
        </div>
        <div className={classes + "hover:text-linkedin"}>
            <Link href="https://www.linkedin.com/in/itsmichaelwest">
                <span className="sr-only">LinkedIn</span>
                <LinkedIn className={svgClasses} />
            </Link>
        </div>
    </div>
)

export default SocialIcons
