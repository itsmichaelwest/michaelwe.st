import { Link } from "gatsby"
import React from "react"

interface Header {
  siteTitle: string,
  menuLinks: any,
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
    const classes = "sticky max-w-screen-lg mx-auto top-0 h-24 sm:h-40 z-20 p-8 sm:px-32 sm:py-16 pointer-events-none"

    return (
      <header className={!this.state.shown ? `${classes}` : `bg-white ${classes}`}>
        <a className="text-xl font-body font-bold tracking-tight text-blue hover:text-blue-700 pointer-events-auto" href="/" aria-label={this.props.siteTitle}>
          {process.env.NODE_ENV === 'development' ? (
            <svg className="inline-block shadow-md" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 32L0 0V32H32Z" fill="#3590F3"/>
              <path d="M0 32L32 0V32H0Z" fill="#84BCF7"/>
              <path d="M16 16L0 32H32L16 16Z" fill="#1B6AEB"/>
              <rect x="9" y="19" width="21" height="11" rx="2" fill="#222222"/>
              <path d="M15.37 22.7H13.6V26.948H15.37C16.726 26.948 17.578 26.024 17.578 24.812C17.578 23.588 16.726 22.7 15.37 22.7ZM14.932 25.76V23.864H15.25C15.838 23.864 16.228 24.194 16.228 24.812C16.228 25.43 15.838 25.76 15.25 25.76H14.932Z" fill="white"/>
              <path d="M20.891 22.7H18.059V26.948H20.891V25.886H19.391V25.286H20.711V24.284H19.391V23.762H20.891V22.7Z" fill="white"/>
              <path d="M23.3849 25.622L22.5089 22.7H21.0929L22.5209 26.948H24.2429L25.6709 22.7H24.2549L23.3849 25.622Z" fill="white"/>
            </svg>
          ) : (
            <svg className="inline-block shadow-md" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 32H-9.53674e-07L32 0V32Z" fill="#62BFED"/>
                <path d="M0 32H32L0 0V32Z" fill="#3590F3"/>
                <path d="M16 16L0 32H32L16 16Z" fill="#146CE2"/>
            </svg>
          )
          }
        </a>
        <div className="float-right pointer-events-auto">
          <nav className="hidden lg:inline">
            {this.props.menuLinks.map(link => (
              <Link 
                key={link.link}
                to={link.link}
                className="font-body ml-8 text-gray-400 text-opacity-70 hover:text-blue hover:text-opacity-100 transition-all"
                activeClassName="font-bold text-gray-900">
                  {link.name}
              </Link>
            ))}
          </nav>
          <div className="-mr-1 -my-1 lg:hidden">
            <button type="button" style={{ backdropFilter: 'blur(30px)' }} className="bg-white bg-opacity-10 rounded-md p-2 inline-flex items-center justify-center text-gray-400 text-opacity-80 hover:text-gray-500 hover:text-opacity-100 hover:bg-gray-100 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue transition-colors   shadow-sm" onClick={this.toggleHidden.bind(this)}>
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
        <div className="absolute top-24 sm:top-32 inset-0 h-screen transition transform origin-top-right bg-white pointer-events-auto">
          <nav className="sm:mt-4">
          {this.props.menuLinks.map(link => (
              <div key={link.link}>
              <Link 
                  key={link.link}
                  to={link.link}
                  className="block w-100 h-full px-8 py-4 sm:px-32 sm:py-4 font-body text-black hover:bg-blue-700 hover:text-white"
                  activeClassName="font-bold text-white bg-blue hover:bg-blue-700 hover:text-white">
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
