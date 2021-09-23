import * as React from 'react'
import { Link } from 'gatsby'

type ButtonProps = {
    isInternal: boolean,
    to: string,
    style?: string
}

const Button: React.FunctionComponent<ButtonProps> = ({ isInternal, to, style, children }) => {
    let bg: string

    if (style === 'onPrimary') {
        bg = 'border-2 border-white text-white hover:bg-white hover:text-black'
    } else {
        bg = 'border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white'
    }

    const classes = 'px-6 py-2 inline-block transition-all'

    return (
        <>
        {
            isInternal ?
            <Link to={to} className={`${bg} ${classes}`}>
                {children}
            </Link>
            :
            <a href={to} className={`${bg} ${classes}`}>
                {children}
            </a>
        }
        </>
    )
}

export default Button