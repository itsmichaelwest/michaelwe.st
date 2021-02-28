import { Link } from "gatsby"
import React from "react"
import avatar from '../images/michael-face.jpg'
import { siteMetadata } from '../../gatsby-config'

interface Header {
    menuLinks: any
}

type State = {
    shown: boolean
}

class Header extends React.Component<Header, State> {
    constructor(props) {
        super(props)
        this.state = {
            shown: false
        }
    }

    componentDidMount() {
        if (!this.state.shown) {
            document.body.style.overflow = 'unset'
        } else {
            document.body.style.overflow = 'hidden'
        }
    }

    toggleHidden() {
        this.setState({
            shown: !this.state.shown
        })
        if (this.state.shown) {
            document.body.style.overflow = 'unset'
        } else {
            document.body.style.overflow = 'hidden'
        }
    }
  
    render() {
        const classes = "flex align-center px-8 sm:px-16 py-8 sm:py-16 z-20 pointer-events-none transition-all z-10"

        return (
            <header className={!this.state.shown ? `${classes}` : `bg-white dark:bg-black ${classes}`}>
                <a className="flex items-center text-xl font-header font-semibold tracking-tight text-gray-900 dark:text-gray-100 hover:text-blue dark:hover:text-blue-300 pointer-events-auto transition-colors" href="/" aria-label={this.props.siteTitle}>
                <div className="flex-initial h-8 w-8 rounded-full overflow-hidden mr-3 shadow-md">
                    <img src={avatar} alt="Photo of Michael West" />
                </div>
                {process.env.NODE_ENV === 'development' ? (
                    'Michael.dev'
                ) : (
                    siteMetadata.title
                )}
                </a>
                <div className="flex-grow pointer-events-auto">
                <div className="hidden float-right lg:flex flex-row items-center">
                    <nav className="flex-auto">
                    {this.props.menuLinks.map(link => (
                        <Link 
                        key={link.link}
                        to={link.link}
                        className="font-header ml-8 text-gray-400 text-opacity-70 hover:text-blue dark:hover:text-blue-300 hover:text-opacity-100 transition-all"
                        activeClassName="font-bold text-gray-900 dark:text-gray-100 dark:text-opacity-100">
                            {link.name}
                        </Link>
                    ))}
                    </nav>
                </div>
                <div className="float-right -my-1 lg:hidden">
                    <button type="button" style={{ backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)' }} className="bg-white dark:bg-black bg-opacity-10 border border-gray-100 dark:border-gray-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 text-opacity-80 hover:text-gray-500 hover:text-opacity-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:bg-opacity-90 outline-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue transition-all hover:shadow" onClick={this.toggleHidden.bind(this)}>
                    {!this.state.shown
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
                {this.state.shown &&
                <div className="absolute top-24 sm:top-32 inset-0 h-screen transition-all bg-white dark:bg-black pointer-events-auto z-10">
                    <nav className="sm:mt-4">
                    {this.props.menuLinks.map(link => (
                        <div key={link.link}>
                        <Link 
                            key={link.link}
                            to={link.link}
                            className="block w-100 h-full px-8 sm:px-16 py-4 sm:py-4 font-header text-black dark:text-gray-100 hover:bg-blue-700 dark:hover:text-black dark:hover:bg-blue-300 hover:text-white"
                            activeClassName="font-bold text-white hover:text-white bg-blue hover:bg-blue-700 dark:hover:bg-blue-300 dark:text-black dark:hover:text-black">
                            {link.name}
                        </Link>
                        </div>
                    ))}
                    </nav>
                </div>
                }
            </header>
        )
    }
}

export default Header
