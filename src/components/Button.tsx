import React from 'react'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'

const Button = ({ isInternal, style, to, children }) => {
    let bg: string

    if (style === 'onPrimary') {
        bg = 'bg-white hover:bg-gray-200 '
    } else {
        bg = 'bg-blue text-white hover:bg-blue-700 dark:text-black dark:hover:bg-blue-300 '
    }

    const classes = 'transition-colors px-6 py-2 rounded inline-block font-header'

    return (
        isInternal 
        ?
        <Link to={to} className={`${bg} ${classes}`}>
            {children} &rarr;
        </Link>
        :
        <a href={to} className={`${bg} ${classes}`}>
            {children} &rarr;
        </a>
    )
}

Button.propTypes = {
    className: PropTypes.string,
    isInternal: PropTypes.bool,
    style: PropTypes.string,
    to: PropTypes.string,
    children: PropTypes.node
}

export default Button
