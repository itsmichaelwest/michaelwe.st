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
    return (
      <header className={!this.state.shown ? "sticky top-0 h-24 sm:h-40 z-20 p-8 sm:px-32 sm:py-16 pointer-events-none" : "bg-white sticky top-0 h-24 sm:h-40 z-20 p-8 sm:px-32 sm:py-16"}>
        <a className="text-xl font-body font-bold tracking-tight text-blue hover:text-blue-700 pointer-events-auto" href="/" aria-label={this.props.siteTitle}>
          Michael.
        </a>
        <div className="float-right pointer-events-auto">
          <nav className="hidden md:inline">
            {this.props.menuLinks.map(link => (
              <Link 
                key={link.link}
                to={link.link}
                className="font-body ml-8 text-gray-400 hover:text-blue"
                activeClassName="font-bold text-gray-900">
                  {link.name}
              </Link>
            ))}
          </nav>
          <div className="-mr-2 -my-2 md:hidden">
            <button type="button" style={{ backdropFilter: 'blur(30px)' }} className="bg-white bg-opacity-10 rounded-md p-2 inline-flex items-center justify-center text-gray-400 text-opacity-80 hover:text-gray-500 hover:text-opacity-100 hover:bg-gray-100 hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue transition-colors" onClick={this.toggleHidden.bind(this)}>
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
