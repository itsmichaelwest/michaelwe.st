import React from 'react'
import { Link } from 'gatsby'

type ButtonProps = {
    isInternal: boolean,
    to: string,
    style?: string
}

const Button: React.FunctionComponent<ButtonProps> = ({ isInternal, to, style, children }) => {
    let bg: string

    if (style === 'onPrimary') {
        bg = 'bg-white hover:bg-gray-200 '
    } else {
        bg = 'bg-blue text-white hover:bg-blue-700 dark:text-black dark:hover:bg-blue-300 '
    }

    const classes = 'transition-colors px-6 py-2 rounded inline-block font-header'

    return (
        <>
        {
            isInternal ?
            <Link to={to} className={`${bg} ${classes}`}>
                {children} &rarr;
            </Link>
            :
            <a href={to} className={`${bg} ${classes}`}>
                {children} &rarr;
            </a>
        }
        </>
    )
}

export default Button