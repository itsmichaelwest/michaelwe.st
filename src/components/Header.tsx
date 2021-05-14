import React, { useState } from 'react'
import { Link } from 'gatsby'
import { siteMetadata } from '../../gatsby-config'
import { StaticImage } from 'gatsby-plugin-image'

const Header: React.FunctionComponent = () => {
    const [showMenu, setShowMenu] = useState(false)
    const classes = 'flex align-center px-8 sm:px-16 py-8 sm:py-16 z-20 pointer-events-none transition-all z-10'

    function toggleMenu(): void {
        setShowMenu(!showMenu)
        if (showMenu) {
            document.body.style.overflow = 'unset'
        } else {
            document.body.style.overflow = 'hidden'
        }
    }

    return (
        <header className={!showMenu ? classes : `${classes} bg-white dark:bg-black`}>
            <Link className="flex items-center text-xl font-header font-semibold tracking-tight text-gray-900 dark:text-gray-100 hover:text-blue dark:hover:text-blue-300 pointer-events-auto transition-colors" to="/" aria-label={siteMetadata.title}>
                <StaticImage className="flex-initial h-8 w-8 rounded-full mr-3 shadow-md overflow-hidden" src="../images/michael-face.jpg" alt="Photo of Michael West" style={{ WebkitMaskImage: '-webkit-radial-gradient(white,black)' }} />
                {process.env.NODE_ENV === 'development' ? (
                    'Michael.dev'
                ) : (
                    siteMetadata.title
                )}
            </Link>
            <div className="flex-grow pointer-events-auto">
                <div className="hidden float-right lg:flex flex-row items-center">
                    <nav className="flex-auto">
                    {siteMetadata.menuLinks.map(link => (
                        <Link 
                            key={link.link}
                            to={link.link}
                            className="font-header ml-8 text-gray-600 dark:text-gray-500 hover:text-blue dark:hover:text-blue-300 hover:text-opacity-100 transition-all"
                            activeClassName="font-bold text-gray-800 dark:text-gray-100 dark:text-opacity-100">
                            {link.name}
                        </Link>
                    ))}
                    </nav>
                </div>
                <div className="float-right -my-1 lg:hidden">
                    <button type="button" className="bg-white dark:bg-black bg-opacity-10 border border-gray-100 dark:border-gray-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 text-opacity-80 hover:text-gray-500 hover:text-opacity-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:bg-opacity-90 outline-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue transition-all hover:shadow" onClick={toggleMenu}>
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
            <div className="absolute top-24 sm:top-32 inset-0 h-screen transition-all bg-white dark:bg-black pointer-events-auto z-20">
                <nav className="sm:mt-4">
                {siteMetadata.menuLinks.map(link => (
                    <Link 
                        key={link.link}
                        to={link.link}
                        className="block w-100 h-full px-8 sm:px-16 py-4 sm:py-4 font-header text-black dark:text-gray-100 hover:bg-blue-700 dark:hover:text-black dark:hover:bg-blue-300 hover:text-white"
                        activeClassName="font-bold text-white hover:text-white bg-blue hover:bg-blue-700 dark:hover:bg-blue-300 dark:text-black dark:hover:text-black">
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