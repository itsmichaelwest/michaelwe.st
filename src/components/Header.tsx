import * as React from 'react'
import { useState } from 'react'
import { Link } from 'gatsby'
import { siteMetadata } from '../../gatsby-config'
import { StaticImage } from 'gatsby-plugin-image'

const Header: React.FunctionComponent = () => {
    const [showMenu, setShowMenu] = useState(false)
    const classes = 'flex px-8 md:px-16 my-16 z-10 font-text items-center justify-between h-8'

    function toggleMenu(): void {
        setShowMenu(!showMenu)
        if (showMenu) {
            document.body.style.overflow = 'visible'
        } else {
            window.scrollTo(0,0)
            document.body.style.overflow = 'hidden'
        }
    }

    function restoreScroll(): void {
        document.body.style.overflow = 'visible'
        setShowMenu(false)
    }

    return (
        <header className={!showMenu ? classes : `${classes} bg-white dark:bg-black`}>
            <Link className="flex items-center text-xl font-semibold tracking-tight hover:text-gray-500 transition-colors" to="/" aria-label={siteMetadata.title}>
                <StaticImage className="flex-initial h-8 w-8 rounded-full mr-3 shadow-md overflow-hidden" src="../images/michael-face.jpg" alt="Photo of Michael West" style={{ WebkitMaskImage: '-webkit-radial-gradient(white,black)' }} />
                {process.env.NODE_ENV === 'development' ? (
                    'Michael.dev'
                ) : (
                    siteMetadata.title
                )}
            </Link>
            <div>
                <nav className="hidden float-right lg:flex flex-row gap-8">
                {siteMetadata.menuLinks.map(link => (
                    <Link
                        key={link.link}
                        to={link.link}
                        className="text-gray-600 hover:text-black transition-colors"
                        activeClassName="font-bold">
                        {link.name}
                    </Link>
                ))}
                </nav>
                <div className="float-right -my-1 lg:hidden">
                    <button type="button" className="border border-gray-200 p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-none transition-all" onClick={toggleMenu}>
                    {!showMenu
                    ?
                    <div>
                        <span className="sr-only">Open menu</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    :
                    <div>
                        <span className="sr-only">Close menu</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    }
                    </button>
                </div>
            </div>
            {showMenu &&
            <div className="absolute top-40 inset-0 h-screen bg-white z-20">
                <nav>
                {siteMetadata.menuLinks.map(link => (
                    <Link 
                        key={link.link}
                        to={link.link}
                        className="block w-100 h-full px-8 py-4 hover:bg-gray-700 hover:text-white"
                        activeClassName="font-bold bg-gray-400 hover:bg-gray-700"
                        onClick={restoreScroll}>
                        {link.name}
                    </Link>
                ))}
                </nav>
            </div>
            }
        </header>
    )
}

export default Header