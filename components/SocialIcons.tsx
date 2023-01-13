import React from 'react'

import Twitter from '../public/vectors/twitter.svg'
import Mastodon from '../public/vectors/mastodon.svg'
import LinkedIn from '../public/vectors/linkedin.svg'
import Dribbble from '../public/vectors/dribbble.svg'
import Behance from '../public/vectors/behance.svg'
import Link from 'next/link'

const classes = 'h-10 w-10 mr-2 hover:bg-white bg-gray-50 border border-transparent hover:border-gray-100 box-content rounded-full '

const svgClasses = 'relative mx-2 scale-90 -left-0.5 top-1.5 fill-current'

const SocialIcons = () => (
    <div className="flex">
        <div className={classes + "hover:text-twitter"}>
            <Link href="https://twitter.com/itsmichaelwest">
                <span className="sr-only">Twitter</span>
                <Twitter className={svgClasses} />
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
        <div className={classes + "hover:text-dribbble"}>
            <Link href="https://dribbble.com/itsmichaelwest">
                <span className="sr-only">Dribbble</span>
                <Dribbble className={svgClasses} />
            </Link>
        </div>
        <div className={classes + "hover:text-behance"}>
            <Link href="https://www.behance.net/itsmichaelwest">
                <span className="sr-only">Behance</span>
                <Behance className={svgClasses} />
            </Link>
        </div>
    </div>
)

export default SocialIcons
